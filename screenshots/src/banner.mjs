/**
 * The social preview image of the landing page: Cookpal's green, the app icon, the name, a
 * tagline and three screenshots in phone frames. Exactly 1200 x 630, the size link previews use.
 */
import fs from 'node:fs/promises';

const TAGLINES = {
  en: 'Your personal recipe book, with week plan and shopping list',
  de: 'Dein persönliches Rezeptbuch, mit Wochenplan und Einkaufsliste',
};

const WIDTH = 1200;
const HEIGHT = 630;

const dataUrl = (bytes, type) => `data:${type};base64,${Buffer.from(bytes).toString('base64')}`;

// Each phone sits at its own height, so the three do not form a flat row.
const PHONE_TOPS = [150, 90, 190];

const template = ({icon, tagline, screenshots}) => `<!doctype html>
<html>
<style>
  * { box-sizing: border-box; margin: 0; }
  body {
    width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; position: relative;
    background: #295700; color: #fff; font-family: system-ui, 'Noto Sans', sans-serif;
  }
  .brand { position: absolute; left: 64px; top: 0; bottom: 0; width: 440px; display: flex; flex-direction: column; justify-content: center; gap: 28px; }
  .icon { width: 128px; height: 128px; border-radius: 28px; box-shadow: 0 8px 24px rgba(0, 0, 0, .35); }
  .name { font-size: 84px; font-weight: 700; letter-spacing: -1px; line-height: 1; }
  .tagline { font-size: 28px; line-height: 1.3; opacity: .85; }
  .phone {
    position: absolute; width: 200px; height: 400px; border: 6px solid #111; border-radius: 30px;
    box-shadow: 0 14px 34px rgba(0, 0, 0, .45); object-fit: cover; background: #111;
  }
</style>
<body>
  <div class="brand">
    <img class="icon" src="${icon}">
    <div class="name">Cookpal</div>
    <div class="tagline">${tagline}</div>
  </div>
  ${screenshots.map((screenshot, index) =>
    `<img class="phone" src="${screenshot}" style="left: ${540 + index * 216}px; top: ${PHONE_TOPS[index]}px">`).join('\n  ')}
</body>
</html>`;

/**
 * @param {import('playwright').Browser} browser
 * @param {object} options
 * @param {string} options.lang
 * @param {string} options.iconUrl the app icon, as the web app serves it
 * @param {string[]} options.screenshotFiles three PNGs, left to right
 * @param {string} options.outFile
 */
export const renderBanner = async (browser, {lang, iconUrl, screenshotFiles, outFile}) => {
  const response = await fetch(iconUrl);
  if (!response.ok) {
    throw new Error(`The app icon is not at ${iconUrl} (${response.status})`);
  }
  const icon = dataUrl(await response.arrayBuffer(), 'image/png');
  const screenshots = await Promise.all(screenshotFiles.map(async (file) => dataUrl(await fs.readFile(file), 'image/png')));

  const page = await browser.newPage({viewport: {width: WIDTH, height: HEIGHT}});
  try {
    await page.setContent(template({icon, tagline: TAGLINES[lang], screenshots}));
    await page.waitForFunction(() => [...document.images].every((image) => image.complete));
    await page.screenshot({path: outFile});
  } finally {
    await page.close();
  }
};
