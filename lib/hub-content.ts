import { entries, groups, buildPage, titleCase, type Entry } from './content';
import { cities, cityBy, cityAreas } from './cities';
import { areasOf } from './areas';
import type { Article, Section } from './longform';

// Long-form content for the home page, category hubs and the services / cities directories.

function hash(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
  return h;
}
const pick = <T,>(a: readonly T[], seed: string) => a[hash(seed) % a.length];
const join = (a: string[]) => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);

/** Two-to-three sentence summary of one keyword page, used on hubs and directories. */
export function serviceSummary(e: Entry) {
  const p = buildPage(e);
  const d = p.dishes.slice(0, 3).map((x) => x.toLowerCase());
  const lead = pick([
    `${p.H1} connects you with screened ${p.whoPlural} skilled in ${p.role.skill}.`,
    `Choose ${p.H1.toLowerCase()} when you need ${p.whoPlural} who handle ${p.role.skill}.`,
    `${p.H1}: experienced ${p.whoPlural} for ${p.role.skill}.`,
  ], e.slug + 'a');
  const mid = p.isArea
    ? `We match cooks living in or near ${p.area!.name} (${join(p.area!.nearby.slice(0, 2))}) for a short daily commute.`
    : p.sched
      ? `${p.sched.label} arrangements are agreed in writing, with clear duties, timings and a weekly off.`
      : `Typical dishes include ${join(d)}.`;
  const end = p.outside ? `In ${p.city}, HireCook.pk currently provides male cooks only.` : pick(['Every placement starts with a trial cook in your own kitchen.', 'Profiles are usually shared within 24–48 hours.', 'Candidates are CNIC- and reference-checked before you meet them.'], e.slug + 'b');
  return `${lead} ${mid} ${end}`;
}

type GroupCopy = { why: string[]; choose: { t: string; d: string }[]; tips: string[]; faqs: { q: string; a: string }[] };

