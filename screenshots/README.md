# Store screenshots

Takes the Google Play screenshots of CookPal automatically, in English and German. It starts the
published app images with an empty database, fills a demo account with sample recipes, a week plan
and a shopping list, and photographs the web app in a phone-sized browser.

The only requirement is Docker (with Compose). Nothing else has to be installed or checked out.

```sh
./run.sh
```

Screenshots are written to `out/<language>/phone/`, 1080 x 2160, in dark mode:

| # | Screen | What is shown |
|---|---|---|
| 01 | Recipe list | Two recipe groups and the loose recipes |
| 02 | Recipe detail | Shakshuka with times, diet and ingredients |
| 03 | Week plan | The current week, including leftovers and a meal without a recipe |
| 04 | Shopping list | Items sorted into aisles, with icons |
| 05 | Guided cooking | A step with highlighted ingredients, one ticked, a running timer and one ready to start |
| 06 | Recipe scanning | A cookbook page with one corner being dragged into place, magnifier showing |
| 07 | Recipe import | The import screen with a recipe link typed in, not yet imported |
| 08 | Nutrition | Shakshuka with its nutrition sheet open |
| 09 | Week suggestion | The week the planner proposes for next week, before it is accepted |
| 10 | Household | A household of two: the demo user and a second member |

The store listing uses the first six. The last four are for the landing page.

## Options

```sh
./run.sh --tag v1.21.1                    # both images at this tag (default: latest)
./run.sh --apiserver-tag main --frontend-tag v1.18.3
./run.sh --lang de --only weekplan,shopping-list
./run.sh --tag local --no-pull            # images built locally: nothing is pulled
./run.sh --landing-out ../../opencookbook-frontend/landing   # see "Screenshots for the landing page"
./run.sh --keep                           # leave the apps running for the next run; stop with ./run.sh down
```

The images are `ghcr.io/steve192/opencookbook-apiserver` and `ghcr.io/steve192/opencookbook-frontend`,
pulled on every run so that `latest` is always the newest release; `--no-pull` skips that, for images
that only exist locally. Everything runs in the Compose
project `cookpal-screenshots`. Its database lives in memory, and no port is opened on the host. When
the run ends, it is removed again unless `--keep` is given.

If a shot fails, the screen at that moment is saved as `*.failed.png` next to where the shot would have gone.

## Screenshots for the landing page

Besides the store screenshots, every shot is written as a 720 px wide WebP (quality 90) to
`out/landing/src/assets/screenshots/<language>/<name>.webp`, and a 1200 x 630 social preview banner (the app
icon, the name, a tagline and three screenshots) to `out/landing/public/og-<language>.png`. `out/landing` is
cleared at the start of every run. The banner needs the `recipe-list`, `recipe-detail` and `weekplan` shots, so
a run that leaves them out with `--only` does not render it.

`out/landing` is laid out like the landing project. `--landing-out` copies it over the landing project as it is:

```sh
./run.sh --tag local --no-pull --landing-out ../../opencookbook-frontend/landing
```

The directory must be the landing project (it has an `astro.config.mjs`); anything else is refused
before the run starts.

## Changing things

- Screens and how they are set up: `src/shots.mjs`. The few button texts a shot clicks are in
  `LABELS` there and have to follow the app's `en.json` and `de.json`.
- Recipes, groups, week plan, shopping list and the scanned page: `src/sample-data.mjs`.
- Screen size, more devices (such as tablets), and light or dark mode: `DEVICES` and `COLOR_SCHEME` in
  `src/take-screenshots.mjs`.

The web app is served below `/app`, so every page the shots open is `http://web/app/...`. The household
is only created when the household shot runs, because with one the week plan, the shopping list and the
recipe list grow switchers that the other shots should not show. That is why it is the last shot.

Changes are picked up on the next `./run.sh`, which rebuilds the runner image from this folder.

A feature that only some versions have is simply missing from the screenshots of the others, as
leftovers in the week plan are until they are released.

Recipe scanning needs the ML subsystem, which is left out. The shot answers the page edge
detection itself, inside the browser.

## Licensing

Everything in the screenshots can be used in store listings without asking anybody:

- The food photos and the wooden table are CC0 on Wikimedia Commons. `assets/photos/CREDITS.md`
  lists each source. To change them, edit `src/photos.json` and run `./run.sh fetch-photos`. The
  script refuses anything Commons does not list as CC0 or public domain.
- The recipe texts, the week plan and the shopping list were written for this tool.
- The scanned cookbook page is rendered by the browser from the text in `src/sample-data.mjs`
  (`src/scan-photo.mjs`). It is set in EB Garamond from Google Fonts (SIL Open Font License, which
  allows text set in it to be used in images). Without network access it falls back to a serif font.
