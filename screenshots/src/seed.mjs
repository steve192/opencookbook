/**
 * Fills a fresh demo account through the public REST API, the same way the app would, so the
 * screenshots show what the server really makes of the data (nutrition, aisles, icons).
 */
import {randomUUID} from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  DISPLAY_NAME, GROUPS, HOUSEHOLD_NAME, PARTNER_NAME, PLANNING_PROFILE, recipesIn, recipeTitle, shoppingIn, weekIn,
} from './sample-data.mjs';

const PASSWORD = 'screenshots-demo-password';

const accountFor = (lang, role = '') => ({email: `screenshots-${lang}${role}@example.com`, password: PASSWORD});

class Api {
  constructor(baseUrl, lang) {
    this.baseUrl = `${baseUrl}/api/v1`;
    this.lang = lang;
    this.token = undefined;
  }

  async call(method, apiPath, body, {allowFailure = false} = {}) {
    const headers = {'Accept-Language': this.lang};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    if (body !== undefined && !(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(body);
    }
    const response = await fetch(this.baseUrl + apiPath, {method, headers, body});
    if (!response.ok && !allowFailure) {
      throw new Error(`${method} ${apiPath} answered ${response.status}: ${await response.text()}`);
    }
    const text = await response.text();
    return {ok: response.ok, status: response.status, data: text ? JSON.parse(text) : undefined};
  }

  get = (apiPath) => this.call('GET', apiPath).then((response) => response.data);
  post = (apiPath, body) => this.call('POST', apiPath, body).then((response) => response.data);
  put = (apiPath, body) => this.call('PUT', apiPath, body).then((response) => response.data);
}

// Monday of the current week, as the weekplan counts it.
const mondayOf = (date) => {
  const monday = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));
  return monday;
};

const isoDay = (monday, offset) => {
  const day = new Date(monday);
  day.setUTCDate(day.getUTCDate() + offset);
  return day.toISOString().slice(0, 10);
};

/**
 * Starts the account over: deleted if it exists, then signed up again. Needs an apiserver that
 * activates accounts on signup, which docker-compose.yml configures.
 */
const freshAccount = async (api, role = '') => {
  const {email, password} = accountFor(api.lang, role);
  const existing = await api.call('POST', '/users/login', {emailAddress: email, password}, {allowFailure: true});
  if (existing.ok) {
    api.token = existing.data.token;
    await api.call('DELETE', '/users/self');
    api.token = undefined;
  }
  await api.post('/users/signup', {emailAddress: email, password});
  const login = await api.call('POST', '/users/login', {emailAddress: email, password}, {allowFailure: true});
  if (!login.ok) {
    throw new Error(`Signing in as ${email} failed (${login.status}). The apiserver must activate accounts ` +
      'on signup (opencookbook.activate-users-after-signup), as the one in docker-compose.yml does.');
  }
  api.token = login.data.token;
  return login.data;
};

const uploadPhoto = async (api, photosDir, photo) => {
  const bytes = await fs.readFile(path.join(photosDir, `${photo}.jpg`));
  const form = new FormData();
  form.append('image', new Blob([bytes], {type: 'image/jpeg'}), `${photo}.jpg`);
  return (await api.post('/recipes-images', form)).uuid;
};