// Hand-written guidance for the seven service categories.
const groupCopy: Record<string, GroupCopy> = {
  'cook-hiring': {
    why: [
      'Most people who search for a cook in Islamabad want the same thing: someone reliable who cooks the food their family already loves, turns up on time and can be trusted inside the home. The challenge is that every household is different. A couple in an F-10 apartment needs something very different from a joint family in G-9 or a large house in E-7 that hosts guests every weekend.',
      'This category brings together every way to hire a cook in Islamabad: home cooks, male cooks, domestic and family cooks, professional and personal cooks, chefs for the home, agencies and providers, and cooks near you. Each page focuses on one search intent, so you can read exactly what applies to your situation, from urgent "cook required" requests to long-term family placements.',
    ],
    choose: [
      { t: 'Home cook', d: 'Best for families who want fresh daily desi meals: breakfast, lunch, dinner and roti, plus kitchen upkeep.' },
      { t: 'Male cook', d: 'Preferred by many households for heavy cooking, large degs, BBQ, tandoor work and live-in roles.' },
      { t: 'Domestic or family cook', d: 'A long-term member of the household team who learns your family’s tastes and routines.' },
      { t: 'Professional or personal cook', d: 'For homes that want a higher standard: plated meals, varied cuisines and confident entertaining.' },
      { t: 'Chef for home / private chef', d: 'Restaurant-trained cooking at home for families who entertain often or want continental and Chinese menus.' },
      { t: 'Cook agency or provider', d: 'When you want screening, a shortlist, a trial and written terms handled for you rather than searching alone.' },
    ],
    tips: [
      'Write down your ten most-cooked dishes before you speak to anyone. It is the fastest way to judge whether a cook is a good fit.',
      'Decide early whether you need full-time, part-time, live-in or live-out help; it changes who is available.',
      'Always take a trial cook in your own kitchen, with your own utensils and ingredients.',
      'Agree duties, timings, weekly off and notice in writing on day one.',
    ],
    faqs: [
      { q: 'What is the difference between a home cook and a private chef?', a: 'A home cook focuses on everyday family meals such as daal, salan, rice and roti. A private chef usually has restaurant training and adds plated continental, Chinese or fusion dishes and confident entertaining.' },
      { q: 'How quickly can I hire a cook in Islamabad?', a: 'Most families receive suitable profiles within 24–48 hours. After an interview and a trial cook, the cook can usually start the same week.' },
      { q: 'Is it better to hire through an agency?', a: 'An agency saves time and adds safeguards: CNIC and reference checks, a shortlist, a trial cook, written terms and replacement support within the agreed period.' },
      { q: 'Can I find a cook near me?', a: 'Yes. Share your sector or society and we prioritise cooks who live nearby, which improves punctuality.' },
    ],
  },
  'male-cooks': {
    why: [
      'Male cooks are the backbone of home kitchens across Pakistan. Many trained in restaurants, hostels, messes or large households before moving into family homes, so they bring speed, stamina and a deep repertoire of desi dishes. Families in Islamabad often choose a male cook for heavy daily cooking, large dawats, tandoor and BBQ work, early grocery runs and live-in arrangements.',
      'This category covers every kind of male cook: home and family cooks, experienced and professional cooks, full-time, part-time, live-in and live-out cooks, desi and Pakistani food specialists, cooks for daily meals, cooks with accommodation, and verified or trained candidates. Each page explains what to expect and how to hire with confidence.',
    ],
    choose: [
      { t: 'Experienced or professional male cook', d: 'For families who want years of proven experience and a wide repertoire of desi and continental dishes.' },
      { t: 'Full-time male cook', d: 'Eight to ten hours a day, six days a week, covering all meals and kitchen upkeep.' },
      { t: 'Part-time male cook', d: 'A two to five hour daily visit for lunch and dinner, ideal for smaller households.' },
      { t: 'Live-in male cook', d: 'Stays on site with a room and meals, within agreed duty hours and a weekly off.' },
      { t: 'Desi or Pakistani food male cook', d: 'Specialists in karahi, qorma, biryani, nihari, haleem and fresh roti.' },
      { t: 'Verified or trained male cook', d: 'Ask about CNIC, references, training and practical assessment details for the specific candidate.' },
    ],
    tips: [
      'Mention any preference for age range, language (Urdu, Punjabi, Pashto or Sindhi) or experience level.',
      'For live-in roles, describe the room, meals and rest hours clearly before the interview.',
      'Ask the cook to make your family’s favourite dish during the trial, not just a dish of their choice.',
      'Recommend police verification for live-in staff in addition to agency checks.',
    ],
    faqs: [
      { q: 'Why do families prefer male cooks?', a: 'Male cooks are often preferred for heavy cooking, large degs, tandoor and BBQ work, early grocery runs and live-in roles. Many have restaurant or large-household experience.' },
      { q: 'Can a male cook live in our home?', a: 'Yes. Live-in male cooks stay with a private room and meals, working agreed duty hours with a weekly day off.' },
      { q: 'Are your male cooks verified?', a: 'We collect CNIC details and previous-employer references before introducing a cook, and you take a trial cook before hiring.' },
      { q: 'Do you provide male cooks outside Islamabad?', a: 'Yes. Besides Islamabad and Rawalpindi, we provide male cooks in Karachi, Lahore, Faisalabad, Gujranwala, Peshawar, Multan, Hyderabad and Quetta.' },
    ],
  },
  'cook-schedules': {
    why: [
      'The right schedule matters as much as the right cook. A full-time cook suits a large family that wants every meal handled; a part-time cook suits a working couple who mainly need lunch and dinner; a live-in cook suits homes with early starts, late dinners and frequent guests. Choosing the wrong arrangement is one of the most common reasons placements end early.',
      'This category explains every working pattern families in Islamabad ask for: full-time, monthly and permanent cooks, live-in, residential and 24-hour cooks, live-out cooks, full-day cooks, part-time and hourly cooks, cooks for a few hours, morning, evening and weekend cooks, and cooks on a daily basis.',
    ],
    choose: [
      { t: 'Full-time / permanent / monthly', d: 'Eight to ten hours a day, six days a week, for all meals, groceries and kitchen upkeep.' },
      { t: 'Live-in / residential / 24-hour', d: 'Stays on site with accommodation and meals. “24-hour” means available on site, not working non-stop.' },
      { t: 'Live-out / full-day', d: 'Arrives in the morning and leaves in the evening, with no accommodation needed.' },
      { t: 'Part-time / few hours / hourly', d: 'A short daily or weekly visit for specific meals or batch cooking.' },
      { t: 'Morning or evening', d: 'Breakfast and lunch in the morning, or tea and a fresh dinner in the evening.' },
      { t: 'Weekend', d: 'Covers Saturday and Sunday brunch, family lunches, BBQ nights and weekly meal prep.' },
    ],
    tips: [
      'Count the meals you really need cooked each day before choosing a schedule.',
      'For part-time cooks, agree a fixed visit window so meals are ready on time.',
      'For live-in cooks, agree rest hours and a weekly day off in writing.',
      'Review the schedule after the first month and adjust if your routine has changed.',
    ],
    faqs: [
      { q: 'Should I hire a full-time or part-time cook?', a: 'Full-time suits larger families who want all meals and groceries handled. Part-time (2–5 hours) suits couples and small families who mainly need lunch and dinner.' },
      { q: 'What does a 24-hour cook mean?', a: 'A 24-hour or residential cook lives on site and is available, but works agreed duty hours with breaks and a weekly day off.' },
      { q: 'Can I hire a cook only for weekends?', a: 'Yes. Weekend cooks cover brunch, family lunches, BBQ nights and weekly meal prep.' },
      { q: 'Can the schedule change later?', a: 'Yes, by mutual agreement. Discuss changes openly and update the written terms.' },
    ],
  },
  'chefs-and-cuisines': {
    why: [
      'Every family has a cuisine it cannot live without. For some it is a perfect chicken karahi or Sunday biryani; for others it is Chinese on Friday nights, continental steaks for guests, fresh bread and pastries, or a carefully balanced diet plan. This category helps you hire a cook or chef who already excels at the food you want.',
      'It covers private, personal, home and executive chefs; desi and Pakistani food cooks; continental and Chinese chefs; BBQ, tandoor and roti specialists; biryani and karahi cooks; fast food, pizza, bakery and pastry chefs; diet food and meal prep chefs; and chefs for parties, weddings, restaurants, hotels, offices and guest houses.',
    ],
    choose: [
      { t: 'Private, personal or home chef', d: 'Restaurant-quality cooking and plating at home, with personalised weekly menus.' },
      { t: 'Desi and Pakistani food cook', d: 'Authentic salan, karahi, qorma, nihari, haleem, biryani and fresh roti.' },
      { t: 'BBQ, tandoor and roti specialists', d: 'Charcoal grills, seekh kebab, tikka, naan, kulcha and roti in volume.' },
      { t: 'Chinese and continental chefs', d: 'Wok cooking, Manchurian and chow mein, steaks, pasta and classic sauces.' },
      { t: 'Bakery, pastry and pizza chefs', d: 'Breads, cakes, pastries and pizza, with precise recipes and oven control.' },
      { t: 'Diet food and meal prep chefs', d: 'Low-oil, low-carb and high-protein meals, portioned and labelled for the week.' },
    ],
    tips: [
      'Share photos or names of the exact dishes you love; cuisine labels mean different things to different cooks.',
      'Check equipment: tandoors, ovens and grills need space, ventilation and safe gas or charcoal setups.',
      'For diet cooking, share your nutritionist’s plan in writing.',
      'Ask specialists to cook one signature dish and one everyday dish during the trial.',
    ],
    faqs: [
      { q: 'Can one cook make both desi and Chinese food?', a: 'Many experienced cooks handle Pakistani-Chinese favourites alongside desi dishes. For authentic continental or Asian cooking, a specialist chef is better.' },
      { q: 'Do I need special equipment for a tandoor or pizza chef?', a: 'Yes. A tandoor, deck or wood-fired oven needs safe placement and ventilation. Discuss equipment before hiring.' },
      { q: 'Can a chef follow a medical diet?', a: 'Yes. Diet food and meal prep chefs follow written plans from your doctor or nutritionist, with weighed portions.' },
      { q: 'Do you provide chefs outside Islamabad and Rawalpindi?', a: 'Chefs and cuisine specialists are currently available in Islamabad and Rawalpindi. In other cities we provide male cooks.' },
    ],
  },
  'islamabad-areas': {
    why: [
      'Islamabad is a planned city of sectors and housing societies, and the best cook for you is usually one who lives nearby. A short commute means punctual mornings, fewer missed days and a placement that lasts. That is why HireCook.pk matches cooks by sector: F-6 to F-11, E-7 and E-11, G-6 to G-14 and I-8 to I-11, plus societies such as Bahria Town, Bahria Enclave, DHA, Gulberg Greens, Gulberg Residencia, Park View City, PWD, Pakistan Town, Korang Town, Soan Garden and Naval Anchorage, and areas such as Bani Gala, Chak Shahzad, Park Road and Bhara Kahu.',
      'Each area page explains the type of homes in that neighbourhood, nearby landmarks and adjoining areas, so you can see how we match cooks locally.',
    ],
    choose: [
      { t: 'F and E sectors', d: 'Central, established sectors with large family homes, diplomatic residences and frequent entertaining.' },
      { t: 'G and I sectors', d: 'Busy family sectors with markaz markets, joint families and working professionals.' },
      { t: 'Housing societies', d: 'Bahria, DHA, Gulberg and other gated communities with modern homes and villas.' },
      { t: 'Farmhouses and outskirts', d: 'Bani Gala, Chak Shahzad and Park Road, where live-in cooks with accommodation are common.' },
    ],
    tips: [
      'Share your street or a landmark so we can shortlist cooks with the shortest commute.',
      'For farmhouses and outskirts, consider a live-in cook or discuss transport.',
      'Mention gate or security procedures in gated societies so the cook can arrange entry passes.',
      'Ask candidates which route they will take and how long it takes at rush hour.',
    ],
    faqs: [
      { q: 'Which Islamabad sectors do you cover?', a: 'All of them, including F-6 to F-11, E-7, E-11, G-6 to G-14 and I-8 to I-11, plus Bahria, DHA, Gulberg and other societies.' },
      { q: 'Can you find a cook who lives near my sector?', a: 'Yes. We prioritise candidates living in or near your sector for punctuality.' },
      { q: 'Do you cover Bani Gala and farmhouses?', a: 'Yes. Live-in cooks with accommodation are common in Bani Gala, Chak Shahzad and Park Road.' },
      { q: 'Do cooks need passes for gated societies?', a: 'Some societies require entry passes for staff. Tell us your society rules and the cook will arrange them.' },
    ],
  },
  'rawalpindi-areas': {
    why: [
      'Rawalpindi combines historic neighbourhoods, cantonment areas and some of the largest housing societies in the country. Families in Saddar, Satellite Town and Westridge often want traditional desi cooking for joint families, while homes in Bahria Town phases, DHA and the Askari societies often look for full-time and live-in cooks.',
      'HireCook.pk is based at Chandni Chowk, Rawalpindi, so the city is home ground for us. Area pages cover Saddar, Satellite Town, Commercial Market, Scheme 3, the Chaklala schemes, Bahria Town Phases 1 to 8, DHA Phases 1 and 2, Askari 7, 10, 11 and 14, Westridge, Peshawar Road, Adiala Road, Gulraiz, Media Town, Airport Housing Society, Gulshan Abad, Lalazar and Morgah.',
    ],
    choose: [
      { t: 'Historic and central areas', d: 'Saddar, Satellite Town and Commercial Market, with joint families and traditional cooking.' },
      { t: 'Cantonment areas', d: 'Chaklala schemes, Lalazar and Westridge, with spacious homes and disciplined routines.' },
      { t: 'Bahria Town and DHA', d: 'Large gated communities with villas, apartments and demand for live-in cooks.' },
      { t: 'Askari societies', d: 'Secure communities where reliable daily cooks are in steady demand.' },
    ],
    tips: [
      'Mention your Bahria phase or Askari number; distances inside large societies can be long.',
      'For cantonment areas, check entry procedures for staff.',
      'Joint families should share the number of people and any separate diets upfront.',
      'Ask for a cook who knows the local markets for fresh meat and vegetables.',
    ],
    faqs: [
      { q: 'Do you cover all Bahria Town phases in Rawalpindi?', a: 'Yes, Phases 1 to 8, along with DHA, Askari societies and central Rawalpindi.' },
      { q: 'Where is HireCook.pk based?', a: 'Our office is at Chandni Chowk, Murree Road, Rawalpindi.' },
      { q: 'Can I hire a cook for a joint family?', a: 'Yes. Share the number of people and any special diets, and we match cooks experienced with large households.' },
      { q: 'Do you provide event cooks in Rawalpindi?', a: 'Yes. All services, including chefs, restaurant, office and event cooks, are available in Rawalpindi and Islamabad.' },
    ],
  },
  'commercial-and-events': {
    why: [
      'Businesses and events need cooks who can deliver at scale, on time and to a consistent standard. A restaurant needs speed during rush hours and tight food costs; an office canteen needs balanced daily meals on budget; a wedding or dawat needs large-batch deg cooking, live stations and careful timing.',
      'This category covers restaurant cooks and chefs, restaurant and commercial kitchen staff, hotel chefs and hotel cook providers, BBQ and tandoor cooks, catering, wedding, event and party chefs, cooks for birthdays, family gatherings and dawats, and office, canteen, mess, hostel and guest house cooks across Islamabad and Rawalpindi.',
    ],
    choose: [
      { t: 'Restaurant and hotel chefs', d: 'Line cooks, station chefs and senior chefs for restaurants, cafés and hotels.' },
      { t: 'Commercial kitchen staff', d: 'Prep cooks and helpers for busy kitchens, with hygiene and stock discipline.' },
      { t: 'Catering, wedding and event chefs', d: 'Large-batch deg cooking, buffets and live BBQ, tandoor and pasta stations.' },
      { t: 'Party and dawat cooks', d: 'Home-based cooks for birthdays, family gatherings and traditional dawats.' },
      { t: 'Office, canteen and mess cooks', d: 'Daily staff meals on a rotating menu and fixed budget.' },
      { t: 'Hostel and guest house cooks', d: 'Breakfast service and on-order meals for residents and guests.' },
    ],
    tips: [
      'Share covers, peak hours and kitchen stations for restaurant roles.',
      'For events, confirm guest count, menu and serving time at least a few days ahead.',
      'Offer a paid trial shift for commercial roles.',
      'Agree food-safety standards and stock rotation rules in writing.',
    ],
    faqs: [
      { q: 'How many guests can one event cook handle?', a: 'One experienced cook with a helper can usually manage 30–50 guests for a home dawat. For 100 or more guests, plan a head cook with two or three helpers.' },
      { q: 'Can you provide a trial shift for a restaurant chef?', a: 'Yes. A paid trial shift is the best way to check speed, consistency and hygiene.' },
      { q: 'Do you provide canteen and mess cooks?', a: 'Yes, for offices, factories, hostels and guest houses in Islamabad and Rawalpindi.' },
      { q: 'Are commercial and event services available outside Islamabad and Rawalpindi?', a: 'Not yet. In other cities we currently provide male cooks for homes.' },
    ],
  },
};

