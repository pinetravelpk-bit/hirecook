import raw from './keywords.json';
import { findArea, detectCity, areasOf, type Area } from './areas';
import { cities, outsideCities, cityAreas, cityBy, isFullService, cityKeywordPrefixes, areaKeywordPrefixes } from './cities';
import type { PhotoKey } from './images';
import { site } from './site';

export type Entry = { id: number; keyword: string; group: string; slug: string };
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Male-cook pages for cities outside Islamabad / Rawalpindi, generated from lib/cities.ts.
const cityEntries: Entry[] = [];
let nextId = (raw as Entry[]).length + 1;
for (const c of outsideCities) {
  const group = `Male cooks in ${c.name}`;
  for (const p of cityKeywordPrefixes) {
    const keyword = `${p} ${c.name}`;
    cityEntries.push({ id: nextId++, keyword, group, slug: slugify(keyword) });
  }
  cityAreas[c.name].forEach(([area], i) => {
    const keyword = `${areaKeywordPrefixes[i % areaKeywordPrefixes.length]} ${area} ${c.name}`;
    cityEntries.push({ id: nextId++, keyword, group, slug: slugify(keyword) });
  });
}

export const entries: Entry[] = [...(raw as Entry[]), ...cityEntries];

export const groups: { name: string; slug: string; title: string; intro: string }[] = [
  { name: 'Cook hiring', slug: 'cook-hiring', title: 'Cook Hiring Services in Islamabad', intro: 'Every way to hire a cook in Islamabad — home cooks, male cooks, domestic and family cooks, chefs, agencies and cooks near you.' },
  { name: 'Male cooks', slug: 'male-cooks', title: 'Male Cooks in Islamabad', intro: 'Experienced, trained male cooks for homes and families in Islamabad — full-time, part-time, live-in and live-out.' },
  { name: 'Schedules', slug: 'cook-schedules', title: 'Full-Time, Part-Time & Live-In Cooks', intro: 'Choose the schedule that suits your home: full-time, part-time, live-in, live-out, hourly, morning, evening or weekend cooks.' },
  { name: 'Chefs and cuisines', slug: 'chefs-and-cuisines', title: 'Chefs & Cuisine Specialists in Islamabad', intro: 'Private chefs, desi cooks, BBQ and tandoor specialists, Chinese, continental, bakery, pastry and diet chefs.' },
  { name: 'Islamabad areas', slug: 'islamabad-areas', title: 'Cook Services by Islamabad Sector', intro: 'Hire a cook in your Islamabad sector or society — F, G, E and I sectors, Bahria, DHA, Gulberg, Bani Gala and more.' },
  { name: 'Rawalpindi areas', slug: 'rawalpindi-areas', title: 'Cook Services in Rawalpindi', intro: 'Hire a cook anywhere in Rawalpindi — Saddar, Satellite Town, Chaklala, Bahria Town phases, DHA, Askari and more.' },
  { name: 'Commercial and events', slug: 'commercial-and-events', title: 'Restaurant, Office & Event Cooks', intro: 'Cooks and chefs for restaurants, hotels, offices, canteens, messes, hostels, guest houses, weddings, parties and dawats.' },
  ...outsideCities.map((c) => ({
    name: `Male cooks in ${c.name}`,
    slug: c.slug,
    title: `Male Cooks in ${c.name}`,
    intro: `Hire experienced male cooks across ${c.name}: home, full-time, part-time and live-in, in ${cityAreas[c.name].slice(0, 5).map((a) => a[0]).join(', ')} and more. ${c.blurb}`,
  })),
];
export const coreGroups = groups.slice(0, 7);
export const groupSlug = (g: string) => groups.find((x) => x.name === g)?.slug || 'cook-hiring';

