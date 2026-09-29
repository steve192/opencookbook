/**
 * Downloads the photos listed in photos.json from Wikimedia Commons into assets/photos and
 * writes CREDITS.md next to them. Refuses any file Commons does not list as CC0 or public
 * domain, so nothing that needs attribution or permission ends up in a store listing.
 *
 * Only needed when photos.json changes; the downloaded photos are committed.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'assets', 'photos');
const manifest = JSON.parse(await fs.readFile(path.join(root, 'src', 'photos.json'), 'utf8'));
const FREE_LICENSES = ['CC0', 'Public domain'];
const WIDTH = 1280;
const headers = {'User-Agent': 'cookpal-screenshots/1.0 (store screenshot tooling)'};

// Commons renders thumbnails in the original format, and a PNG photo is many times the size.
const browser = await chromium.launch();
const toJpeg = async (bytes, type) => {
  const page = await browser.newPage();
  const dataUrl = await page.evaluate(async (source) => {
    const image = new Image();
    image.src = source;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    canvas.getContext('2d').drawImage(image, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.85);
  }, `data:${type};base64,${bytes.toString('base64')}`);
  await page.close();
  return Buffer.from(dataUrl.split(',')[1], 'base64');
};

const describe = async (title) => {
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  Object.entries({
    action: 'query', format: 'json', titles: title, prop: 'imageinfo',
    iiprop: 'url|extmetadata', iiurlwidth: String(WIDTH),
    iiextmetadatafilter: 'LicenseShortName|Artist|UsageTerms',
  }).forEach(([key, value]) => url.searchParams.set(key, value));
  let response = await fetch(url, {headers});
  // Commons answers "too many requests" as text, sometimes with a 200.
  for (let attempt = 1; attempt <= 5 && !response.headers.get('content-type')?.includes('json'); attempt++) {
    await new Promise((resolve) => setTimeout(resolve, attempt * 10_000));
    response = await fetch(url, {headers});
  }
  const page = Object.values((await response.json()).query.pages)[0];
  if (!page.imageinfo) {
    throw new Error(`${title} does not exist on Commons`);
  }
  return page.imageinfo[0];
};

const credits = ['# Photo credits', '',
  'Every photo here is CC0 or public domain on Wikimedia Commons, checked by `./run.sh fetch-photos`.',
  'No attribution is required; the sources are listed anyway so the licenses can be looked up again.', '',
  '| File | License | Author | Source |', '|---|---|---|---|'];

for (const [key, title] of Object.entries(manifest)) {
  const info = await describe(title);
  const license = info.extmetadata.LicenseShortName?.value ?? 'unknown';
  if (!FREE_LICENSES.includes(license)) {
    throw new Error(`${title} is licensed "${license}", which is not free of conditions`);
  }
  const file = `${key}.jpg`;
  const response = await fetch(info.thumburl, {headers});
  if (!response.ok) {
    throw new Error(`Downloading ${title} failed with ${response.status}`);
  }
  const type = response.headers.get('content-type');
  const bytes = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(path.join(target, file), type === 'image/jpeg' ? bytes : await toJpeg(bytes, type));
  const author = (info.extmetadata.Artist?.value ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  credits.push(`| ${file} | ${license} | ${author || 'unknown'} | [${title}](${info.descriptionurl}) |`);
  console.log(`${file}: ${license}`);
  // Commons asks bots to go slowly.
  await new Promise((resolve) => setTimeout(resolve, 1500));
}

await browser.close();
await fs.writeFile(path.join(target, 'CREDITS.md'), credits.join('\n') + '\n');