function cityGroupCopy(cityName: string): GroupCopy {
  const c = cityBy(cityName)!;
  const list = cityAreas[cityName] || [];
  const names = list.map((a) => a[0]);
  const kinds = [...new Set(list.map((a) => a[1]))];
  return {
    why: [
      `${c.blurb} Families across ${cityName} are busier than ever, and a dependable male cook is one of the most valuable people a household can hire. HireCook.pk now places experienced male cooks in ${cityName}, matching each family with candidates who already cook the dishes they love and who live close enough to arrive on time.`,
      `Our ${cityName} service covers ${names.length} areas, including ${join(names.slice(0, 8))} and more. In ${cityName} we currently provide male cooks only: home cooks, full-time cooks, part-time cooks and live-in cooks. Chefs, restaurant, office and event staff are available in Islamabad and Rawalpindi.`,
    ],
    choose: [
      { t: `Male home cook in ${cityName}`, d: 'Fresh daily meals, roti and kitchen upkeep for families of every size.' },
      { t: 'Full-time male cook', d: 'Eight to ten hours a day, six days a week, covering all meals and groceries.' },
      { t: 'Part-time male cook', d: 'A two to five hour visit for lunch and dinner, ideal for smaller homes.' },
      { t: 'Live-in male cook', d: 'Stays on site with a room and meals, working agreed duty hours.' },
      { t: 'Male cook for home', d: 'A long-term cook who learns your family’s tastes and routines.' },
      { t: 'Male cook agency service', d: 'Screening, shortlist, trial cook and written terms handled for you.' },
    ],
    tips: [
      `Mention your area in ${cityName} (for example ${names[0]} or ${names[1]}) so we can match a cook nearby.`,
      `For live-in roles, describe the room, meals and rest hours before the interview.`,
      `We recommend police verification for live-in staff through ${c.police}.`,
      `Neighbourhood types we cover in ${cityName} include ${join(kinds.slice(0, 4))}.`,
    ],
    faqs: [
      { q: `Do you provide male cooks in ${cityName}?`, a: `Yes. HireCook.pk provides male home cooks in ${cityName}: full-time, part-time and live-in.` },
      { q: `Which areas of ${cityName} do you cover?`, a: `We cover ${join(names.slice(0, 12))} and more areas across ${cityName}.` },
      { q: `Can I hire a chef or event cook in ${cityName}?`, a: `Not yet. In ${cityName} we currently provide male cooks for homes. Chefs and event staff are available in Islamabad and Rawalpindi.` },
      { q: `How quickly can a male cook start in ${cityName}?`, a: 'Most families receive suitable profiles within 24–48 hours, and the cook can usually start the same week after a trial.' },
    ],
  };
}