// The apiserver imports the catalogue after it has started. Recipes saved before the matcher is
// ready keep unlinked ingredients, which the nutrition sheet then shows as unknown.
const waitForCatalogue = async (api) => {
  for (let attempt = 0; attempt < 120; attempt++) {
    if ((await api.get('/catalogue/search?q=egg&limit=1')).length > 0) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error('The ingredient catalogue is still not ready after four minutes.');
};

const seedRecipes = async (api, photosDir) => {
  const groups = {};
  for (const [key, title] of Object.entries(GROUPS)) {
    groups[key] = await api.post('/recipe-groups', {title: title[api.lang]});
  }
  const ids = {};
  for (const recipe of recipesIn(api.lang)) {
    const uuid = await uploadPhoto(api, photosDir, recipe.photo);
    const created = await api.post('/recipes', {
      ...recipe.body,
      images: [{uuid}],
      recipeGroups: recipe.groups.map((key) => ({id: groups[key].id})),
    });
    ids[recipe.key] = created.id;
  }
  return ids;
};

const seedWeekplan = async (api, recipeIds, monday) => {
  for (const [offset, meals] of weekIn(api.lang).entries()) {
    const recipes = meals.map((meal) => meal.text ?
      {type: 'SIMPLE_RECIPE', id: randomUUID(), title: meal.text} :
      {
        type: 'NORMAL_RECIPE',
        id: recipeIds[meal.recipe],
        servings: meal.leftoverOf === undefined ? meal.servings : null,
        leftoverOf: meal.leftoverOf === undefined ? null : isoDay(monday, meal.leftoverOf),
      });
    await api.put(`/weekplan/${isoDay(monday, offset)}`, {recipes});
  }
};

const seedShoppingList = async (api, monday) => {
  await api.put('/users/self/shoppingProvider', {provider: 'COOKPAL'});
  const [list] = await api.get('/shopping/lists');
  // Where each recipe is planned, so an item says which meal it is for.
  const plannedOn = {};
  weekIn(api.lang).forEach((meals, offset) => meals.forEach((meal) => {
    if (meal.recipe && !meal.leftoverOf && !(meal.recipe in plannedOn)) {
      plannedOn[meal.recipe] = isoDay(monday, offset);
    }
  }));

  const ops = [];
  for (const item of shoppingIn(api.lang)) {
    const itemId = randomUUID();
    ops.push({
      type: 'ADD', opId: randomUUID(), itemId, name: item.name, spec: item.spec,
      sources: item.recipe ? [{title: recipeTitle(item.recipe, api.lang), planDate: plannedOn[item.recipe] ?? null}] : [],
    });
    if (item.bought) {
      ops.push({type: 'BUY', opId: randomUUID(), itemId});
    }
  }
  await api.post(`/shopping/lists/${list.id}/ops?since=0`, {ops});
};

// Not part of seed(): a household adds switchers to the week plan, the shopping list and the recipe list,
// which the other screenshots should not show. The household shot calls it right before it is taken.
const seedHousehold = async (api, apiUrl) => {
  const partner = new Api(apiUrl, api.lang);
  await freshAccount(partner, '-partner');
  await partner.post('/users/self/onboarding', {displayName: PARTNER_NAME});

  const household = await api.post('/households', {name: HOUSEHOLD_NAME, shareRecipes: true});
  const invite = await api.post(`/households/${household.id}/invites`);
  await partner.post(`/household-invites/${invite.token}/accept`, {shareRecipes: true});
  return household.id;
};

// A proposed week for next Monday on, left unaccepted, which is what the planner shows after "Plan my week".
const seedPlanDraft = async (api, monday) => {
  const {name, workdays, weekend, meals} = PLANNING_PROFILE;
  const efforts = [...workdays.map((day) => [day, 'SIMPLE']), ...weekend.map((day) => [day, 'ANY'])];
  const profile = await api.post('/planning/profiles', {
    name: name[api.lang],
    defaultProfile: true,
    householdSize: 2,
    cooldownWeeks: 0,
    leftoversAllowed: true,
    spreadVariety: true,
    meals: meals.map((mealType) => ({mealType, days: Object.fromEntries(efforts)})),
  });
  const draft = await api.post('/planning/drafts', {profileId: profile.id, startDate: isoDay(monday, 7), days: 7});
  return draft.id;
};

/**
 * Creates the demo account for one language and everything in it.
 *
 * @return {Promise<{token: string, refreshToken: string, recipeIds: Record<string, number>,
 *   draftId: number, createHousehold: () => Promise<string>}>}
 */
export const seed = async ({apiUrl, lang, photosDir, now = new Date()}) => {
  const api = new Api(apiUrl, lang);
  const tokens = await freshAccount(api);
  await api.post('/users/self/onboarding', {displayName: DISPLAY_NAME});
  await waitForCatalogue(api);
  const recipeIds = await seedRecipes(api, photosDir);
  const monday = mondayOf(now);
  await seedWeekplan(api, recipeIds, monday);
  await seedShoppingList(api, monday);
  const draftId = await seedPlanDraft(api, monday);
  return {
    token: tokens.token, refreshToken: tokens.refreshToken, recipeIds, draftId,
    createHousehold: () => seedHousehold(api, apiUrl),
  };
};
