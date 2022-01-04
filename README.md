## <center>OpenCookbook</center>
<center>Your personal recipe collection, meal planner and cooking guide.</center>

-----
OpenCookbook is an opensource cloud native application to manage your personal recipes and to support you with many features all around cooking.
It also supports importing from various cooking sites on the internet.


## Features
### My Recipes
The base feature. A way to manage your recipes, search for recipes, organize your recipes in various groups.

Every recipe has ingredients and preparation steps. Besides your recipe, they are used to estimate the calories and nutrients of your recipe.

### Recipe Import
Recipes can be imported from
```
chefkoch.de
```
### Weekplan
TODO

### Guided cooking
TODO

## Installation
OpenCookbook is designed to run without extensive preparation and installation. All you need is a docker or kubernetes environment and you are good to go.

### Installation with docker compose

1. Download this git repository
```
git clone https://github.com/steve192/opencookbook
cd opencookbook
```

2. Edit the environment variables in the ```.env``` file to your personal needs\

3. Start docker-compose
```
docker-compose -d up
```
### Installation on kubernetes
TODO
## Motivation
Since i like to cook in my free time and i am a person who likes to get the same taste every time i cook the same meal, i use a variety of recipes with exact instructions and ingredients. i use either family recipes or recipes from the various cooking sites on the internet.

My problem has always been to be able to put them all in one place without having to go to many different sites.


On the other hand, I am a software developer who likes to try new technologies from time to time. This time my goal was to build a scalable cloud native application. This is how opencookbook came into being.