/** Category hub article: guide, how to choose, every service summarised, tips and FAQs. */
export function groupArticle(slug: string): Article {
  const g = groups.find((x) => x.slug === slug)!;
  const city = cities.find((c) => c.slug === slug && !c.full);
  const copy = city ? cityGroupCopy(city.name) : groupCopy[slug];
  const list = entries.filter((e) => e.group === g.name);
  const sections: Section[] = [
    { id: 'overview', h2: `${g.title}: an overview`, paras: copy.why },
    { id: 'choose', h2: city ? `Male cook options in ${city.name}` : 'Which option is right for you?', paras: ['A quick comparison to help you decide:'], list: copy.choose },
    {
      id: 'services',
      h2: `Every service in ${g.title.replace(/^Cook Services by |^Cook Services in /, '')}`,
      paras: [`Below is a short description of each of the ${list.length} pages in this category. Open any of them for the full guide, FAQs and hire form.`],
      list: list.map((e) => ({ t: titleCase(e.keyword), d: serviceSummary(e) })),
    },
    { id: 'how', h2: 'How hiring works', paras: ['The process is the same for every service in this category:'], list: [
      { t: 'Share your needs', d: 'Area, cuisine, timings and family size or headcount, by WhatsApp, phone or the online form.' },
      { t: 'Get a shortlist', d: 'Screened candidates, usually within 24–48 hours.' },
      { t: 'Interview and trial cook', d: 'Meet the cook and taste their food in your own kitchen.' },
      { t: 'Hire with written terms', d: 'Duties, timings, weekly off, leave and notice period agreed in writing.' },
    ], ordered: true },
    { id: 'tips', h2: 'Expert tips before you hire', paras: ['Advice from our placement team:'], list: copy.tips.map((d) => ({ d })) },
    { id: 'trust', h2: 'Why HireCook.pk', paras: [
      'HireCook.pk is a registered cook agency based at Chandni Chowk, Rawalpindi, registered with SECP, FBR (NTN), the Labour Department and PESSI. Every candidate is CNIC- and reference-checked, every placement starts with a trial cook, and every arrangement is backed by written terms and replacement support within the agreed period.',
      city ? `In ${city.name} we currently specialise in male cooks for homes, and we are expanding our network area by area.` : 'In Islamabad and Rawalpindi we place every type of cook, from home and male cooks to private chefs, restaurant teams, office cooks and event chefs.',
    ] },
  ];
  return {
    takeaways: [
      `${g.title}: ${list.length} dedicated service pages${city ? ` across ${areasOf(city.name).length} areas of ${city.name}` : ''}.`,
      city ? `In ${city.name}, HireCook.pk currently provides male cooks only: home, full-time, part-time and live-in.` : g.intro,
      'Shortlist of screened candidates usually within 24–48 hours.',
      'Trial cook in your own kitchen before you decide, and written terms from day one.',
    ],
    sections,
    faqs: copy.faqs,
  };
}

