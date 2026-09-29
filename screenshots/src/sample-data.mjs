/**
 * The demo cookbook, in every language the screenshots are taken in. Written for this purpose,
 * so it is free to use anywhere; the photos are CC0, see assets/photos/CREDITS.md.
 */

export const LANGUAGES = ['en', 'de'];

const UNITS = {
  g: {en: 'g', de: 'g'},
  kg: {en: 'kg', de: 'kg'},
  ml: {en: 'ml', de: 'ml'},
  l: {en: 'l', de: 'Liter'},
  tbsp: {en: 'tbsp', de: 'EL'},
  tsp: {en: 'tsp', de: 'TL'},
  clove: {en: 'cloves', de: 'Zehe/n'},
  can: {en: 'can', de: 'Dose'},
  pinch: {en: 'pinch', de: 'Prise(n)'},
  bunch: {en: 'bunch', de: 'Bund'},
  piece: {en: '', de: ''},
};

// Few on purpose: the list shows a group as one tile, and the photos of loose recipes sell better.
export const GROUPS = {
  quick: {en: 'Quick & easy', de: 'Schnell & einfach'},
  baking: {en: 'Baking & sweets', de: 'Backen & Süßes'},
};

// [amount, unit, english name, german name]
const RECIPES = [
  {
    key: 'bolognese', photo: 'bolognese', servings: 4, preparationTime: 20, totalTime: 70,
    recipeType: 'MEAT', mealTypes: ['LUNCH', 'DINNER'], groups: [],
    title: {en: 'Spaghetti Bolognese', de: 'Spaghetti Bolognese'},
    ingredients: [
      [400, 'g', 'spaghetti', 'Spaghetti'],
      [500, 'g', 'ground beef', 'Rinderhackfleisch'],
      [1, 'piece', 'onion', 'Zwiebel'],
      [1, 'piece', 'carrot', 'Karotte'],
      [2, 'clove', 'garlic', 'Knoblauch'],
      [1, 'can', 'chopped tomatoes', 'gehackte Tomaten'],
      [2, 'tbsp', 'tomato paste', 'Tomatenmark'],
      [150, 'ml', 'red wine', 'Rotwein'],
      [2, 'tbsp', 'olive oil', 'Olivenöl'],
      [1, 'tsp', 'oregano', 'Oregano'],
      [1, 'bunch', 'basil', 'Basilikum'],
      [50, 'g', 'parmesan', 'Parmesan'],
    ],
    steps: {
      en: [
        'Finely dice the onion and the carrot and chop the garlic.',
        'Heat the olive oil in a large pot and brown the ground beef for 8 minutes until crumbly.',
        'Add the onion, carrot and garlic and sweat them for 5 minutes. Stir in the tomato paste.',
        'Deglaze with the red wine, then add the chopped tomatoes and oregano. Simmer gently for 45 minutes and add the basil for the last 5 minutes.',
        'Cook the spaghetti in plenty of salted water for 9 minutes until al dente.',
        'Toss the spaghetti with the sauce and serve with freshly grated parmesan.',
      ],
      de: [
        'Die Zwiebel und die Karotte fein würfeln, den Knoblauch hacken.',
        'Das Olivenöl in einem großen Topf erhitzen und das Rinderhackfleisch 8 Minuten krümelig anbraten.',
        'Zwiebel, Karotte und Knoblauch dazugeben und 5 Minuten andünsten. Das Tomatenmark einrühren.',
        'Mit dem Rotwein ablöschen, dann die gehackten Tomaten und den Oregano dazugeben. 45 Minuten sanft köcheln lassen und das Basilikum in den letzten 5 Minuten hinzufügen.',
        'Die Spaghetti in reichlich Salzwasser 9 Minuten al dente kochen.',
        'Die Spaghetti mit der Soße vermengen und mit frisch geriebenem Parmesan servieren.',
      ],
    },
  },
  {
    key: 'shakshuka', photo: 'shakshuka', servings: 2, preparationTime: 10, totalTime: 30,
    recipeType: 'VEGETARIAN', mealTypes: ['BREAKFAST', 'LUNCH'], groups: ['quick'],
    title: {en: 'Shakshuka with feta', de: 'Shakshuka mit Feta'},
    ingredients: [
      [4, 'piece', 'eggs', 'Eier'],
      [1, 'can', 'chopped tomatoes', 'gehackte Tomaten'],
      [1, 'piece', 'red bell pepper', 'rote Paprika'],
      [1, 'piece', 'onion', 'Zwiebel'],
      [2, 'clove', 'garlic', 'Knoblauch'],
      [1, 'tsp', 'cumin', 'Kreuzkümmel'],
      [1, 'tsp', 'paprika powder', 'Paprikapulver'],
      [80, 'g', 'feta', 'Feta'],
      [2, 'tbsp', 'olive oil', 'Olivenöl'],
      [1, 'bunch', 'parsley', 'Petersilie'],
    ],
    steps: {
      en: [
        'Dice the onion and the red bell pepper and slice the garlic.',
        'Fry them in the olive oil for 6 minutes, then stir in the cumin and paprika powder.',
        'Add the chopped tomatoes and simmer for 10 minutes until thick.',
        'Make four hollows, crack in the eggs and cover. Cook for 6 minutes until the whites have set.',
        'Crumble the feta over it, sprinkle with parsley and serve straight from the pan.',
      ],
      de: [
        'Die Zwiebel und die rote Paprika würfeln, den Knoblauch in Scheiben schneiden.',
        'Alles im Olivenöl 6 Minuten anbraten, dann Kreuzkümmel und Paprikapulver einrühren.',
        'Die gehackten Tomaten dazugeben und 10 Minuten einkochen lassen.',
        'Vier Mulden formen, die Eier hineinschlagen und abdecken. 6 Minuten garen, bis das Eiweiß gestockt ist.',
        'Den Feta darüberbröseln, mit Petersilie bestreuen und direkt in der Pfanne servieren.',
      ],
    },
  },
  {
    key: 'pancakes', photo: 'pancakes', servings: 4, preparationTime: 10, totalTime: 25,
    recipeType: 'VEGETARIAN', mealTypes: ['BREAKFAST'], groups: ['quick', 'baking'],
    title: {en: 'Fluffy pancakes with berries', de: 'Fluffige Pancakes mit Beeren'},
    ingredients: [
      [250, 'g', 'flour', 'Mehl'],
      [300, 'ml', 'milk', 'Milch'],
      [2, 'piece', 'eggs', 'Eier'],
      [2, 'tbsp', 'sugar', 'Zucker'],
      [2, 'tsp', 'baking powder', 'Backpulver'],
      [30, 'g', 'butter', 'Butter'],
      [200, 'g', 'mixed berries', 'gemischte Beeren'],
      [3, 'tbsp', 'maple syrup', 'Ahornsirup'],
    ],
    steps: {
      en: [
        'Whisk the flour, sugar and baking powder. Add the milk, eggs and melted butter and stir until smooth.',
        'Let the batter rest for 10 minutes.',
        'Fry small pancakes in a hot pan for 2 minutes per side until golden.',
        'Stack them up and top with the berries and maple syrup.',
      ],
      de: [
        'Mehl, Zucker und Backpulver verrühren. Milch, Eier und die geschmolzene Butter dazugeben und glatt rühren.',
        'Den Teig 10 Minuten ruhen lassen.',
        'Kleine Pancakes in einer heißen Pfanne je Seite 2 Minuten goldbraun backen.',
        'Stapeln und mit den Beeren und Ahornsirup servieren.',
      ],
    },
  },
  {
    key: 'pumpkinSoup', photo: 'pumpkinSoup', servings: 4, preparationTime: 15, totalTime: 40,
    recipeType: 'VEGAN', mealTypes: ['LUNCH', 'DINNER'], groups: [],
    title: {en: 'Creamy pumpkin soup', de: 'Cremige Kürbissuppe'},
    ingredients: [
      [1, 'kg', 'hokkaido pumpkin', 'Hokkaido-Kürbis'],
      [1, 'piece', 'onion', 'Zwiebel'],
      [20, 'g', 'ginger', 'Ingwer'],
      [800, 'ml', 'vegetable stock', 'Gemüsebrühe'],
      [200, 'ml', 'coconut milk', 'Kokosmilch'],
      [2, 'tbsp', 'pumpkin seeds', 'Kürbiskerne'],
      [1, 'tbsp', 'olive oil', 'Olivenöl'],
    ],
    steps: {
      en: [
        'Dice the pumpkin with its skin, chop the onion and grate the ginger.',
        'Sweat everything in the olive oil for 5 minutes, then pour in the vegetable stock.',
        'Simmer for 20 minutes until the pumpkin is soft.',
        'Add the coconut milk, blend until smooth and season. Serve with toasted pumpkin seeds.',
      ],
      de: [
        'Den Kürbis mit Schale würfeln, die Zwiebel hacken und den Ingwer reiben.',
        'Alles im Olivenöl 5 Minuten andünsten und mit der Gemüsebrühe aufgießen.',
        '20 Minuten köcheln lassen, bis der Kürbis weich ist.',
        'Die Kokosmilch dazugeben, fein pürieren und abschmecken. Mit gerösteten Kürbiskernen servieren.',
      ],
    },
  },
  {
    key: 'chickenCurry', photo: 'chickenCurry', servings: 4, preparationTime: 20, totalTime: 45,
    recipeType: 'MEAT', mealTypes: ['DINNER'], groups: [],
    title: {en: 'Chicken curry', de: 'Hähnchen-Curry'},
    ingredients: [
      [600, 'g', 'chicken breast', 'Hähnchenbrust'],
      [400, 'ml', 'coconut milk', 'Kokosmilch'],
      [1, 'can', 'chopped tomatoes', 'gehackte Tomaten'],
      [2, 'piece', 'onions', 'Zwiebeln'],
      [3, 'clove', 'garlic', 'Knoblauch'],
      [20, 'g', 'ginger', 'Ingwer'],
      [2, 'tbsp', 'curry powder', 'Currypulver'],
      [250, 'g', 'basmati rice', 'Basmatireis'],
      [1, 'bunch', 'coriander', 'Koriander'],
    ],
    steps: {
      en: [
        'Cut the chicken breast into bite-sized pieces. Chop the onions, garlic and ginger.',
        'Fry the onions for 5 minutes, add garlic, ginger and curry powder and toast briefly.',
        'Add the chicken breast and sear it all over.',
        'Pour in the coconut milk and chopped tomatoes and simmer for 20 minutes.',
        'Meanwhile cook the basmati rice. Serve the curry with rice and fresh coriander.',
      ],
      de: [
        'Die Hähnchenbrust in mundgerechte Stücke schneiden. Zwiebeln, Knoblauch und Ingwer hacken.',
        'Die Zwiebeln 5 Minuten anbraten, Knoblauch, Ingwer und Currypulver dazugeben und kurz rösten.',
        'Die Hähnchenbrust dazugeben und rundherum anbraten.',
        'Kokosmilch und gehackte Tomaten dazugießen und 20 Minuten köcheln lassen.',
        'Inzwischen den Basmatireis kochen. Das Curry mit Reis und frischem Koriander servieren.',
      ],
    },
  },
  {
    key: 'greekSalad', photo: 'greekSalad', servings: 2, preparationTime: 15, totalTime: 15,
    recipeType: 'VEGETARIAN', mealTypes: ['LUNCH'], groups: ['quick'],
    title: {en: 'Greek salad', de: 'Griechischer Salat'},
    ingredients: [
      [4, 'piece', 'tomatoes', 'Tomaten'],
      [1, 'piece', 'cucumber', 'Gurke'],
      [1, 'piece', 'red onion', 'rote Zwiebel'],
      [100, 'g', 'kalamata olives', 'Kalamata-Oliven'],
      [200, 'g', 'feta', 'Feta'],
      [3, 'tbsp', 'olive oil', 'Olivenöl'],
      [1, 'tsp', 'dried oregano', 'getrockneter Oregano'],
    ],
    steps: {
      en: [
        'Cut the tomatoes and cucumber into chunks and slice the red onion into rings.',
        'Arrange with the olives and place the feta on top as a whole slab.',
        'Drizzle with olive oil and sprinkle with oregano.',
      ],
      de: [
        'Tomaten und Gurke in grobe Stücke schneiden, die rote Zwiebel in Ringe.',
        'Mit den Oliven anrichten und den Feta im Ganzen daraufsetzen.',
        'Mit Olivenöl beträufeln und mit Oregano bestreuen.',
      ],
    },
  },
  {
    key: 'pizza', photo: 'pizza', servings: 2, preparationTime: 30, totalTime: 120,
    recipeType: 'VEGETARIAN', mealTypes: ['DINNER'], groups: [],
    title: {en: 'Pizza Margherita', de: 'Pizza Margherita'},
    ingredients: [
      [500, 'g', 'flour', 'Mehl'],
      [7, 'g', 'dry yeast', 'Trockenhefe'],
      [300, 'ml', 'water', 'Wasser'],
      [1, 'can', 'peeled tomatoes', 'geschälte Tomaten'],
      [250, 'g', 'mozzarella', 'Mozzarella'],
      [1, 'bunch', 'basil', 'Basilikum'],
      [2, 'tbsp', 'olive oil', 'Olivenöl'],
    ],
    steps: {
      en: [
        'Knead the flour, yeast, water and a pinch of salt into a smooth dough and let it rise for 60 minutes.',
        'Crush the peeled tomatoes and season them with salt and olive oil.',
        'Stretch the dough thinly, spread the tomatoes and top with torn mozzarella.',
        'Bake at the highest setting for 10 minutes and finish with fresh basil.',
      ],
      de: [
        'Mehl, Hefe, Wasser und eine Prise Salz zu einem glatten Teig kneten und 60 Minuten gehen lassen.',
        'Die geschälten Tomaten zerdrücken und mit Salz und Olivenöl würzen.',
        'Den Teig dünn ausziehen, die Tomaten verteilen und mit zerzupftem Mozzarella belegen.',
        'Bei höchster Stufe 10 Minuten backen und mit frischem Basilikum servieren.',
      ],
    },
  },
  {
    key: 'risotto', photo: 'risotto', servings: 4, preparationTime: 15, totalTime: 40,
    recipeType: 'MEAT', mealTypes: ['DINNER'], groups: [],
    title: {en: 'Chicken & mushroom risotto', de: 'Risotto mit Hähnchen und Pilzen'},
    ingredients: [
      [300, 'g', 'risotto rice', 'Risottoreis'],
      [300, 'g', 'mushrooms', 'Champignons'],
      [300, 'g', 'chicken breast', 'Hähnchenbrust'],
      [1, 'l', 'chicken stock', 'Hühnerbrühe'],
      [100, 'ml', 'white wine', 'Weißwein'],
      [1, 'piece', 'shallot', 'Schalotte'],
      [60, 'g', 'parmesan', 'Parmesan'],
      [30, 'g', 'butter', 'Butter'],
    ],
    steps: {
      en: [
        'Slice the mushrooms, dice the chicken breast and the shallot.',
        'Brown the chicken breast and mushrooms in half the butter and set aside.',
        'Sweat the shallot, add the risotto rice and deglaze with the white wine.',
        'Add the hot chicken stock ladle by ladle, stirring for about 18 minutes.',
        'Fold in the chicken, mushrooms, parmesan and the rest of the butter.',
      ],
      de: [
        'Die Champignons in Scheiben schneiden, Hähnchenbrust und Schalotte würfeln.',
        'Hähnchenbrust und Champignons in der Hälfte der Butter anbraten und beiseitestellen.',
        'Die Schalotte andünsten, den Risottoreis dazugeben und mit dem Weißwein ablöschen.',
        'Die heiße Hühnerbrühe nach und nach unter Rühren zugeben, etwa 18 Minuten.',
        'Hähnchen, Champignons, Parmesan und die restliche Butter unterheben.',
      ],
    },
  },
  {
    key: 'bananaBread', photo: 'bananaBread', servings: 12, preparationTime: 15, totalTime: 75,
    recipeType: 'VEGETARIAN', mealTypes: ['BREAKFAST', 'SNACK'], groups: ['baking'],
    title: {en: 'Banana bread with walnuts', de: 'Bananenbrot mit Walnüssen'},
    ingredients: [
      [3, 'piece', 'ripe bananas', 'reife Bananen'],
      [250, 'g', 'flour', 'Mehl'],
      [100, 'g', 'brown sugar', 'brauner Zucker'],
      [80, 'g', 'butter', 'Butter'],
      [2, 'piece', 'eggs', 'Eier'],
      [2, 'tsp', 'baking powder', 'Backpulver'],
      [80, 'g', 'walnuts', 'Walnüsse'],
    ],
    steps: {
      en: [
        'Mash the ripe bananas and mix them with the melted butter, brown sugar and eggs.',
        'Fold in the flour, baking powder and chopped walnuts.',
        'Bake in a loaf tin at 180 °C for 55 minutes.',
      ],
      de: [
        'Die reifen Bananen zerdrücken und mit der geschmolzenen Butter, dem braunen Zucker und den Eiern verrühren.',
        'Mehl, Backpulver und die gehackten Walnüsse unterheben.',
        'In einer Kastenform bei 180 °C 55 Minuten backen.',
      ],
    },
  },
  {
    key: 'chili', photo: 'chili', servings: 6, preparationTime: 20, totalTime: 60,
    recipeType: 'MEAT', mealTypes: ['DINNER'], groups: [],
    title: {en: 'Chili con carne', de: 'Chili con Carne'},
    ingredients: [
      [500, 'g', 'ground beef', 'Rinderhackfleisch'],
      [2, 'can', 'kidney beans', 'Kidneybohnen'],
      [1, 'can', 'sweetcorn', 'Mais'],
      [2, 'can', 'chopped tomatoes', 'gehackte Tomaten'],
      [2, 'piece', 'onions', 'Zwiebeln'],
      [1, 'piece', 'red bell pepper', 'rote Paprika'],
      [2, 'tsp', 'chili powder', 'Chilipulver'],
      [1, 'tsp', 'cumin', 'Kreuzkümmel'],
    ],
    steps: {
      en: [
        'Brown the ground beef with the diced onions and red bell pepper.',
        'Add the chili powder and cumin, then the chopped tomatoes.',
        'Stir in the kidney beans and sweetcorn and simmer for 30 minutes.',
      ],
      de: [
        'Das Rinderhackfleisch mit den gewürfelten Zwiebeln und der roten Paprika anbraten.',
        'Chilipulver und Kreuzkümmel dazugeben, dann die gehackten Tomaten.',
        'Kidneybohnen und Mais unterrühren und 30 Minuten köcheln lassen.',
      ],
    },
  },
  {
    key: 'applePie', photo: 'applePie', servings: 8, preparationTime: 30, totalTime: 90,
    recipeType: 'VEGETARIAN', mealTypes: ['DESSERT'], groups: ['baking'],
    title: {en: 'Apple cake with vanilla ice cream', de: 'Apfelkuchen mit Vanilleeis'},
    ingredients: [
      [4, 'piece', 'apples', 'Äpfel'],
      [200, 'g', 'flour', 'Mehl'],
      [125, 'g', 'butter', 'Butter'],
      [100, 'g', 'sugar', 'Zucker'],
      [2, 'piece', 'eggs', 'Eier'],
      [1, 'tsp', 'cinnamon', 'Zimt'],
      [500, 'ml', 'vanilla ice cream', 'Vanilleeis'],
    ],
    steps: {
      en: [
        'Beat the butter, sugar and eggs until creamy and fold in the flour.',
        'Peel and slice the apples and toss them with the cinnamon.',
        'Spread the batter in a tin, top with the apples and bake at 175 °C for 45 minutes.',
        'Serve warm with a scoop of vanilla ice cream.',
      ],
      de: [
        'Butter, Zucker und Eier cremig schlagen und das Mehl unterheben.',
        'Die Äpfel schälen, in Spalten schneiden und mit dem Zimt mischen.',
        'Den Teig in eine Form streichen, mit den Äpfeln belegen und bei 175 °C 45 Minuten backen.',
        'Warm mit einer Kugel Vanilleeis servieren.',
      ],
    },
  },
  {
    key: 'salmon', photo: 'salmon', servings: 2, preparationTime: 15, totalTime: 35,
    recipeType: 'MEAT', mealTypes: ['DINNER'], groups: ['quick'],
    title: {en: 'Glazed salmon with roast vegetables', de: 'Glasierter Lachs mit Ofengemüse'},
    ingredients: [
      [2, 'piece', 'salmon fillets', 'Lachsfilets'],
      [250, 'g', 'brussels sprouts', 'Rosenkohl'],
      [2, 'piece', 'carrots', 'Karotten'],
      [300, 'g', 'potatoes', 'Kartoffeln'],
      [2, 'tbsp', 'honey', 'Honig'],
      [2, 'tbsp', 'soy sauce', 'Sojasoße'],
      [2, 'tbsp', 'olive oil', 'Olivenöl'],
    ],
    steps: {
      en: [
        'Halve the brussels sprouts, cut the carrots and potatoes into pieces and toss with olive oil.',
        'Roast the vegetables at 200 °C for 25 minutes.',
        'Stir the honey and soy sauce together and brush the salmon fillets with it.',
        'Sear the salmon fillets for 3 minutes per side and serve on the vegetables.',
      ],
      de: [
        'Den Rosenkohl halbieren, Karotten und Kartoffeln in Stücke schneiden und mit Olivenöl mischen.',
        'Das Gemüse bei 200 °C 25 Minuten im Ofen rösten.',
        'Honig und Sojasoße verrühren und die Lachsfilets damit bestreichen.',
        'Die Lachsfilets je Seite 3 Minuten braten und auf dem Gemüse servieren.',
      ],
    },
  },
];

