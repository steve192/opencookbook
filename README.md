## <center>OpenCookbook</center>
<center>Your personal recipe collection, meal planner and cooking guide.</center>

-----
OpenCookbook is an opensource cloud native application to manage your personal recipes and to support you with many features all around cooking.
It also supports importing from various cooking sites on the internet.

[<img alt='Get it on Google Play' width=323 height=125 src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'/>](https://play.google.com/store/apps/details?id=com.sterul.opencookbook&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1)


## Features
![dsd](assets/cookpal-video4.gif )
### My Recipes
The base feature. A way to manage your recipes, search for recipes, organize your recipes in various groups.

Every recipe has ingredients and preparation steps. Besides your recipe, they are used to estimate the calories and nutrients of your recipe.

### Recipe Import
Recipes can be imported from various recipe websites to have all your favorite recipes in one place
### Weekplan
No more indecision about what to cook today. Plan your meals in advance and let cookpal support your selections.

### Guided cooking
What ingredients need to go in next? Cookpal will tell you.

## Installation
OpenCookbook is designed to run without extensive preparation and installation. All you need is a docker or kubernetes environment and you are good to go.

### Installation with docker compose

1. Download this git repository
```
git clone https://github.com/steve192/opencookbook
cd opencookbook/compose
```

2. Edit the environment variables in the ```.env``` file to your personal needs.

❗ IMPORTANT ❗ at least change `DB_PASSWORD` or your installation will be vulnerable, and set `INSTANCE_URL` to the public address of your installation without `/app` (e.g. `https://cookbook.example.com` or `http://<server>:3009`). Invitation and password reset links and all mails are built from it.

3. Start docker-compose
```
docker compose up -d
```

The app is served at `/app`. `/` opens the app as well, unless `LANDING_ENABLED` shows the Cookpal project page there. The legal texts the app shows (`terms.html`, `privacy.html`, `imprint.html`) go into `compose/legal`, see the README there.

### Behind your own reverse proxy

Cookpal counts sign-in attempts per visitor, so a reverse proxy in front (for HTTPS) has to set `X-Forwarded-For`. Traefik, Caddy and Nginx Proxy Manager do that by default; with a hand-written nginx config add `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`.

### First start

Right after the first start, open `https://<your domain>/admin`, or `http://<server>:3009/admin` while you have no domain yet. Until the setup is done, whoever gets there first becomes the administrator, so do this immediately.

1. Create the admin account.
2. Check the instance overview. It shows how your installation is configured and whether the mail server, the recipe import and the recipe scan work.
3. Choose the registration mode: *Open* lets anyone create an account, *Invitation only* admits only people with an invitation link.
4. Invite people under Invitations: create a link and send it to them. A link works once and expires after 1, 7 or 30 days. The person opening it picks an email address and a password.

The app stays closed until the setup is done.

Mail is optional and needs `SMTP_*` in the `.env` besides `INSTANCE_URL`. Without it, open signups stay locked until an admin activates them in the admin panel, and invitation and password reset links are not mailed but handed over from the admin panel. With it, accounts confirm themselves by mail, and links can be mailed as well.

### Updating

```
docker compose pull && docker compose up -d
```

### Installation on kubernetes
TODO

## Roadmap
- Complete management of recipes (create, search, manage)🚧
- Mealplanning in advance (manual)✔️
- Mealplanning in advance (automatic suggestions)🚧
- Automatic calculation of calories🚧
- Advanced guided cooking (hands-free etc.)🚧
- And of course all your suggestions :)

## Structure
This project is structured into different modules
### opencookbook (this repo)
A repository containing an overview on the whole project. It contains general documentation, installation instructions and deployment configs such as docker-compose and kubernetes deployments
### [opencookbook-frontend](https://github.com/steve192/opencookbook-frontend)
<img src="https://shields.io/github/v/release/steve192/opencookbook-frontend?display_name=tag&sort=semver&label=frontend&logo=github"/>\
The frontend for opencookbook.
### [opencookbook-apiserver](https://github.com/steve192/opencookbook-apiserver)
<img src="https://shields.io/github/v/release/steve192/opencookbook-apiserver?display_name=tag&sort=semver&label=apiserver&logo=github"/>\
The the backend/apiserver for opencookbook.
API documentation is available here: https://cookpal.io/api-docs
### [opencookbook-proxy](https://github.com/steve192/opencookbook-proxy)
<img src="https://shields.io/github/v/release/steve192/opencookbook-proxy?display_name=tag&sort=semver&label=proxy&logo=github"/>\
A proxy wiring up the frontend and apiserver. Basically nginx with routes configured (route /api to apiserver and the rest to frontend)
## Motivation
Since i like to cook in my free time and i am a person who likes to get the same taste every time i cook the same meal, i use a variety of recipes with exact instructions and ingredients. i use either family recipes or recipes from the various cooking sites on the internet.

My problem has always been to be able to put them all in one place without having to go to many different sites.


On the other hand, I am a software developer who likes to try new technologies from time to time. This time my goal was to build a scalable cloud native application. This is how opencookbook came into being.