/** Home page long-form guide. */
export function homeArticle(): Article {
  const outside = cities.filter((c) => !c.full).map((c) => c.name);
  return {
    takeaways: [
      'HireCook.pk is a registered cook hiring agency based at Chandni Chowk, Rawalpindi.',
      'Every cook service is available in Islamabad and Rawalpindi: home cooks, male cooks, private chefs, cuisine specialists, restaurant, office and event cooks.',
      `Male cooks are also available in ${join(outside)}.`,
      'Shortlist in 24–48 hours, trial cook before hiring, written terms from day one.',
    ],
    sections: [
      { id: 'hiring-guide', h2: 'How to hire a cook in Pakistan: a complete guide', paras: [
        'Hiring a cook is one of the most personal decisions a family makes. The right person improves your health, saves hours every day and makes hosting guests a pleasure. The wrong choice brings stress, waste and frequent changes. This guide explains how to get it right, whether you live in an Islamabad sector, a Rawalpindi housing society or one of the eight other cities where we place male cooks.',
        'The process is simple when broken into steps: decide what kind of cook you need, choose a schedule, list your favourite dishes, check experience and references, take a trial cook, and agree terms in writing. HireCook.pk handles the searching, screening and shortlisting so you can focus on choosing the right person.',
      ] },
      { id: 'types', h2: 'Types of cooks you can hire', paras: ['Every household and business is different. These are the main options:'], list: [
        { t: 'Home cook', d: 'Daily desi meals, roti and kitchen upkeep for families.' },
        { t: 'Male cook', d: 'Preferred for heavy cooking, dawats, BBQ and live-in roles.' },
        { t: 'Private or personal chef', d: 'Restaurant-quality cooking and plating at home.' },
        { t: 'Cuisine specialists', d: 'Desi, BBQ, tandoor, biryani, karahi, Chinese, continental, bakery, pastry, pizza, diet and meal prep.' },
        { t: 'Restaurant and hotel chefs', d: 'Line cooks and senior chefs for commercial kitchens.' },
        { t: 'Office, canteen and mess cooks', d: 'Daily staff meals on a rotating menu.' },
        { t: 'Event, wedding and dawat cooks', d: 'Large-batch cooking, buffets and live stations.' },
      ] },
      { id: 'schedules', h2: 'Choosing the right schedule', paras: [
        'A full-time cook works eight to ten hours a day, six days a week, and handles every meal, the groceries and the kitchen. A part-time cook visits for two to five hours, usually for lunch and dinner. A live-in cook stays on site with a room and meals, working agreed hours with a weekly day off, which suits homes with early starts and frequent guests. A live-out cook arrives in the morning and leaves in the evening.',
        'There are also morning, evening, weekend, hourly and daily-basis options. The best schedule depends on how many meals you need, how many people you cook for and how often you entertain. If you are unsure, tell us your routine and we will suggest an arrangement.',
      ] },
      { id: 'checks', h2: 'What to check before hiring', paras: ['Whoever you hire, these checks protect your family:'], list: [
        { t: 'Identity and references', d: 'A CNIC copy and two previous-employer references.' },
        { t: 'Relevant experience', d: 'Experience with the dishes and the kind of household you have.' },
        { t: 'Trial cook', d: 'Two or three of your everyday dishes, cooked in your kitchen.' },
        { t: 'Hygiene', d: 'Hand-washing, separate boards for raw meat and a clean workspace.' },
        { t: 'Written terms', d: 'Duties, timings, weekly off, leave and notice period.' },
        { t: 'Police verification', d: 'Recommended for live-in staff, through ICT Police, Punjab Police, Sindh Police, KP Police or Balochistan Police.' },
      ] },
      { id: 'cities', h2: 'Where we place cooks', paras: [
        'Islamabad and Rawalpindi are our home base, with every service available across 66 sectors, societies and neighbourhoods, from F-6, F-7, F-10, G-11, E-7 and I-8 to Bahria Town, DHA, Gulberg Greens, Saddar, Satellite Town, the Chaklala schemes and the Askari societies.',
        `Outside the twin cities we currently provide male cooks for homes in ${join(outside)}, covering well-known areas such as Clifton, DHA and Gulshan-e-Iqbal in Karachi; Gulberg, Model Town and Johar Town in Lahore; Hayatabad in Peshawar; Gulgasht in Multan; Latifabad and Qasimabad in Hyderabad; and Jinnah Town in Quetta.`,
      ] },
      { id: 'agency', h2: 'Why use a cook agency?', paras: [
        'Searching alone means scrolling through classifieds, unverified numbers and candidates who may not suit your home. An agency does the hard part: sourcing candidates, checking identity and references, shortlisting by skills and distance, arranging a trial cook and putting the terms in writing. If a placement does not work out, the agency helps you find a replacement within the agreed period.',
        'HireCook.pk is registered with SECP, FBR (NTN), the Labour Department and PESSI, and our office is at Chandni Chowk, Murree Road, Rawalpindi. You can reach us by phone or WhatsApp, or send a request through the form on any page of this website.',
      ] },
    ],
    faqs: [],
  };
}