/**
 * The week around today, by weekday (0 is Monday). A string is a meal without a recipe.
 * `leftoverOf` names the weekday whose cooking is eaten again.
 */
const WEEK = [
  [{recipe: 'chickenCurry', servings: 4}],
  [{recipe: 'pancakes', servings: 2}, {recipe: 'chickenCurry', leftoverOf: 0}],
  [{recipe: 'pumpkinSoup', servings: 4}],
  [{recipe: 'bolognese', servings: 4}],
  [{recipe: 'pizza', servings: 2}],
  [{recipe: 'shakshuka', servings: 2}, {text: {en: 'Dinner at Sam\'s', de: 'Abendessen bei Sam'}}],
  [{recipe: 'salmon', servings: 2}, {recipe: 'applePie', servings: 8}],
];

// [english, german, spec, recipe it is for (or none), bought already]
const SHOPPING = [
  ['Chicken breast', 'Hähnchenbrust', '600 g', 'chickenCurry'],
  ['Coconut milk', 'Kokosmilch', '600 ml', 'chickenCurry'],
  ['Basmati rice', 'Basmatireis', '250 g', 'chickenCurry'],
  ['Hokkaido pumpkin', 'Hokkaido-Kürbis', '1 kg', 'pumpkinSoup'],
  ['Ginger', 'Ingwer', '40 g', 'pumpkinSoup'],
  ['Ground beef', 'Hackfleisch', '500 g', 'bolognese'],
  ['Spaghetti', 'Spaghetti', '400 g', 'bolognese'],
  ['Chopped tomatoes', 'Gehackte Tomaten', '3 cans', 'bolognese'],
  ['Carrots', 'Karotten', '3', 'salmon'],
  ['Mozzarella', 'Mozzarella', '250 g', 'pizza'],
  ['Basil', 'Basilikum', '2 bunches', 'pizza'],
  ['Salmon fillets', 'Lachsfilets', '2', 'salmon'],
  ['Apples', 'Äpfel', '4', 'applePie'],
  ['Vanilla ice cream', 'Vanilleeis', '500 ml', 'applePie'],
  ['Coffee', 'Kaffee', null, null],
  ['Bananas', 'Bananen', null, null],
  ['Eggs', 'Eier', '10', 'shakshuka', true],
  ['Milk', 'Milch', '1 l', null, true],
  ['Feta', 'Feta', '80 g', 'shakshuka', true],
];

