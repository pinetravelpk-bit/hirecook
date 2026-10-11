import type { Page } from './content';

// Long-form, keyword-targeted hiring guide for every keyword page (~1,500–1,900 words).
// Each page gets its own seeded selection of sections, list items, phrasings and order,
// built from its facets (cook type, schedule, city, area, intent), so the 360 pages stay distinct.

export type Section = {
  id: string;
  h2: string;
  paras: string[];
  list?: { t?: string; d: string }[];
  ordered?: boolean;
  table?: { head: string[]; rows: string[][] };
  after?: string[];
};
export type Article = { takeaways: string[]; sections: Section[]; faqs: { q: string; a: string }[] };

function hash(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
  return h;
}
function rng(seed: string) {
  let a = hash(seed);
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const join = (a: string[]) => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);

type V = string | string[]; // a sentence, or alternative phrasings of it

export function buildArticle(p: Page): Article {
  const r = rng(p.e.slug);
  const one = <T,>(a: readonly T[]) => a[Math.floor(r() * a.length)];
  const say = (v: V) => (Array.isArray(v) ? one(v) : v);
  const shuffle = <T,>(a: readonly T[]) => {
    const b = [...a];
    for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
    return b;
  };
  const some = <T,>(a: readonly T[], n: number) => shuffle(a).slice(0, n);
  const items = (pool: { t: V; d: V }[], n: number) => some(pool, n).map((x) => ({ t: say(x.t), d: say(x.d) }));

  const kw = p.H1;
  const kwl = p.H1.toLowerCase();
  const who = p.who;
  const whos = p.whoPlural;
  const isBiz = p.commercial || p.office;
  const client = isBiz ? 'business' : p.eventy ? 'host' : 'family';
  const clients = isBiz ? 'businesses' : p.eventy ? 'hosts' : 'families';
  const home = isBiz ? 'kitchen' : 'home';
  const placeShort = p.isArea ? p.area!.name : p.city;
  const cityName = p.city.includes('&') ? 'Islamabad and Rawalpindi' : p.city;
  const cityOne = p.city.split(' & ')[0];
  const dishes = shuffle(p.dishes);
  const sched = p.sched?.label.toLowerCase();
  const nearby = p.isArea ? p.area!.nearby : some(p.cityAreaList, 5).map((a) => a.name);
  const landmarks = p.isArea ? p.area!.landmarks : [];
  const police = p.nearMe ? 'Islamabad Police (ICT) or Punjab Police' : p.cityInfo.police;
  const homes = p.isArea ? p.area!.homes : 'family homes, apartments and larger houses';
  const dish = () => one(dishes).toLowerCase();

  // ---------- Key takeaways ----------
  const takeaways = shuffle([
    say([`To arrange ${kwl}, send your area, cuisine, timings and ${isBiz ? 'headcount' : 'family size'} to HireCook.pk by WhatsApp, phone or the form on this page.`, `${kw} starts with a two-minute request: area, preferred dishes, timings and ${isBiz ? 'number of covers' : 'how many people you cook for'}.`]),
    say([`Expect a shortlist of screened ${whos} within 24–48 hours${p.isArea ? ` for ${p.area!.name}` : ''}.`, `Profiles of suitable ${whos} are usually shared within one to two days.`]),
    say([`Every candidate is CNIC- and reference-checked, and you taste their food in a trial cook before deciding.`, `No one starts without identity and reference checks plus a trial cook in your own ${home}.`]),
    say([`${sched ? cap(sched) + ' terms' : 'Duties, timings'}, weekly off and notice period are agreed in writing from day one.`, `Written terms covering duties, hours, leave and notice keep the arrangement clear for both sides.`]),
    p.outside ? `In ${cityName} HireCook.pk currently provides male cooks only: home, full-time, part-time and live-in.` : say(['HireCook.pk is registered with SECP, FBR (NTN), the Labour Department and PESSI.', 'A legally registered agency: SECP, FBR NTN, Labour Department and PESSI.']),
  ]);

  const S: Section[] = [];

  // 1. Overview (always first)
  S.push({
    id: 'guide',
    h2: one([`${kw}: the complete guide`, `${kw}: everything you need to know`, `A practical guide to ${kwl}`]),
    paras: [
      say([
        `Finding the right ${who} is one of the most important decisions a ${client} makes. The person you choose shapes what you eat every day, how your ${home} runs and how relaxed you feel when guests arrive.`,
        `If you are searching for ${kwl}, you want two things: food you look forward to and complete peace of mind about who is working in your ${home}.`,
        `Hiring a ${who} is about more than cooking. Punctuality, hygiene, honesty and the ability to cook the way your ${client === 'family' ? 'family' : 'team'} likes matter just as much as the recipes.`,
      ]) + ' ' + say([
        `This guide walks through ${kwl} step by step: what to look for, what to ask, how the trial cook works and what to put in writing.`,
        `Below you will find the checklist our team uses when placing ${whos} in ${cityName}, from the first conversation to the first month.`,
        `Everything here comes from placing cooks with ${clients} across ${cityName}: practical, local and easy to follow.`,
      ]),
      `${p.isArea ? `${p.area!.blurb} ` : p.outside ? `${p.cityInfo.blurb} ` : ''}${say([
        `Whether you need help ${sched ? `on a ${sched} basis` : 'every day or just a few hours a week'}, the principles stay the same: be clear about what you need, check experience, taste before committing and agree terms on paper.`,
        `${sched ? `For a ${sched} arrangement` : 'For any arrangement'}, the formula is simple: a clear brief, careful checks, a fair trial and written terms.`,
      ])} ${p.outside ? `In ${cityName}, our current service is male cooks for homes.` : say([`In ${cityName} we place everything from home and male cooks to chefs, restaurant teams, office cooks and event chefs.`, `${cityName} is our home base, where every type of cook and chef is available.`])}`,
    ],
  });

  // 2. Why hire
  const why: { t: V; d: V }[] = [
    { t: ['Time back every day', 'Hours saved'], d: [`Shopping, chopping, cooking and washing up easily take three to four hours a day. A ${who} gives that time back.`, `Daily cooking quietly eats three or four hours. Handing it to a ${who} frees your mornings and evenings.`] },
    { t: ['Healthier home-style food', 'Better, cleaner meals'], d: [`Fresh meals with controlled oil and salt beat takeaway, and you always know what went into the pot.`, `Home cooking with fresh ingredients is lighter and cheaper than ordering in several times a week.`] },
    { t: ['Consistency', 'The same great taste'], d: [`A good ${who} learns exactly how you like your ${dish()} and keeps it that way.`, `Once your preferences are learned, your ${dish()} tastes the same every single time.`] },
    { t: isBiz ? ['Steady service at peak hours', 'Reliable rush-hour output'] : ['Stress-free hosting', 'Easy dawats'], d: isBiz ? [`An experienced cook keeps quality steady when orders peak and keeps wastage under control.`, `Peak-hour pressure is easier with a cook who has handled busy services before.`] : [`Eid lunches, dawats and visiting relatives become easy when someone skilled handles menus and quantities.`, `Guests at short notice are no longer a worry when a capable cook is in the kitchen.`] },
    { t: ['Less food waste', 'Smarter groceries'], d: [`Planned menus and sensible use of leftovers reduce what ends up in the bin.`, `Weekly menu planning means fewer impulse buys and less spoiled food.`] },
    { t: ['Care for elders and children', 'Meals for every age'], d: [`Softer, low-spice options for elders and children can be cooked alongside the main meal.`, `A cook can prepare a mild version for children and elders without a second trip to the stove.`] },
  ];
  if (p.male) why.push({ t: ['Strength for heavy cooking', 'Heavy-duty cooking'], d: ['Large degs, tandoor and BBQ work and heavy grocery runs are why many homes prefer a male cook.', 'Many households choose a male cook for big degs, live BBQ and live-in roles.'] });
  if (p.sched?.key === 'livein') why.push({ t: 'Help on call', d: 'A live-in cook covers early breakfasts and late dinners within agreed duty hours.' });
  if (p.sched?.key === 'parttime' || p.sched?.key === 'hourly') why.push({ t: 'Flexible and affordable', d: 'A short daily visit covers the main meals, which suits couples and small families well.' });
  S.push({
    id: 'why',
    h2: one([`Why ${clients} in ${placeShort} hire a ${who}`, `Benefits of hiring a ${who} in ${placeShort}`, `Is a ${who} worth it in ${placeShort}?`]),
    paras: [say([`Requests for ${whos} in ${placeShort} keep growing, and the reasons are practical:`, `Here is what ${clients} in ${placeShort} tell us they gain:`, `The benefits show up within the first week:`])],
    list: items(why, 5),
  });

  // 3. What to look for
  const look: { t: V; d: V }[] = [
    { t: ['Relevant experience', 'Track record'], d: [`Ask where the cook has worked and for how long. For this role, ${p.role.skill} matters most.`, `Previous jobs tell you a lot; look for experience with ${p.role.skill}.`] },
    { t: ['Your everyday dishes', 'The right repertoire'], d: [`List your ten most-cooked dishes. A strong candidate should already make most of them, such as ${join(dishes.slice(0, 3))}.`, `Check the cook already makes ${join(dishes.slice(0, 3).map((d) => d.toLowerCase()))} the way you like.`] },
    { t: ['Hygiene habits', 'Cleanliness'], d: [`Clean hands and clothes, separate boards for raw meat and a tidy workspace are non-negotiable.`, `Watch for regular hand-washing and a clean, organised counter while cooking.`] },
    { t: ['Planning', 'Menu and grocery planning'], d: [`A good ${who} plans a weekly menu, writes a grocery list and uses leftovers sensibly.`, `Ask how they plan the week; good cooks think ahead about groceries and leftovers.`] },
    { t: ['Communication', 'Attitude'], d: ['Clear communication, punctuality and openness to feedback matter as much as the cooking.', 'A cook who listens and adjusts spice, oil and salt is easier to work with long term.'] },
    { t: ['References and ID', 'Verifiable background'], d: ['Two employer references and a CNIC copy are the minimum before anyone starts.', 'Never skip CNIC and reference checks, however urgent the need.'] },
    { t: ['Speed', 'Time management'], d: [`Can the cook have lunch ready on time while prepping dinner? Multitasking is a key skill${isBiz ? ' in a busy kitchen' : ''}.`, 'Good cooks manage two or three dishes at once without anything burning.'] },
  ];
  if (p.role.key === 'bbq' || p.role.key === 'tandoor') look.push({ t: 'Fire safety', d: 'Check safe handling of charcoal, gas and hot tandoors, and proper cleaning of grills afterwards.' });
  if (['pastry', 'bakery', 'pizza'].includes(p.role.key)) look.push({ t: 'Precision', d: 'Baking depends on exact weights and oven control. Ask the cook to talk you through a recipe.' });
  S.push({
    id: 'look-for',
    h2: one([`What to look for in a ${who}`, `How to choose a good ${who}`, `Qualities of a great ${who}`]),
    paras: [say([`Use this checklist when you compare profiles for ${kwl}:`, `When reviewing candidates for ${kwl}, score each one on these points:`, `These are the qualities that separate a good ${who} from an average one:`])],
    list: items(look, 5),
  });

  // 4. Interview questions
  const qpool = [
    'Where have you worked before, and why did you leave?',
    `Which of these can you cook without a recipe: ${join(dishes.slice(0, 4))}?`,
    'How do you plan a weekly menu and grocery list?',
    'How do you store cooked food and leftovers?',
    `What timings suit you${sched ? ` for a ${sched} role` : ''}, and how will you travel here?`,
    'How would you cook for someone with diabetes or high blood pressure?',
    'Can you share two references and a CNIC copy?',
    'What do you do when you are running late?',
    'Which dish are you most proud of, and how do you make it?',
    'How do you keep the kitchen clean while cooking?',
  ];
  const qs = some(qpool, 6);
  if (p.sched?.key === 'livein') qs.push('Have you lived in with a family before? What were the room and meal arrangements?');
  if (p.eventy) qs.push('What is the largest guest count you have cooked for, and how many helpers did you need?');
  if (isBiz) qs.push('How do you control portions, wastage and stock rotation?');
  if (p.isArea) qs.push(`Do you live near ${p.area!.name} or ${p.area!.nearby[0]}? How long is your commute?`);
  S.push({
    id: 'interview',
    h2: one(['Questions to ask before you hire', `Interview questions for a ${who}`, 'What to ask in the interview']),
    paras: [say([`A 20-minute conversation reveals a lot. Our team recommends these questions for every ${who} interview:`, `Use these questions to compare ${whos} fairly:`])],
    list: qs.map((d) => ({ d })),
    ordered: true,
    after: [say([`Listen for detail. A cook who explains exactly how they make ${dish()} is more convincing than one who says “I cook everything”.`, `Specific answers, with timings, quantities and methods, are the best sign of real experience.`])],
  });

  // 5. Trial
  const watch: { t: V; d: V }[] = [
    { t: 'Preparation', d: ['Are vegetables washed properly and raw and cooked food kept apart?', 'Notice how ingredients are cleaned and organised before cooking starts.'] },
    { t: 'Timing', d: ['Is the food ready on time, with two dishes managed together?', 'Does everything come together at the agreed time?'] },
    { t: 'Taste', d: ['Is the salt, spice and oil right? Would you happily eat it three times a week?', 'Taste critically. Would your family enjoy this regularly?'] },
    { t: 'Clean-up', d: ['Is the kitchen left as clean as it was found?', 'Check the stove, sink and counters afterwards.'] },
    { t: 'Attitude', d: ['Does the cook ask about your preferences and take feedback well?', 'Notice whether the cook asks questions and responds well to comments.'] },
    { t: 'Use of ingredients', d: ['Was anything wasted, or were quantities sensible?', 'Good cooks use what they need and store the rest properly.'] },
  ];
  S.push({
    id: 'trial',
    h2: one(['How the trial cook works', 'Running a fair trial cook', `The trial cook: taste before you hire`]),
    paras: [
      say([
        `The trial cook is the most reliable way to judge a ${who}. Ask the candidate to make two or three dishes your ${client} eats often, for example ${join(dishes.slice(1, 4).map((d) => d.toLowerCase()))}, in your own ${home} with your own equipment.`,
        `Pick two or three everyday dishes, perhaps ${join(dishes.slice(2, 5).map((d) => d.toLowerCase()))}, and let the cook prepare them in your ${home}. It shows real skill far better than any interview.`,
      ]),
      say(['While it runs, watch these points:', 'During the trial, pay attention to:']),
    ],
    list: items(watch, 4),
    after: [say(['Trials are usually paid for the time spent. If the first candidate is not right, HireCook.pk arranges the next profile on your shortlist.', 'If the fit is not right, we line up another trial with the next candidate. There is no pressure to hire after a trial.'])],
  });

  // 6. Menu
  const extra = ['daal mash', 'chicken salan', 'aloo gobhi', 'bhindi', 'keema matar', 'palak gosht', 'chana daal', 'kadhi pakora', 'chicken pulao', 'shami kebab', 'vegetable rice', 'mixed sabzi', 'mutton shorba', 'haleem', 'nihari', 'karela gosht', 'lauki chana', 'chicken jalfrezi', 'fish tikka', 'arvi gosht'];
  const pool = shuffle([...p.dishes.map((d) => d.toLowerCase()), ...extra.filter((d) => !p.dishes.map((x) => x.toLowerCase()).includes(d))]);
  const breakfasts = shuffle(['paratha with omelette', 'halwa puri', 'anda bread and chai', 'aloo paratha with yoghurt', 'oats with fruit', 'chana with kulcha', 'french toast and tea', 'egg bhurji with roti', 'cornflakes and fruit']);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const biz = isBiz || p.eventy;
  const rows = days.map((d, i) => biz ? [d, cap(pool[i * 2 % pool.length]), cap(pool[(i * 2 + 1) % pool.length])] : [d, cap(breakfasts[i % breakfasts.length]), cap(pool[i * 2 % pool.length]), cap(pool[(i * 2 + 1) % pool.length]) + ' with roti']);
  S.push({
    id: 'menu',
    h2: biz ? one([`A sample menu rotation`, `Example ${p.eventy ? 'event' : 'kitchen'} menu plan`]) : one([`A sample weekly menu from a ${who}`, `What a week of meals can look like`, `Example weekly menu`]),
    paras: [say([`Here is an example of what a ${who} can plan. Your real menu is built around your tastes, the season and your grocery budget.`, `A typical week could look like this, adjusted to what your ${client} enjoys.`])],
    table: biz ? { head: ['Day', 'Main', 'Side / special'], rows } : { head: ['Day', 'Breakfast', 'Lunch', 'Dinner'], rows },
    after: [say([`Ask for next week’s menu every Friday so groceries are bought in one trip, which saves money and reduces waste.`, `Planning one week ahead keeps groceries organised and avoids last-minute market runs.`])],
  });

  // 7. Terms
  const termPool: { t: V; d: V }[] = [
    { t: 'Duties', d: [`List exactly what is included: ${isBiz ? 'stations, prep, service and closing' : 'which meals, roti, grocery shopping, serving and cleaning'}.`, `Write down the duties clearly: ${isBiz ? 'prep, service and closing tasks' : 'meals, roti, shopping and kitchen cleaning'}.`] },
    { t: ['Timings and weekly off', 'Hours'], d: p.sched ? p.sched.text : ['Agree daily hours and one fixed weekly day off.', 'Fix the daily start and finish times and a weekly off day.'] },
    { t: 'Leave', d: ['Agree annual leave, Eid holidays and sick days.', 'Settle Eid leave and what happens on sick days upfront.'] },
    { t: 'Notice period', d: ['Two to four weeks’ notice on both sides protects everyone.', 'Agree a notice period so neither side is left stranded.'] },
    { t: 'Probation', d: ['A short probation period lets both sides confirm the fit.', 'Start with a probation month and review together at the end of it.'] },
    { t: 'Groceries and receipts', d: ['If the cook shops, agree a weekly amount and keep receipts.', 'Use a simple notebook or app to track grocery spending and receipts.'] },
    { t: 'Phone and visitors', d: ['Agree simple house rules on phone use and visitors during duty hours.', 'Clear house rules avoid awkward conversations later.'] },
  ];
  const terms = items(termPool, 5);
  if (p.sched?.key === 'livein') terms.unshift({ t: 'Accommodation and meals', d: 'Describe the room, bathroom, meals and rest hours. “24-hour” means available on site, not working non-stop.' });
  S.push({
    id: 'terms',
    h2: one([`Terms to agree for ${kwl}`, 'What to put in writing', `A simple agreement with your ${who}`]),
    paras: [say([`Clear terms prevent most problems. Put these in writing before the ${who} starts:`, `A one-page agreement covering these points is all you need:`])],
    list: terms,
    after: [say(['HireCook.pk helps you prepare these terms during placement.', 'We share a simple template during placement so nothing is forgotten.'])],
  });

  // 8. Optional sections, picked per page
  const optional: Section[] = [
    {
      id: 'hygiene',
      h2: one(['Kitchen hygiene and food safety', 'Food-safety standards to agree', 'Keeping your kitchen hygienic']),
      paras: [say([`Food safety is non-negotiable${isBiz ? ' in a commercial kitchen' : ' in a home with children and elders'}. Agree these on day one:`, 'Set these hygiene rules from the start:'])],
      list: some(['Wash hands before cooking and after raw meat, eggs or rubbish.', 'Use separate boards and knives for raw meat and vegetables.', 'Refrigerate cooked food within two hours and date leftovers.', 'Check dates on dairy and meat every few days.', 'Clean the stove, counters and sink after every meal.', 'Keep spices and flour in sealed containers.', 'Use filtered or boiled water for drinking and dough.', 'Wash fruit and salad vegetables thoroughly.'], 5).map((d) => ({ d })),
    },
    {
      id: 'seasonal',
      h2: one(['Ramadan, seasons and special diets', 'Cooking through the year', 'Diet needs and seasonal menus']),
      paras: [
        say([`In Ramadan the routine shifts to sehri and iftar: parathas, eggs and yoghurt before dawn, then pakoras, fruit chaat and a light main course at iftar.`, `During Ramadan a good ${who} prepares sehri early and an iftar spread of pakoras, chaat, dahi baray and a main course.`]) + ' ' + one([`Winter brings requests for saag, makki ki roti and gajar ka halwa.`, `In winter, nihari, paye and hot soups are popular.`, `Cold months mean haleem, palak gosht and gajar ka halwa.`]),
        say([`If someone has diabetes, high blood pressure or an allergy, tell the cook in writing. An experienced ${who} can cook with less oil and salt and keep allergens separate.`, `Share any medical diet in writing. Less oil, less salt, brown rice or multigrain atta are easy changes for a skilled ${who}.`]),
      ],
    },
    {
      id: 'mistakes',
      h2: one(['Common hiring mistakes to avoid', 'Mistakes families make (and how to avoid them)', 'What not to do']),
      paras: [say(['Most problems come from a few avoidable mistakes:', 'Avoid these and most placements run smoothly:'])],
      list: items([
        { t: 'Skipping the trial', d: ['A great interview does not guarantee great food. Always taste first.', 'Never hire on conversation alone.'] },
        { t: 'Vague duties', d: ['If shopping, serving or cleaning are expected, say so before day one.', 'Unspoken expectations are the top cause of friction.'] },
        { t: 'No checks', d: ['Never skip CNIC and reference checks.', 'Urgency is no reason to skip verification.'] },
        { t: 'Ignoring the commute', d: [`A long daily trip across ${cityOne} leads to late arrivals.`, 'Long commutes are the main reason cooks leave early.'] },
        { t: 'No early feedback', d: ['Give clear, kind feedback in week one.', 'Small corrections early prevent bigger issues later.'] },
        { t: 'Changing duties later', d: ['Adding big new duties without discussion causes friction.', 'Discuss any change in workload openly.'] },
      ], 4),
    },
    {
      id: 'first-week',
      h2: one(['The first week with your new cook', 'Settling in: the first seven days', 'Making the first week a success']),
      paras: [
        say([`Spend a little time on day one showing where everything is kept and explaining your family’s favourite dishes and spice levels.`, `On day one, walk the cook through the kitchen, pantry and your preferred dishes.`]),
        say([`Taste daily during the first week and give specific feedback, such as less chilli in the ${dish()} or softer roti. Most cooks adjust within days.`, `Small, specific feedback in the first week, like “a little less oil in the ${dish()}”, makes a huge difference.`]),
      ],
    },
  ];
  if (p.male) optional.push({
    id: 'male-cooks',
    h2: one([`Why many homes choose a male cook`, 'Male cooks: what families value']),
    paras: [say([`Male cooks are often preferred for heavy degs, tandoor and BBQ work, early grocery runs and live-in roles. Many have years of experience in homes, restaurants and messes.`, `In Pakistan, a large share of experienced domestic cooks are men, many of whom trained in restaurants, hostels or large households before moving to family homes.`]) + ' ' + say([`You can also specify age range, language (Urdu, Punjabi, Pashto or Sindhi) and experience level in your request.`, `Mention any preference for language, age range or experience when you get in touch.`])],
  });
  S.push(...some(optional, Math.min(optional.length, p.male ? 4 : 3)));

  // 9. Local (always)
  const localParas = p.isArea
    ? [
        say([`${p.area!.name} is a ${p.area!.kind} in ${p.area!.city} with ${homes}. Cooks living nearby arrive on time and miss fewer days, so we prioritise candidates from ${p.area!.name} and nearby ${join(nearby)}.`, `Most homes in ${p.area!.name} are ${homes}. We look first for cooks living in or near ${join(nearby)}, which keeps the daily commute short.`]),
        say([`When you contact us, mention your street or a landmark such as ${join(landmarks)}.`, `A nearby landmark, for example ${landmarks[0]}, helps us match the right candidate faster.`]),
      ]
    : [
        say([`We place ${whos} across ${cityName}, including ${join(nearby)} and many more areas.`, `Our ${cityName} network covers ${join(nearby)} and every major neighbourhood.`]) + ' ' + say(['A cook who lives nearby means better punctuality.', 'Matching by distance is one of the simplest ways to make a placement last.']),
        say(['Tell us your sector, society or nearest landmark when you get in touch.', 'Share your area when you message us so we can shortlist cooks with the shortest commute.']),
      ];
  localParas.push(say([`For live-in staff we also recommend police verification through ${police}.`, `Live-in staff can be verified through ${police}, an easy extra layer of security.`]));
  S.push({ id: 'local', h2: one([`Hiring a ${who} in ${placeShort}: local tips`, `${cap(who)} in ${placeShort}: local guide`, `Local advice for ${placeShort}`]), paras: localParas });

  // 10. Why HireCook (always last)
  S.push({
    id: 'why-hirecook',
    h2: one([`Why choose HireCook.pk for ${kwl}`, `Why ${clients} trust HireCook.pk`, `How HireCook.pk helps`]),
    paras: [
      say([
        `HireCook.pk is a registered cook agency (SECP, FBR NTN, Labour Department, PESSI) based at Chandni Chowk, Rawalpindi. Every candidate is screened, every placement starts with a trial cook, and every arrangement comes with written terms and replacement support within the agreed period.`,
        `We are a registered agency based at Chandni Chowk, Rawalpindi, registered with SECP, FBR, the Labour Department and PESSI. Our process is simple: screen carefully, trial first, write the terms down, and stay in touch after placement.`,
      ]),
      `${p.outside ? `In ${cityName} we currently specialise in male cooks for homes.` : say([`In ${cityName} we cover every type of cook, from home cooks to chefs and event teams.`, `Across ${cityName} we place home cooks, male cooks, chefs and commercial kitchen staff.`])} ${say(['Message us on WhatsApp or use the form on this page. It takes two minutes.', 'Send a WhatsApp or fill in the form; our team will call you back with suitable profiles.'])}`,
    ],
  });

  // ---------- Extra FAQs ----------
  const faqPool = [
    { q: `How long does it take to find a ${who} in ${placeShort}?`, a: `Most ${clients} receive suitable profiles within 24–48 hours. After an interview and trial cook, the ${who} can usually start the same week.` },
    { q: `Can I interview more than one ${who}?`, a: `Yes. We normally share two or three profiles so you can compare experience, dishes and timings before choosing one for a trial.` },
    { q: `Will the ${who} do grocery shopping?`, a: `If you want. Many cooks plan the weekly menu and buy groceries with a set amount and receipts. Agree this in writing.` },
    { q: `What documents should a ${who} provide?`, a: `A CNIC copy, two employer references and a family contact number. For live-in staff we also recommend police verification through ${police}.` },
    { q: `Can a ${who} cook for guests and dawats?`, a: `Yes. Experienced cooks regularly handle dawats. Share the guest count and menu in advance so ingredients and helpers can be planned.` },
    { q: `Does the ${who} clean the kitchen?`, a: `Kitchen cleaning after cooking is normally included. General house cleaning is a separate role. Agree duties upfront.` },
    { q: `Can I hire a ${who} for a trial week?`, a: `Yes. Many ${clients} start with a short probation period after the trial cook, then confirm the arrangement.` },
    { q: `What if the ${who} takes leave?`, a: `Agree leave in advance. For longer absences, HireCook.pk can help arrange a temporary cook.` },
  ];
  return { takeaways, sections: S, faqs: some(faqPool, 5) };
}
