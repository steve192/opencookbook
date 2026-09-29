/**
 * Renders the "photo" of a cookbook page for the scanning screenshot: a printed recipe lying on
 * a wooden table, drawn in the browser rather than photographed so it needs no permission from
 * anybody. Also reports where the page's corners ended up, which is what page detection would
 * have found.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import {SCAN_PAGE} from './sample-data.mjs';

const WIDTH = 1200;
const HEIGHT = 1600;

const escape = (text) => text.replace(/[&<>]/g, (char) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;'})[char]);

// Paper fibres; an SVG filter keeps it self-contained.
const PAPER_NOISE = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">' +
    '<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>' +
    '<feColorMatrix values="0 0 0 0 0.45 0 0 0 0 0.38 0 0 0 0 0.25 0 0 0 0.10 0"/></filter>' +
    '<rect width="400" height="400" filter="url(#n)"/></svg>');

const pageHtml = (text, tableDataUrl) => `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=block">
<style>
  html, body { margin: 0; width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; }
  body { background: url(${tableDataUrl}) center / cover; }
  .scene { position: absolute; inset: 0; perspective: 1900px; perspective-origin: 50% 20%; }
  .page {
    position: absolute; left: 175px; top: 170px; width: 860px; height: 1190px; box-sizing: border-box;
    padding: 78px 84px 70px 100px;
    transform: rotateX(20deg) rotateZ(-3.5deg); transform-origin: 50% 60%;
    background:
      linear-gradient(90deg, rgba(90,60,20,.28), rgba(90,60,20,0) 9%),
      linear-gradient(170deg, rgba(255,255,255,.35), rgba(255,255,255,0) 45%),
      url("${PAPER_NOISE}"),
      #f1e7d0;
    box-shadow: 3px 3px 0 #e6dbc2, 6px 6px 0 #ddd0b4, 9px 9px 0 #d6c8aa, 30px 45px 60px rgba(0,0,0,.55);
    font-family: 'EB Garamond', Georgia, serif; color: #2b2118;
  }
  .corner { position: absolute; width: 0; height: 0; }
  .chapter { font-size: 21px; letter-spacing: 4px; text-transform: uppercase; color: #8a5a2b; text-align: center; }
  h1 { font-size: 58px; font-weight: 600; margin: 14px 0 6px; text-align: center; }
  .subtitle { font-style: italic; font-size: 24px; text-align: center; color: #5b4a3a; }
  .rule { text-align: center; color: #8a5a2b; font-size: 26px; margin: 18px 0 22px; }
  .columns { display: flex; gap: 44px; }
  .ingredients { flex: 0 0 245px; font-size: 23px; line-height: 1.5; }
  .ingredients h2, .steps h2 { font-size: 22px; letter-spacing: 2px; text-transform: uppercase; color: #8a5a2b; margin: 0 0 10px; font-weight: 600; }
  .ingredients ul { list-style: none; padding: 0; margin: 0; }
  .steps { font-size: 23.5px; line-height: 1.5; text-align: justify; hyphens: auto; }
  .steps p { margin: 0 0 12px; }
  .steps b { color: #8a5a2b; }
  .tip { position: absolute; left: 100px; right: 84px; bottom: 110px; padding: 18px 24px; font-size: 22px;
    font-style: italic; line-height: 1.45; border-top: 1px solid #b89a6e; border-bottom: 1px solid #b89a6e; color: #4a3a2c; }
  .folio { position: absolute; bottom: 42px; left: 0; right: 0; text-align: center; font-size: 22px; color: #5b4a3a; }
  .light { position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse at 40% 30%, rgba(255,240,210,.18), rgba(0,0,0,0) 55%, rgba(0,0,0,.45) 100%); }
</style></head>
<body>
  <div class="scene">
    <div class="page">
      <div class="corner" style="left:0;top:0"></div>
      <div class="corner" style="right:0;top:0"></div>
      <div class="corner" style="right:0;bottom:0"></div>
      <div class="corner" style="left:0;bottom:0"></div>
      <div class="chapter">${escape(text.chapter)}</div>
      <h1>${escape(text.title)}</h1>
      <div class="subtitle">${escape(text.subtitle)}</div>
      <div class="rule">❦</div>
      <div class="columns">
        <div class="ingredients">
          <h2>${escape(text.ingredientsHeading)}</h2>
          <ul>${text.ingredients.map((line) => `<li>${escape(line)}</li>`).join('')}</ul>
        </div>
        <div class="steps">
          <h2>${escape(text.stepsHeading)}</h2>
          ${text.steps.map((step, index) => `<p><b>${index + 1}.</b> ${escape(step)}</p>`).join('')}
        </div>
      </div>
      <div class="tip">${escape(text.tip)}</div>
      <div class="folio">${text.page}</div>
    </div>
  </div>
  <div class="light"></div>
</body></html>`;

/**
 * @param {import('playwright').Browser} browser a running browser
 * @param {string} lang which language the printed recipe is in
 * @param {string} photosDir where the table photo is
 * @param {string} outFile where to write the JPEG
 * @return {Promise<{file: string, corners: number[][]}>} the photo, and the page's corners as
 *   [x, y] fractions clockwise from the top left
 */
export const renderScanPhoto = async (browser, lang, photosDir, outFile) => {
  const table = await fs.readFile(path.join(photosDir, 'woodTable.jpg'));
  const page = await browser.newPage({viewport: {width: WIDTH, height: HEIGHT}});
  await page.setContent(pageHtml(SCAN_PAGE[lang], `data:image/jpeg;base64,${table.toString('base64')}`));
  // The font is a nicety; without the network the page falls back to a serif font.
  await page.evaluate(() => Promise.race([document.fonts.ready, new Promise((done) => setTimeout(done, 5000))]));
  const corners = await page.$$eval('.corner', (markers) => markers.map((marker) => {
    const box = marker.getBoundingClientRect();
    return [box.left / window.innerWidth, box.top / window.innerHeight];
  }));
  await fs.mkdir(path.dirname(outFile), {recursive: true});
  await page.screenshot({path: outFile, type: 'jpeg', quality: 88});
  await page.close();
  return {file: outFile, corners};
};