const KEEP = new Set(['BBQ', 'DHA', 'PWD', 'E-7', 'E-11']);
export function titleCase(s: string) {
  const small = new Set(['in', 'for', 'a', 'with', 'of', 'near', 'me', 'and']);
  return s
    .split(/\s+/)
    .map((w, i) => {
      if (KEEP.has(w.toUpperCase())) return w.toUpperCase();
      if (/^[a-z]-\d+$/i.test(w)) return w.toUpperCase();
      if (i > 0 && small.has(w.toLowerCase()) && w.toLowerCase() !== 'me') return w.toLowerCase();
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ');
}

// Deterministic pick so each page keeps the same copy between builds.
function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}
const pick = <T,>(arr: readonly T[], seed: string, salt = 0) => arr[(hash(seed) + salt) % arr.length];

type Role = {
  key: string;
  re: RegExp;
  label: string;
  plural: string;
  img: PhotoKey;
  tasks: string[];
  dishes: string[];
  skill: string;
};

const homeTasks = [
  'Cook fresh breakfast, lunch and dinner to your family’s taste',
  'Plan a weekly menu and grocery list with you',
  'Prepare roti, salan, daal, rice and seasonal sabzi daily',
  'Keep the kitchen, utensils and fridge clean and organised',
  'Store leftovers safely and minimise food waste',
  'Adjust spice, oil and salt for children, elders and dietary needs',
];
const desiDishes = ['Chicken karahi', 'Biryani', 'Pulao', 'Daal chawal', 'Aloo gosht', 'Qorma', 'Nihari', 'Haleem', 'Chapli kebab', 'Paratha & roti', 'Kheer', 'Seasonal sabzi'];

const ROLES: Role[] = [
  { key: 'bbq', re: /\bbbq\b/, label: 'BBQ chef', plural: 'BBQ chefs', img: 'bbq', skill: 'charcoal grilling, marination and live BBQ counters', tasks: ['Marinate and prepare tikka, boti and seekh kebab', 'Manage charcoal grills and live BBQ stations', 'Prepare chutneys, raita, salads and naan pairing', 'Plan quantities for family BBQ nights and events', 'Maintain grill hygiene and safe meat handling', 'Clean grills, skewers and the cooking area after service'], dishes: ['Chicken tikka', 'Seekh kebab', 'Malai boti', 'Reshmi kebab', 'Bihari boti', 'Mutton chops', 'Grilled fish', 'Chapli kebab', 'Behari kebab', 'Tikka boti'] },
  { key: 'tandoor', re: /tandoor/, label: 'tandoor cook', plural: 'tandoor cooks', img: 'tandoor', skill: 'tandoor firing, naan, kulcha and tandoori dishes', tasks: ['Fire and manage a traditional or gas tandoor', 'Prepare and rest dough for naan, kulcha and roghni naan', 'Cook tandoori chicken, tikka and fish', 'Maintain steady output during peak hours or dawats', 'Keep the tandoor area safe and clean', 'Plan dough quantities to avoid waste'], dishes: ['Plain naan', 'Roghni naan', 'Kulcha', 'Taftan', 'Tandoori roti', 'Tandoori chicken', 'Garlic naan', 'Kalonji naan', 'Tandoori fish'] },
  { key: 'roti', re: /roti/, label: 'roti maker', plural: 'roti makers', img: 'roti', skill: 'soft chapati, paratha and tandoori roti in volume', tasks: ['Knead and rest atta dough to the right softness', 'Make chapati, phulka and paratha fresh for every meal', 'Make tandoori roti and naan where equipment allows', 'Keep up with large family or event demand', 'Manage atta stock and reduce wastage', 'Clean tawa, chulha and workspace daily'], dishes: ['Chapati', 'Phulka', 'Paratha', 'Aloo paratha', 'Tandoori roti', 'Puri', 'Makai ki roti', 'Lachha paratha'] },
  { key: 'biryani', re: /biryani/, label: 'biryani cook', plural: 'biryani cooks', img: 'biryani', skill: 'dum biryani, pulao and rice dishes in small and large batches', tasks: ['Cook Sindhi, Bombay, Hyderabadi and chicken biryani', 'Handle large deg biryani for dawats and events', 'Prepare yakhni pulao, zarda and raita', 'Balance spice levels for family and guests', 'Plan rice, meat and masala quantities per head', 'Clean degs and kitchen after cooking'], dishes: ['Chicken biryani', 'Sindhi biryani', 'Mutton biryani', 'Beef biryani', 'Yakhni pulao', 'Kabuli pulao', 'Zarda', 'Raita & salad'] },
  { key: 'karahi', re: /karahi/, label: 'karahi cook', plural: 'karahi cooks', img: 'karahi', skill: 'Peshawari, white and shinwari karahi on high flame', tasks: ['Cook chicken, mutton and beef karahi to order', 'Prepare Peshawari, white, makhni and shinwari styles', 'Manage high-flame wok cooking safely', 'Prepare matching naan, salad and raita', 'Scale portions for family dinners and gatherings', 'Clean karahis and the stove area after service'], dishes: ['Chicken karahi', 'Mutton karahi', 'White karahi', 'Shinwari karahi', 'Makhni karahi', 'Namak mandi karahi', 'Lahori karahi'] },
  { key: 'fastfood', re: /fast food/, label: 'fast food chef', plural: 'fast food chefs', img: 'busy-kitchen', skill: 'burgers, wraps, fries, broast and quick-service prep', tasks: ['Prepare burgers, wraps, shawarma and sandwiches', 'Run fryers for fries, broast and wings safely', 'Make sauces, marinades and coleslaw in-house', 'Keep consistent portion sizes and plating', 'Manage stock rotation and FIFO storage', 'Maintain fryer oil, hygiene and cleaning schedules'], dishes: ['Zinger burger', 'Shawarma', 'Club sandwich', 'Broast', 'Fries & loaded fries', 'Chicken wings', 'Wraps', 'Nuggets'] },
  { key: 'pizza', re: /pizza/, label: 'pizza chef', plural: 'pizza chefs', img: 'pizza', skill: 'dough fermentation, sauces and deck / wood-fired ovens', tasks: ['Prepare and ferment pizza dough daily', 'Make tomato, white and specialty sauces', 'Operate deck, conveyor or wood-fired ovens', 'Create desi-fusion pizzas like tikka and fajita', 'Control topping costs and portioning', 'Keep the pizza station clean and organised'], dishes: ['Chicken tikka pizza', 'Fajita pizza', 'Margherita', 'Pepperoni', 'Malai boti pizza', 'Calzone', 'Garlic bread'] },
  { key: 'bakery', re: /bakery/, label: 'bakery chef', plural: 'bakery chefs', img: 'bakery', skill: 'bread, rusk, cakes and baked snacks', tasks: ['Bake bread, buns, rusks and cookies', 'Prepare patties, puffs and baked savouries', 'Bake and decorate cakes for orders', 'Manage oven temperatures and batch timing', 'Maintain ingredient costing and stock', 'Keep the bakery clean and hygiene-compliant'], dishes: ['Sandwich bread', 'Buns', 'Rusks', 'Chicken patties', 'Puff pastry', 'Cookies', 'Sponge cake', 'Pizza bases'] },
  { key: 'pastry', re: /pastry/, label: 'pastry chef', plural: 'pastry chefs', img: 'pastry', skill: 'cakes, pastries, desserts and plated sweets', tasks: ['Bake cakes, pastries and celebration desserts', 'Prepare creams, ganache, mousse and glazes', 'Decorate birthday and wedding cakes', 'Make traditional desserts like kheer and custard', 'Manage precise recipes and portion costing', 'Keep dessert storage and display hygienic'], dishes: ['Chocolate fudge cake', 'Cheesecake', 'Croissants', 'Éclairs', 'Mousse', 'Trifle', 'Kheer', 'Brownies'] },
  { key: 'diet', re: /diet/, label: 'diet food chef', plural: 'diet food chefs', img: 'healthy', skill: 'low-oil, low-carb, keto and high-protein cooking', tasks: ['Cook low-oil, low-salt and low-carb meals', 'Follow nutritionist or doctor meal plans exactly', 'Prepare keto, diabetic-friendly and high-protein options', 'Weigh and portion meals by calories and macros', 'Label and store meals for the week', 'Avoid allergens and cross-contamination'], dishes: ['Grilled chicken & veg', 'Quinoa salad', 'Daal soup', 'Cauliflower rice', 'Egg white omelette', 'Low-oil karahi', 'Oats & smoothies'] },
  { key: 'mealprep', re: /meal prep/, label: 'meal prep chef', plural: 'meal prep chefs', img: 'meal-prep', skill: 'batch cooking, portioning and safe storage', tasks: ['Batch-cook a week of meals in one or two sessions', 'Portion, label and date every container', 'Balance protein, carbs and vegetables per meal', 'Plan menus around your fitness or family goals', 'Use safe cooling and fridge/freezer storage', 'Leave the kitchen spotless after each session'], dishes: ['Chicken & rice bowls', 'Daal & brown rice', 'Grilled fish', 'Chickpea salad', 'Keema with veg', 'Overnight oats', 'Soups'] },
  { key: 'chinese', re: /chinese/, label: 'Chinese chef', plural: 'Chinese chefs', img: 'chinese', skill: 'wok cooking, Pakistani-Chinese and Asian dishes', tasks: ['Cook Pakistani-Chinese favourites on a high-heat wok', 'Prepare soups, rice, chow mein and gravies', 'Make sauces like Manchurian, chilli and sweet & sour', 'Prep vegetables and proteins with clean knife work', 'Plate dishes for home dinners or restaurant service', 'Keep wok station and oil management clean'], dishes: ['Chicken Manchurian', 'Chow mein', 'Egg fried rice', 'Hot & sour soup', 'Chicken chilli dry', 'Szechuan chicken', 'Dumplings', 'Spring rolls'] },
  { key: 'continental', re: /continental/, label: 'continental chef', plural: 'continental chefs', img: 'continental', skill: 'steaks, pasta, sauces and plated continental dishes', tasks: ['Cook steaks, grilled chicken and fish to order', 'Prepare pasta, lasagne and baked dishes', 'Make classic sauces — mushroom, pepper, white sauce', 'Plate dishes beautifully for guests', 'Plan weekly continental menus with you', 'Maintain a clean, organised kitchen'], dishes: ['Chicken steak', 'Beef steak', 'Fettuccine Alfredo', 'Lasagne', 'Grilled fish', 'Russian salad', 'Shepherd’s pie', 'Soups'] },
  { key: 'desi', re: /desi|pakistani food/, label: 'desi cook', plural: 'desi cooks', img: 'desi-spread', skill: 'authentic Pakistani home-style and dawat cooking', tasks: ['Cook authentic Pakistani salan, karahi and qorma', 'Prepare fresh roti, paratha and naan daily', 'Cook daal, sabzi and rice the way your family likes', 'Prepare dawat menus — biryani, qorma, kebabs, kheer', 'Manage masala, ghee and grocery usage wisely', 'Keep the kitchen clean and hygienic'], dishes: desiDishes },
  { key: 'executive', re: /executive/, label: 'executive chef', plural: 'executive chefs', img: 'chef-hat-cooking', skill: 'kitchen leadership, menu engineering and food costing', tasks: ['Lead kitchen teams and set daily prep lists', 'Design and cost menus for profitability', 'Set hygiene, HACCP-style and quality standards', 'Train cooks and supervise service', 'Control inventory, vendors and wastage', 'Launch new dishes and seasonal menus'], dishes: ['Pakistani fine dining', 'Continental mains', 'BBQ & grills', 'Buffet menus', 'Banquet menus', 'Signature desserts'] },
  { key: 'hotel', re: /hotel/, label: 'hotel chef', plural: 'hotel chefs', img: 'hotel-chef', skill: 'breakfast buffets, à la carte and banquet cooking', tasks: ['Run breakfast buffets and à la carte service', 'Prepare banquet and room-service menus', 'Follow hotel hygiene and food-safety standards', 'Manage mise en place and shift handovers', 'Coordinate with stores for stock and requisitions', 'Maintain consistent quality across shifts'], dishes: ['Breakfast buffet', 'Desi mains', 'Continental à la carte', 'Club sandwiches', 'Soups', 'Banquet menus'] },
  { key: 'restaurant', re: /restaurant|commercial kitchen|kitchen staff/, label: 'restaurant chef', plural: 'restaurant chefs', img: 'restaurant-chefs', skill: 'line cooking, speed, consistency and food costing', tasks: ['Cook to recipe and plate consistently during rush hours', 'Prepare mise en place before every service', 'Work stations — tandoor, BBQ, karahi, Chinese, continental', 'Maintain hygiene, temperature logs and storage', 'Control wastage and portion costs', 'Train and support junior kitchen staff'], dishes: ['Karahi & handi', 'BBQ platters', 'Biryani', 'Chinese', 'Continental', 'Fast food', 'Desserts'] },
  { key: 'wedding', re: /wedding/, label: 'wedding chef', plural: 'wedding chefs', img: 'wedding-buffet', skill: 'large-batch deg cooking for mehndi, barat and walima', tasks: ['Cook in large degs for mehndi, barat and walima', 'Plan menus and quantities per guest count', 'Set up live BBQ, tandoor and dessert stations', 'Coordinate helpers, serving staff and timing', 'Maintain food safety for large crowds', 'Leave the venue kitchen clean after the event'], dishes: ['Chicken / mutton qorma', 'Biryani', 'Mutton pulao', 'Seekh kebab', 'Roghni naan', 'Gajar halwa', 'Kheer', 'Salads & raita'] },
  { key: 'catering', re: /catering/, label: 'catering chef', plural: 'catering chefs', img: 'buffet', skill: 'bulk cooking, buffet setup and event logistics', tasks: ['Plan buffet menus and per-head quantities', 'Cook in bulk while keeping taste consistent', 'Organise transport, chafing dishes and setup', 'Manage helpers and serving staff on site', 'Keep hot food hot and cold food cold safely', 'Pack up and clean after the event'], dishes: ['Qorma', 'Biryani', 'Pulao', 'BBQ', 'Chinese', 'Continental', 'Desserts', 'Live stations'] },
  { key: 'event', re: /event/, label: 'event chef', plural: 'event chefs', img: 'buffet', skill: 'live stations, buffets and timed service for events', tasks: ['Design menus for corporate and private events', 'Run live BBQ, pasta or tandoor stations', 'Prepare canapés, mains and desserts on schedule', 'Coordinate with your event planner and venue', 'Manage food safety for guests', 'Handle clean-up after service'], dishes: ['Live BBQ', 'Pasta station', 'Biryani', 'Qorma', 'Finger food', 'Desserts', 'Hi-tea menu'] },
  { key: 'party', re: /party|birthday/, label: 'party cook', plural: 'party cooks', img: 'party-table', skill: 'party menus, finger food and hi-tea', tasks: ['Plan a party or birthday menu for your guest count', 'Prepare finger food, BBQ, mains and desserts', 'Cook at your home on the party day', 'Arrange serving dishes and buffet layout', 'Manage timing so food is fresh when guests arrive', 'Clean the kitchen after the party'], dishes: ['Chicken sandwiches', 'Chicken shashlik', 'Dahi baray', 'Chaat', 'Biryani', 'BBQ', 'Pasta', 'Cake & desserts'] },
  { key: 'dawat', re: /dawat|gathering/, label: 'dawat cook', plural: 'dawat cooks', img: 'biryani-platter', skill: 'traditional dawat menus for family gatherings', tasks: ['Plan a traditional dawat menu with you', 'Cook qorma, biryani, kebabs and desserts at home', 'Manage per-guest quantities to avoid shortages', 'Prepare fresh naan / roti for serving time', 'Organise serving and table layout', 'Clean up after your guests leave'], dishes: ['Chicken qorma', 'Mutton biryani', 'Seekh kebab', 'Shami kebab', 'Kheer', 'Zarda', 'Raita & salad', 'Naan'] },
  { key: 'office', re: /office|canteen/, label: 'office cook', plural: 'office cooks', img: 'office-meals', skill: 'staff lunches, tea service and canteen menus', tasks: ['Cook fresh daily lunch for staff', 'Run a weekly rotating canteen menu', 'Prepare tea, snacks and meeting refreshments', 'Track groceries and stay within budget', 'Maintain canteen hygiene and safe storage', 'Serve on time, every working day'], dishes: ['Daal chawal', 'Chicken salan', 'Biryani Fridays', 'Sabzi & roti', 'Sandwiches', 'Tea & snacks'] },
  { key: 'mess', re: /mess|hostel/, label: 'mess cook', plural: 'mess cooks', img: 'busy-kitchen', skill: 'bulk daily cooking on a fixed budget', tasks: ['Cook breakfast, lunch and dinner for residents', 'Follow a weekly menu within a fixed budget', 'Cook in bulk while keeping taste consistent', 'Make roti / naan for large numbers', 'Manage stock, storage and wastage', 'Keep the mess kitchen and utensils clean'], dishes: ['Daal', 'Chicken salan', 'Aloo gosht', 'Rice', 'Chana', 'Sabzi', 'Roti', 'Halwa puri (Sunday)'] },
  { key: 'guesthouse', re: /guest house/, label: 'guest house cook', plural: 'guest house cooks', img: 'kitchen', skill: 'breakfast service and on-order meals for guests', tasks: ['Prepare desi and continental breakfast for guests', 'Cook lunch and dinner on order', 'Manage room-service style orders', 'Keep stock and costing records', 'Maintain a guest-ready, hygienic kitchen', 'Cater for guests’ dietary requests'], dishes: ['Paratha & omelette', 'Halwa puri', 'Continental breakfast', 'Karahi', 'Club sandwich', 'Daal & rice'] },
  { key: 'private', re: /private chef|personal chef|personal cook|chef for home|home chef|hire chef|hire a chef/, label: 'private chef', plural: 'private chefs', img: 'chef-herb', skill: 'restaurant-quality cooking and plating at home', tasks: ['Design a personal weekly menu around your tastes', 'Cook restaurant-quality desi, continental and Chinese', 'Plate and serve for family dinners and guests', 'Respect allergies, diets and religious preferences', 'Shop for fresh, quality ingredients', 'Keep your kitchen immaculate'], dishes: ['Steaks', 'Mutton karahi', 'Pasta', 'Biryani', 'Thai curry', 'Grilled fish', 'Desserts', 'Hi-tea'] },
];

const COOK: Role = { key: 'home', re: /.*/, label: 'home cook', plural: 'home cooks', img: 'hero-chef', skill: 'daily Pakistani home-style cooking', tasks: homeTasks, dishes: desiDishes };

type Sched = { key: string; re: RegExp; label: string; text: string; day: { label: string; h: number }[] };
const SCHEDS: Sched[] = [
  { key: 'livein', re: /live in|residential|accommodation|24 hour/, label: 'Live-in', text: 'A live-in cook stays at your home with a private room, meals and agreed duty hours (usually 10–12 hours with breaks and one weekly day off). “24-hour cook” means the cook is available on-site — not working non-stop.', day: [{ label: 'Breakfast', h: 1.5 }, { label: 'Lunch', h: 2.5 }, { label: 'Tea & snacks', h: 1 }, { label: 'Dinner', h: 2.5 }, { label: 'Cleaning & groceries', h: 1.5 }, { label: 'Rest breaks', h: 3 }] },
  { key: 'liveout', re: /live out/, label: 'Live-out', text: 'A live-out cook comes to your home daily at fixed times and returns home in the evening — no accommodation required. Ideal for apartments and smaller homes.', day: [{ label: 'Breakfast', h: 1 }, { label: 'Lunch', h: 2.5 }, { label: 'Dinner prep', h: 2.5 }, { label: 'Cleaning', h: 1 }, { label: 'Groceries', h: 1 }] },
  { key: 'parttime', re: /part time/, label: 'Part-time', text: 'A part-time cook works 2–5 hours a day — typically cooking lunch and dinner in one visit, or two short visits — on a fixed monthly arrangement.', day: [{ label: 'Prep & chopping', h: 0.75 }, { label: 'Cooking', h: 1.75 }, { label: 'Roti / bread', h: 0.5 }, { label: 'Clean-up', h: 0.5 }] },
  { key: 'hourly', re: /hourly|few hours/, label: 'Hourly', text: 'Hire a cook for a few hours — for a dinner, a batch of meals or a short daily slot. Charges depend on hours, menu and frequency.', day: [{ label: 'Prep', h: 0.75 }, { label: 'Cooking', h: 1.5 }, { label: 'Packing / serving', h: 0.25 }, { label: 'Clean-up', h: 0.5 }] },
  { key: 'morning', re: /morning/, label: 'Morning shift', text: 'A morning cook prepares breakfast and lunch (and can pre-prep dinner) between roughly 7am and 1pm — perfect for working families and school runs.', day: [{ label: 'Breakfast', h: 1.25 }, { label: 'Lunch', h: 2 }, { label: 'Dinner pre-prep', h: 1 }, { label: 'Clean-up', h: 0.75 }] },
  { key: 'evening', re: /evening/, label: 'Evening shift', text: 'An evening cook arrives in the afternoon to prepare evening tea and a fresh dinner — ideal for professionals who are out during the day.', day: [{ label: 'Tea & snacks', h: 0.75 }, { label: 'Dinner', h: 2.25 }, { label: 'Next-day prep', h: 0.75 }, { label: 'Clean-up', h: 0.75 }] },
  { key: 'weekend', re: /weekend/, label: 'Weekend', text: 'A weekend cook covers Saturday and/or Sunday — brunch, family lunches, BBQ nights and weekly meal prep — when your regular cook is off or guests visit.', day: [{ label: 'Brunch', h: 2 }, { label: 'Lunch / BBQ', h: 3 }, { label: 'Dinner', h: 2 }, { label: 'Clean-up', h: 1 }] },
  { key: 'daily', re: /daily basis|daily meals/, label: 'Daily', text: 'A daily cook visits every day (or six days a week) at a fixed time to prepare fresh meals, with terms agreed upfront.', day: [{ label: 'Breakfast', h: 1 }, { label: 'Lunch', h: 2 }, { label: 'Dinner', h: 2 }, { label: 'Clean-up', h: 1 }] },
  { key: 'fulltime', re: /full time|full day|permanent|monthly/, label: 'Full-time', text: 'A full-time cook works 8–10 hours a day, six days a week on a fixed monthly arrangement, handling all meals, groceries and kitchen upkeep.', day: [{ label: 'Breakfast', h: 1.5 }, { label: 'Lunch', h: 2.5 }, { label: 'Tea & snacks', h: 1 }, { label: 'Dinner', h: 2.5 }, { label: 'Kitchen & groceries', h: 1.5 }] },
];
const DEFAULT_DAY = SCHEDS[SCHEDS.length - 1].day;
const COMMERCIAL_DAY = [{ label: 'Mise en place', h: 2 }, { label: 'Lunch service', h: 3 }, { label: 'Afternoon prep', h: 1.5 }, { label: 'Dinner service', h: 3 }, { label: 'Closing & cleaning', h: 1 }];
const EVENT_DAY = [{ label: 'Menu & shopping', h: 2 }, { label: 'Prep & marination', h: 3 }, { label: 'Cooking', h: 4 }, { label: 'Serving', h: 2 }, { label: 'Clean-up', h: 1 }];
const OFFICE_DAY = [{ label: 'Breakfast / tea', h: 1 }, { label: 'Lunch cooking', h: 3 }, { label: 'Serving', h: 1.5 }, { label: 'Evening tea', h: 0.5 }, { label: 'Cleaning & stock', h: 1.5 }];

export type Page = ReturnType<typeof makePage>;

// Pages are pure functions of the keyword, so build each one once per process.
const pageCache = new Map<string, Page>();
export function buildPage(e: Entry): Page {
  let p = pageCache.get(e.slug);
  if (!p) pageCache.set(e.slug, (p = makePage(e)));
  return p;
}

function makePage(e: Entry) {
  const k = e.keyword.toLowerCase();
  const H1 = titleCase(e.keyword.replace(/\s+/g, ' ').trim());
  const area = findArea(e.keyword);
  const nearMe = /near me/.test(k);
  const detected = detectCity(e.keyword);
  const city = nearMe ? 'Islamabad & Rawalpindi' : detected;
  const outside = !nearMe && !isFullService(detected);
  const cityInfo = cityBy(detected)!;
  const isArea = !!area && area.name !== area.city;
  const place = isArea ? `${area!.name}, ${area!.city}` : city;
  const cityAreaList = areasOf(detected);
  const scopeNote = outside ? `In ${city}, HireCook.pk currently provides male cooks only: home, full-time, part-time and live-in. Chefs, restaurant, office and event staff are available in Islamabad and Rawalpindi.` : '';
  const role = ROLES.find((r) => r.re.test(k)) || COOK;
  const sched = SCHEDS.find((s) => s.re.test(k));
  const male = /\bmale\b/.test(k);
  const isChef = /chef/.test(k);
  const commercial = ['restaurant', 'hotel', 'executive', 'fastfood', 'pizza', 'bakery'].includes(role.key) && !/home/.test(k);
  const eventy = ['wedding', 'catering', 'event', 'party', 'dawat'].includes(role.key);
  const office = ['office', 'mess', 'guesthouse'].includes(role.key);

  const who = male ? `male ${role.label.replace(/^male /, '')}` : role.label;
  const whoPlural = male ? `male ${role.plural}` : role.plural;

  const intent =
    /agency|provider/.test(k) ? 'agency' :
    /required|available/.test(k) ? 'urgent' :
    /verified|trained|experienced|professional/.test(k) ? 'quality' :
    /service|services/.test(k) ? 'service' :
    nearMe ? 'near' :
    /salary|monthly/.test(k) ? 'monthly' : 'hire';

  const opener = {
    agency: `HireCook.pk is a dedicated cook agency serving ${place}. We source, screen and match ${whoPlural} to homes and businesses, then stay with you after placement.`,
    urgent: `Need a ${who} in ${place} quickly? Share your requirement today and HireCook.pk will shortlist available ${whoPlural} who match your menu, budget and timings — usually within 24–48 hours.`,
    quality: `Looking for a ${H1.toLowerCase().includes('verified') ? 'verified' : H1.toLowerCase().includes('trained') ? 'trained' : H1.toLowerCase().includes('experienced') ? 'experienced' : 'professional'} ${who} in ${place}? HireCook.pk shortlists candidates with real kitchen experience, CNIC and reference checks, and a cooking trial at your home before you decide.`,
    service: `HireCook.pk provides a complete cook service in ${place} — from understanding your menu and schedule to shortlisting, trial cooking and placement support.`,
    near: `Searching for a ${who} near you? HireCook.pk places cooks across Islamabad and Rawalpindi, matching you with candidates who live close to your sector or society for punctual, reliable service.`,
    monthly: `Hire a ${who} in ${place} on a fixed monthly arrangement with written terms. HireCook.pk helps you agree duties, timings, days off and accommodation upfront.`,
    hire: `Hire a ${who} in ${place} with HireCook.pk. Tell us what you like to eat and when — we shortlist suitable ${whoPlural}, arrange a trial cook, and help you finalise duties and terms.`,
  }[intent];

  const middle = commercial
    ? `For ${role.key === 'hotel' ? 'hotels' : 'restaurants, cafés and food businesses'}, we focus on ${role.skill}, speed under pressure and food-cost discipline.`
    : eventy
      ? `Whether it is a family dawat, birthday, mehndi or corporate event, our ${role.plural} handle ${role.skill} — so you can enjoy the occasion with your guests.`
      : office
        ? `For offices, canteens, messes, hostels and guest houses, our cooks deliver ${role.skill}, on time and on budget.`
        : `Every candidate is matched on ${role.skill}${sched ? `, a ${sched.label.toLowerCase()} schedule` : ''} and your family’s taste — ${pick(['less oil, more flavour', 'from simple daal-chawal to dawat-style qorma', 'spice levels the whole family enjoys', 'fresh roti with every meal'], e.slug)}.`;

  const localLine = isArea
    ? area!.blurb
    : area && area.name === 'Rawalpindi'
      ? `We cover all of Rawalpindi: ${cityAreaList.slice(0, 8).map((a) => a.name).join(', ')} and more.`
      : nearMe
        ? 'We serve every major sector and society in Islamabad and Rawalpindi, plus male cooks in Karachi, Lahore, Faisalabad, Gujranwala, Peshawar, Multan, Hyderabad and Quetta.'
        : city === 'Islamabad'
          ? 'We serve all Islamabad sectors and societies including F-6, F-7, F-10, G-11, E-11, I-8, Bahria Town, DHA and Gulberg Greens.'
          : `${cityInfo.blurb} We place male cooks in ${cityAreaList.slice(0, 8).map((a) => a.name).join(', ')} and more.`;

  // Group angle keeps near-identical keywords (e.g. "male cook in Islamabad" in two groups) distinct.
  const angle = {
    'Cook hiring': '',
    'Male cooks': ' Our male cook specialists are experienced with heavy-duty desi cooking, tandoor-style roti and large family dawats.',
    Schedules: ' You choose the hours; we match a cook whose routine fits yours.',
    'Chefs and cuisines': ` Our chef specialists bring proven skills in ${role.dishes.slice(0, 3).join(', ')} and more.`,
    'Islamabad areas': '',
    'Rawalpindi areas': '',
    'Commercial and events': ' Business clients get written terms, replacement support and trial shifts before confirming.',
  }[e.group] ?? (outside ? ` In ${city} we currently provide male cooks only (home, full-time, part-time and live-in), matched to your family's taste and timings.` : '');
  const intro = `${opener} ${middle}${angle}`;

  const quickAnswer = `To ${H1.toLowerCase().startsWith('hire') ? H1.charAt(0).toLowerCase() + H1.slice(1) : 'hire a ' + who + ' in ' + place}, send your requirements (area, cuisine, family size, timings and budget) to HireCook.pk by WhatsApp, phone or the online form. We shortlist suitable ${whoPlural}, arrange a paid trial cook, and you hire once you are satisfied. Most families have a cook working within the same week.`;

  const facts: [string, string][] = [
    ['Service', H1],
    ['Location', isArea ? `${area!.name} (${area!.kind}), ${area!.city}` : city],
    ...(outside ? [['Service scope', 'Male cooks only'] as [string, string]] : []),
    ['Cook type', titleCase(who)],
    ['Schedule', sched ? sched.label : 'Full-time, part-time, live-in or live-out'],
    ['Speciality', role.skill],
    ['Verification', 'CNIC, references & trial cook'],
    ['Shortlist time', 'Usually 24–48 hours'],
    ['Booking', 'WhatsApp, call or online form'],
  ];

  const day = commercial ? COMMERCIAL_DAY : eventy ? EVENT_DAY : office ? OFFICE_DAY : sched ? sched.day : DEFAULT_DAY;
  const dayTitle = commercial ? 'A typical kitchen shift' : eventy ? 'An event day, hour by hour' : office ? 'A typical office kitchen day' : `A typical ${sched ? sched.label.toLowerCase() : 'full-time'} cook’s day`;

  const scheduleText = sched
    ? sched.text
    : commercial
      ? 'Commercial cooks usually work 10–12 hour shifts, six days a week, with one weekly off and duty meals. Shift timings are agreed with the kitchen manager.'
      : eventy
        ? 'Event cooks are booked per event or per day. The charge depends on guest count, menu, number of dishes and whether helpers are needed.'
        : 'Choose full-time, part-time, live-in, live-out, morning, evening or weekend — whatever suits your home. Duties, timings and weekly off are agreed in writing before the cook starts.';

  const checks = `Before introduction, we collect CNIC details and previous-employer references, and confirm the cook’s cooking experience. You then meet the cook and take a trial cook at your home. ${/verified|trained/.test(k) ? 'Ask us for the candidate’s verification and training details — we share what is on file so you can decide with confidence.' : `For live-in staff we also recommend police verification through ${nearMe ? 'Islamabad Police (ICT) or Punjab Police' : cityInfo.police}.`}`;

  const v = (a: string[], salt: number) => pick(a, e.slug, salt);
  const why = [
    { t: v(['Screened candidates', 'Verified background'], 11), d: v(['CNIC and reference checks before you meet anyone.', 'Identity and previous-employer checks come first.'], 12) },
    { t: v(['Trial cook first', 'Taste before you hire'], 13), d: v(['Taste their food in your own kitchen before hiring.', `A paid trial in your ${commercial || office ? 'kitchen' : 'home'} shows real skill.`], 14) },
    { t: v(['Local to you', 'Short commute'], 15), d: v([`Cooks who can reach ${isArea ? area!.name : city} on time.`, `We match ${whoPlural} living close to ${isArea ? area!.name : city}.`], 16) },
    { t: v(['Clear written terms', 'Everything on paper'], 17), d: v(['Written duties, timings, off days and notice period.', 'Duties, hours, leave and notice agreed in writing.'], 18) },
    { t: v(['Replacement support', 'Ongoing support'], 19), d: v(['If it does not work out, we help you find a replacement.', 'We stay in touch after placement and help if anything changes.'], 20) },
    { t: v(['Fast shortlist', 'Profiles in 24–48h'], 21), d: v(['Profiles usually shared within 24–48 hours.', `Suitable ${whoPlural} shortlisted within one to two days.`], 22) },
  ];

  const faqs: { q: string; a: string }[] = [
    { q: `How do I ${H1.toLowerCase().startsWith('hire') ? H1.charAt(0).toLowerCase() + H1.slice(1) : 'hire a ' + who + ' in ' + place}?`, a: `WhatsApp HireCook.pk on ${site.whatsappDisplay}, call ${site.phone}, or fill in the hire form on this page. Tell us your area, cuisine, number of people, timings and budget. We shortlist suitable ${whoPlural}, arrange a trial cook at your home, and you only hire once you are happy.` },
    { q: `How quickly can a ${who} start in ${place}?`, a: `Most families receive suitable ${whoPlural} profiles within 24–48 hours. After an interview and a trial cook at your home, the cook can usually start the same week.` },
    { q: sched ? `What does a ${sched.label.toLowerCase()} cook do?` : commercial ? `What experience should a ${role.label} have?` : eventy ? `How many guests can one ${role.label} handle?` : `Should I hire a full-time or part-time cook?`, a: sched ? sched.text : commercial ? `Look for 3+ years in a similar kitchen, speed during rush hours, recipe consistency, hygiene habits and food-cost awareness. We verify past employers and can arrange a practical cooking trial.` : eventy ? `One experienced cook can usually handle 30–50 guests for a home dawat with a helper; for 100+ guests we recommend a head cook with 2–3 helpers. We plan staffing with your menu.` : `Full-time suits larger families who want all meals and groceries handled. Part-time (2–5 hours) suits couples and small families who mainly need lunch and dinner. We help you choose.` },
    { q: `Which dishes can the cook make?`, a: `Our ${whoPlural} commonly prepare ${role.dishes.slice(0, 6).join(', ')} and more. Share your favourite dishes and we match a cook who already makes them well.` },
    { q: isArea ? `Do you provide cooks in ${area!.name}, ${area!.city}?` : nearMe ? 'How do I find a cook near me?' : `Which areas of ${city} do you cover?`, a: isArea ? `Yes. We place ${outside ? 'male cooks' : 'cooks'} in ${area!.name} and nearby ${area!.nearby.join(', ')}. Share your street or nearest landmark (e.g. ${area!.landmarks[0]}) so we can match someone with a short commute.` : nearMe ? 'Share your sector or society on WhatsApp. We match cooks who live nearby so they arrive on time. All services in Islamabad and Rawalpindi, and male cooks in Karachi, Lahore, Faisalabad, Gujranwala, Peshawar, Multan, Hyderabad and Quetta.' : `We cover ${cityAreaList.slice(0, 12).map((a) => a.name).join(', ')} and more areas across ${city}.` },
    { q: 'Are the cooks background-checked?', a: checks },
    { q: male ? 'Why do families prefer male cooks?' : 'What if the cook does not suit us?', a: male ? 'Many households prefer male cooks for heavy-duty cooking, large dawats, tandoor/BBQ work and live-in roles. You can also specify age range, language and experience level.' : 'Tell us within the agreed period and we help arrange a replacement candidate. Clear written terms from day one keep things simple for both sides.' },
  ];

  if (outside) faqs.push({ q: `Which cook services are available in ${city}?`, a: scopeNote });

  const image: PhotoKey = outside ? pick(['male-chef', 'chef-chopping', 'hero-chef', 'dough', 'busy-kitchen', 'chef-hat-cooking'] as PhotoKey[], e.slug) : role.key === 'home' ? (male ? 'male-chef' : area ? (area.city === 'Rawalpindi' ? 'desi-spread' : 'hero-chef') : pick(['hero-chef', 'family-dinner', 'rice', 'desi-curry'] as PhotoKey[], e.slug)) : role.img;

  const description = trim160(
    `${H1}: ${intent === 'agency' ? 'trusted cook agency' : e.group === 'Male cooks' ? 'experienced male cook specialists' : e.group === 'Chefs and cuisines' ? 'skilled ' + role.label + ' specialists' : 'hire screened ' + whoPlural} for ${isArea ? area!.name + ', ' + area!.city : city}. ${sched ? sched.label + ' options, trial' : 'Trial'} cook first. Call or WhatsApp HireCook.pk.`,
  );
  const title = trim60(`${H1} | ${pick(['Trusted Cooks', 'Screened Cooks', 'Hire in 48h', 'Trial First'], e.slug)} – HireCook.pk`, H1);

  return { outside, scopeNote, cityInfo, isArea, cityAreaList, e, H1, title, description, area, city, place, role, sched, male, isChef, commercial, eventy, office, who, whoPlural, intro, localLine, quickAnswer, facts, day, dayTitle, scheduleText, checks, why, faqs, image, tasks: seededShuffle(role.tasks, e.slug + "t"), dishes: seededShuffle(role.dishes, e.slug + "d"), intent, nearMe };
}

function trim160(s: string) {
  return s.length <= 160 ? s : s.slice(0, 157).replace(/\s+\S*$/, '') + '…';
}
function trim60(s: string, h1: string) {
  if (s.length <= 62) return s;
  const short = `${h1} | HireCook.pk`;
  return short.length <= 65 ? short : h1;
}

export function related(e: Entry, n = 8) {
  const p = buildPage(e);
  const scored = entries
    .filter((x) => x.id !== e.id)
    .map((x) => {
      const q = buildPage(x);
      let s = 0;
      if (x.group === e.group) s += 2;
      if (q.role.key === p.role.key) s += 3;
      if (q.sched?.key && q.sched.key === p.sched?.key) s += 3;
      if (p.area && q.area && p.area.nearby.includes(q.area.name)) s += 5;
      if (q.city === p.city) s += p.outside ? 8 : 1;
      else if (p.outside || q.outside) s -= 6;
      if (q.male === p.male) s += 0.5;
      return { x, s: s + ((hash(e.slug + x.slug) % 100) / 1000) };
    })
    .sort((a, b) => b.s - a.s);
  return scored.slice(0, n).map((r) => r.x);
}

export const bySlug = (slug: string) => entries.find((x) => x.slug === slug);
export const areaEntry = (name: string, city: string) =>
  entries.find((x) => {
    const a = findArea(x.keyword);
    return a && a.name === name && a.city === city;
  });

function seededShuffle<T>(a: readonly T[], seed: string): T[] {
  const b = [...a];
  let h = hash(seed);
  for (let i = b.length - 1; i > 0; i--) {
    h = (Math.imul(h, 1103515245) + 12345) >>> 0;
    const j = h % (i + 1);
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}