const GERMAN_SPECS = {'3 cans': '3 Dosen', '2 bunches': '2 Bund'};

/** A recipe that is not in the cookbook yet: it is on the page being scanned. */
export const SCAN_PAGE = {
  en: {
    chapter: 'Cakes & Bakes',
    title: 'Grandma\'s Plum Cake',
    subtitle: 'Serves 12 · Baking time 40 minutes',
    ingredients: ['500 g flour', '1 sachet dry yeast', '250 ml lukewarm milk', '75 g sugar', '75 g soft butter',
      '1 egg', '1 pinch of salt', '1.5 kg plums', '2 tbsp cinnamon sugar'],
    steps: [
      'Mix the flour with the yeast. Add the milk, sugar, butter, egg and salt and knead into a smooth dough. Leave to rise in a warm place for one hour.',
      'Meanwhile wash, halve and stone the plums.',
      'Roll out the dough on a greased baking tray and cover it tightly with the plums, cut side up, like roof tiles.',
      'Leave to rise for another 15 minutes, then bake at 200 °C for about 40 minutes.',
      'Sprinkle with cinnamon sugar while still warm. Best served with whipped cream.',
    ],
    ingredientsHeading: 'Ingredients',
    stepsHeading: 'Method',
    tip: 'Tip: In late summer, when plums are at their best, bake a second tray straight away. The cake freezes very well and thaws in an hour.',
    page: 87,
  },
  de: {
    chapter: 'Kuchen & Gebäck',
    title: 'Omas Zwetschgenkuchen',
    subtitle: 'Für 12 Stücke · Backzeit 40 Minuten',
    ingredients: ['500 g Mehl', '1 Päckchen Trockenhefe', '250 ml lauwarme Milch', '75 g Zucker',
      '75 g weiche Butter', '1 Ei', '1 Prise Salz', '1,5 kg Zwetschgen', '2 EL Zimtzucker'],
    steps: [
      'Das Mehl mit der Hefe mischen. Milch, Zucker, Butter, Ei und Salz dazugeben und zu einem glatten Teig kneten. An einem warmen Ort eine Stunde gehen lassen.',
      'Inzwischen die Zwetschgen waschen, halbieren und entsteinen.',
      'Den Teig auf einem gefetteten Backblech ausrollen und dicht wie Dachziegel mit den Zwetschgen belegen, die Schnittfläche nach oben.',
      'Nochmals 15 Minuten gehen lassen, dann bei 200 °C etwa 40 Minuten backen.',
      'Noch warm mit Zimtzucker bestreuen. Am besten mit Schlagsahne servieren.',
    ],
    ingredientsHeading: 'Zutaten',
    stepsHeading: 'Zubereitung',
    tip: 'Tipp: Im Spätsommer, wenn die Zwetschgen am besten sind, gleich ein zweites Blech backen. Der Kuchen lässt sich sehr gut einfrieren und ist in einer Stunde aufgetaut.',
    page: 87,
  },
};