/** Services directory guide. */
export function servicesArticle(): Article {
  return {
    takeaways: [
      `${entries.length} service pages across ${groups.length} categories and 10 cities.`,
      'Use the search box to find a cook type, cuisine, schedule or area instantly.',
      'Every page includes a quick answer, a hiring guide, FAQs and a hire form.',
    ],
    sections: [
      { id: 'about-directory', h2: 'How to use this directory', paras: [
        'This page lists every cook and chef service on HireCook.pk. Each one has its own page explaining what the cook does, the dishes they make, the working arrangement, local details for your area and answers to common questions. Search by cook type (home cook, male cook, private chef), by cuisine (desi, BBQ, Chinese, continental), by schedule (full-time, part-time, live-in) or by area (F-10, Bahria Town Phase 7, Clifton, Johar Town).',
      ] },
      { id: 'categories', h2: 'Categories at a glance', paras: ['Each category groups related services:'], list: groups.map((g) => ({ t: g.title, d: `${g.intro} (${entries.filter((e) => e.group === g.name).length} pages)` })) },
      { id: 'scope', h2: 'Service availability by city', paras: [
        'In Islamabad and Rawalpindi every service on this list is available, including chefs, restaurant teams, office cooks and event chefs. In Karachi, Lahore, Faisalabad, Gujranwala, Peshawar, Multan, Hyderabad and Quetta we currently provide male cooks for homes: home, full-time, part-time and live-in.',
      ] },
    ],
    faqs: [],
  };
}

