/**
 * Seeds a demo account per language and takes the store screenshots of the web app. Runs in the
 * runner container that run.sh starts, which sets COOKPAL_WEB_URL and COOKPAL_API_URL and passes
 * on --lang en,de and --only recipe-list,weekplan.
 */
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {parseArgs} from 'node:util';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import {LANGUAGES} from './sample-data.mjs';
import {renderScanPhoto} from './scan-photo.mjs';
import {seed} from './seed.mjs';
import {labelsFor, SHOTS} from './shots.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
if (!process.env.COOKPAL_WEB_URL || !process.env.COOKPAL_API_URL) {
  console.error('COOKPAL_WEB_URL and COOKPAL_API_URL are not set. Start the screenshots with run.sh.');
  process.exit(1);
}
const WEB_URL = process.env.COOKPAL_WEB_URL.replace(/\/$/, '');
const API_URL = process.env.COOKPAL_API_URL.replace(/\/$/, '');
const PHOTOS_DIR = path.join(root, 'assets', 'photos');
const OUT_DIR = path.join(root, 'out');

// As wide as most current phones (393 css px), exported at 1080 x 2160: 1:2 is as tall as Google
// Play accepts, since neither side may be more than twice the other.
const DEVICES = [
  {name: 'phone', viewport: {width: 393, height: 786}, deviceScaleFactor: 1080 / 393},
];

const LOCALES = {en: 'en-US', de: 'de-DE'};

// The app follows the system theme unless told otherwise in its settings.
const COLOR_SCHEME = 'dark';

const {values: args} = parseArgs({options: {
  lang: {type: 'string', default: LANGUAGES.join(',')},
  only: {type: 'string'},
}});
const languages = args.lang.split(',');
const shots = args.only ? SHOTS.filter((shot) => args.only.split(',').includes(shot.name)) : SHOTS;
if (shots.length === 0) {
  throw new Error(`No shot is called ${args.only}; there are ${SHOTS.map((shot) => shot.name).join(', ')}`);
}

const reachable = async (url) => fetch(url).then(() => true, () => false);
for (const [what, url] of [['web app', WEB_URL], ['apiserver', `${API_URL}/api/v1/instance`]]) {
  if (!await reachable(url)) {
    console.error(`The ${what} is not reachable at ${url}. Start the screenshots with run.sh.`);
    process.exit(1);
  }
}

// Waits for what a screen fetches, and for the pictures it shows to be drawn.
const settle = async (page) => {
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() => [...document.images].every((image) => image.complete));
  await page.waitForTimeout(800);
};

// In Docker the app is served from plain http addresses that are not localhost; Chromium would
// hold back what it reserves for secure pages, such as crypto.randomUUID.
const browser = await chromium.launch({
  args: [`--unsafely-treat-insecure-origin-as-secure=${WEB_URL},${API_URL}`],
});
try {
  for (const lang of languages) {
    console.log(`[${lang}] seeding demo account`);
    const account = await seed({apiUrl: API_URL, lang, photosDir: PHOTOS_DIR});
    const scanPhoto = await renderScanPhoto(browser, lang, PHOTOS_DIR, path.join(os.tmpdir(), `scan-${lang}.jpg`));

    for (const device of DEVICES) {
      const dir = path.join(OUT_DIR, lang, device.name);
      await fs.mkdir(dir, {recursive: true});

      for (const [index, shot] of shots.entries()) {
        const context = await browser.newContext({
          ...device, isMobile: true, hasTouch: true, locale: LOCALES[lang], colorScheme: COLOR_SCHEME,
        });
        // Signed in the way the web app remembers it; only once, so a refreshed token is kept.
        await context.addInitScript(({token, refreshToken, apiUrl}) => {
          if (!localStorage.getItem('authToken')) {
            localStorage.setItem('authToken', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('backendUrl', apiUrl);
          }
        }, {token: account.token, refreshToken: account.refreshToken, apiUrl: API_URL});
        const page = await context.newPage();
        const go = async (route) => {
          await page.goto(`${WEB_URL}/${route}`);
          await settle(page);
        };

        const file = path.join(dir, `${String(SHOTS.indexOf(shot) + 1).padStart(2, '0')}-${shot.name}.png`);
        try {
          await shot.open({page, go, labels: labelsFor(lang), recipeIds: account.recipeIds, scanPhoto});
          await page.screenshot({path: file});
          console.log(`[${lang}] ${index + 1}/${shots.length} ${path.relative(root, file)}`);
        } catch (error) {
          await page.screenshot({path: file.replace(/\.png$/, '.failed.png')}).catch(() => undefined);
          throw new Error(`Shot "${shot.name}" (${lang}, ${device.name}) failed: ${error.message}`, {cause: error});
        } finally {
          await context.close();
        }
      }
    }
  }
} finally {
  await browser.close();
}