export const DISPLAY_NAME = 'Alex';

export const recipesIn = (lang) => RECIPES.map((recipe) => ({
  key: recipe.key,
  photo: recipe.photo,
  groups: recipe.groups,
  body: {
    title: recipe.title[lang],
    servings: recipe.servings,
    preparationTime: recipe.preparationTime,
    totalTime: recipe.totalTime,
    recipeType: recipe.recipeType,
    mealTypes: recipe.mealTypes,
    preparationSteps: recipe.steps[lang],
    neededIngredients: recipe.ingredients.map(([amount, unit, en, de]) => ({
      amount, unit: UNITS[unit][lang], ingredient: {name: lang === 'de' ? de : en},
    })),
  },
}));

export const recipeTitle = (key, lang) => RECIPES.find((recipe) => recipe.key === key).title[lang];

export const weekIn = (lang) => WEEK.map((meals) => meals.map((meal) => meal.text ?
  {text: meal.text[lang]} :
  {...meal, title: recipeTitle(meal.recipe, lang)}));

export const shoppingIn = (lang) => SHOPPING.map(([en, de, spec, recipe, bought]) => ({
  name: lang === 'de' ? de : en,
  spec: lang === 'de' && spec ? GERMAN_SPECS[spec] ?? spec.replace('.', ',') : spec,
  recipe,
  bought: bought === true,
}));
