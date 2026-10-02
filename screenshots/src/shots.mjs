/**
 * What to photograph, in store order. Each shot gets a fresh browser page already signed in to
 * the seeded account, and leaves it looking the way the screenshot should.
 */

import {IMPORT_URL} from './sample-data.mjs';

// The few texts a shot has to find on screen, from the app's en.json and de.json.
const LABELS = {
  en: {choosePhoto: 'Choose a photo', startTimer: 'Start', longTimer: '45 minutes', tickedIngredient: 'chopped tomatoes'},
  de: {choosePhoto: 'Foto auswählen', startTimer: 'Start', longTimer: '45 Minuten', tickedIngredient: 'gehackte Tomaten'},
};

/**
 * The first of the matches that is on screen. Pagers keep their other pages mounted beside the
 * shown one, so the same text is often there several times.
 */
const onScreen = async (page, locator) => {
  const width = page.viewportSize().width;
  for (const candidate of await locator.all()) {
    const box = await candidate.boundingBox();
    if (box && box.x >= 0 && box.x + box.width <= width) {
      return candidate;
    }
  }
  throw new Error(`Nothing on screen matches ${locator}`);
};

export const SHOTS = [
  {
    name: 'recipe-list',
    open: async ({go}) => go('myRecipes'),
  },
  {
    name: 'recipe-detail',
    open: async ({go, recipeIds}) => go(`recipe?recipeId=${recipeIds.shakshuka}`),
  },
  {
    name: 'weekplan',
    open: async ({go}) => go('weekly'),
  },
  {
    name: 'shopping-list',
    open: async ({go}) => go('shopping'),
  },
  {
    name: 'guided-cooking',
    open: async ({page, go, recipeIds, labels}) => {
      await go(`cook?recipeId=${recipeIds.bolognese}&scaledServings=4&initialStep=3`);
      await (await onScreen(page, page.getByText(labels.tickedIngredient, {exact: true}))).click();
      const timer = await onScreen(page, page.getByText(labels.longTimer, {exact: true}));
      await timer.locator('xpath=..').getByText(labels.startTimer, {exact: true}).click();
      // Long enough that the countdown has visibly moved.
      await page.waitForTimeout(3200);
    },
  },
  {
    name: 'recipe-scan',
    open: async ({page, go, labels, scanPhoto}) => {
      // Page detection needs the ML subsystem. Answered here instead, a little off at one
      // corner, which is the one being dragged into place in the screenshot.
      const [topLeft, topRight, bottomRight, bottomLeft] = scanPhoto.corners;
      const detected = [topLeft, [topRight[0] - 0.07, topRight[1] + 0.06], bottomRight, bottomLeft];
      await page.route('**/api/v1/ml/page-edges', (route) => route.fulfill({
        json: {corners: detected, confidence: 0.8, detected: true},
      }));

      await go('scanRecipe');
      const chooser = page.waitForEvent('filechooser');
      await page.getByText(labels.choosePhoto, {exact: true}).click();
      await (await chooser).setFiles(scanPhoto.file);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // The corner handles, in crop order. Two opposite ones say where the photo is drawn.
      const handles = await page.$$eval('div', (divs) => divs
          .filter((div) => getComputedStyle(div).cursor === 'pointer' &&
            div.offsetWidth === 48 && div.offsetHeight === 48)
          .map((div) => {
            const box = div.getBoundingClientRect();
            return [box.left + box.width / 2, box.top + box.height / 2];
          }));
      if (handles.length !== 4) {
        throw new Error(`Expected four crop handles, found ${handles.length}`);
      }
      const scale = [0, 1].map((axis) =>
        (handles[2][axis] - handles[0][axis]) / (detected[2][axis] - detected[0][axis]));
      const origin = [0, 1].map((axis) => handles[0][axis] - detected[0][axis] * scale[axis]);
      const toScreen = ([x, y]) => [origin[0] + x * scale[0], origin[1] + y * scale[1]];

      // Held down most of the way to the real corner, so the magnifier is showing.
      const [fromX, fromY] = handles[1];
      const [toX, toY] = toScreen(topRight);
      await page.mouse.move(fromX, fromY);
      await page.mouse.down();
      await page.mouse.move(fromX + (toX - fromX) * 0.8, fromY + (toY - fromY) * 0.8, {steps: 12});
      await page.waitForTimeout(400);
    },
  },
  {
    name: 'recipe-import',
    // The link is only typed in; importing it would need the internet.
    open: async ({page, go}) => {
      await go('import');
      const field = page.getByRole('textbox');
      await field.fill(IMPORT_URL);
      // Blurred, so the label has floated up and the field is no longer focused.
      await field.blur();
      await page.waitForTimeout(600);
    },
  },
  {
    name: 'nutrition',
    open: async ({page, go, settle, recipeIds}) => {
      await go(`recipe?recipeId=${recipeIds.shakshuka}`);
      await page.getByTestId('nutrition-row').click();
      await page.getByTestId('nutrition-sheet').waitFor();
      await settle(page);
    },
  },
  {
    // The week the planner proposes after "Plan my week", seeded through the API instead of
    // answered in the wizard, whose questions would not change what the draft shows.
    name: 'week-suggestion',
    open: async ({page, go, draftId}) => {
      await go(`planDraft?draftId=${draftId}`);
      // The screen jumps down while it loads; scrolled back until it has stayed at the top.
      const scrollToTop = () => page.evaluate(() => {
        const scrolled = [...document.querySelectorAll('*')].filter((element) => element.scrollTop > 0);
        scrolled.forEach((element) => element.scrollTop = 0);
        return scrolled.length > 0;
      });
      for (let stable = 0; stable < 4;) {
        await page.waitForTimeout(400);
        stable = await scrollToTop() ? 0 : stable + 1;
      }
    },
  },
  {
    name: 'household',
    open: async ({go, createHousehold}) => go(`household?householdId=${await createHousehold()}`),
  },
];

export const labelsFor = (lang) => LABELS[lang];