/** Cities page guide. */
export function citiesArticle(): Article {
  return {
    takeaways: [
      'All cook services in Islamabad and Rawalpindi.',
      'Male cooks in Karachi, Lahore, Faisalabad, Gujranwala, Peshawar, Multan, Hyderabad and Quetta.',
      'Cooks matched by distance for punctuality, with CNIC and reference checks and a trial cook.',
    ],
    sections: cities.map((c) => {
      const names = areasOf(c.name).map((a) => a.name);
      return {
        id: c.slug,
        h2: `${c.full ? 'Cooks' : 'Male cooks'} in ${c.name}`,
        paras: [
          `${c.blurb} ${c.full ? `Every HireCook.pk service is available in ${c.name}: home cooks, male cooks, private chefs, cuisine specialists, and restaurant, office and event cooks.` : `In ${c.name} we currently provide male cooks for homes: home, full-time, part-time and live-in.`}`,
          `Areas covered include ${join(names.slice(0, 14))}${names.length > 14 ? ' and more' : ''}. For live-in staff we recommend police verification through ${c.police}.`,
        ],
      } as Section;
    }),
    faqs: [
      { q: 'Which cities does HireCook.pk serve?', a: 'Islamabad and Rawalpindi for all services, plus male cooks in Karachi, Lahore, Faisalabad, Gujranwala, Peshawar, Multan, Hyderabad and Quetta.' },
      { q: 'Why only male cooks outside Islamabad and Rawalpindi?', a: 'We are expanding city by city, starting with the service families ask for most: experienced male cooks for homes.' },
      { q: 'Will more services come to my city?', a: 'We add services as our local network grows. Send a request on WhatsApp and we will tell you what is available in your area.' },
      { q: 'Can I hire a cook for a home in another city while I live elsewhere?', a: 'Yes. Many clients hire for parents or relatives. We coordinate the interview and trial with the family member at home.' },
    ],
  };
}
