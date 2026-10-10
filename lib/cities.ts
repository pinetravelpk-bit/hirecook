import type { PhotoKey } from './images';

// Cities served. Islamabad & Rawalpindi get every service; all other cities: male cooks only (for now).
export type City = {
  name: string;
  slug: string;
  province: string;
  photo: PhotoKey;
  lat: number;
  lng: number;
  full: boolean; // full service range (chefs, events, commercial) vs male cooks only
  blurb: string;
  police: string;
};

export const cities: City[] = [
  { name: 'Islamabad', slug: 'islamabad-areas', province: 'Islamabad Capital Territory', photo: 'islamabad', lat: 33.6844, lng: 73.0479, full: true, blurb: 'Pakistan’s planned capital, with sectors from E-7 to I-11 and societies such as Bahria, DHA and Gulberg.', police: 'Islamabad Police (ICT) online verification' },
  { name: 'Rawalpindi', slug: 'rawalpindi-areas', province: 'Punjab', photo: 'rawalpindi', lat: 33.5651, lng: 73.0169, full: true, blurb: 'Islamabad’s twin city, from historic Saddar to the Chaklala schemes, Bahria Town phases and DHA.', police: 'Punjab Police Khidmat Markaz' },
  { name: 'Karachi', slug: 'male-cooks-karachi', province: 'Sindh', photo: 'karachi', lat: 24.8607, lng: 67.0011, full: false, blurb: 'Pakistan’s largest city, with busy family neighbourhoods from Clifton and DHA to Gulshan-e-Iqbal and North Nazimabad.', police: 'Sindh Police verification' },
  { name: 'Lahore', slug: 'male-cooks-lahore', province: 'Punjab', photo: 'lahore', lat: 31.5204, lng: 74.3587, full: false, blurb: 'The food capital of Pakistan, where families from DHA and Gulberg to Johar Town value great home cooking.', police: 'Punjab Police Khidmat Markaz' },
  { name: 'Faisalabad', slug: 'male-cooks-faisalabad', province: 'Punjab', photo: 'faisalabad', lat: 31.4504, lng: 73.135, full: false, blurb: 'Pakistan’s textile hub, with large joint-family homes in Peoples Colony, Madina Town and along Canal Road.', police: 'Punjab Police Khidmat Markaz' },
  { name: 'Gujranwala', slug: 'male-cooks-gujranwala', province: 'Punjab', photo: 'bbq-tray', lat: 32.1877, lng: 74.1945, full: false, blurb: 'A city famous for its food, where families in Satellite Town, Model Town and Citi Housing hire experienced male cooks.', police: 'Punjab Police Khidmat Markaz' },
  { name: 'Peshawar', slug: 'male-cooks-peshawar', province: 'Khyber Pakhtunkhwa', photo: 'peshawar', lat: 34.0151, lng: 71.5249, full: false, blurb: 'KP’s historic capital, known for hospitality and karahi, from Hayatabad and University Town to the Cantt.', police: 'KP Police verification' },
  { name: 'Multan', slug: 'male-cooks-multan', province: 'Punjab', photo: 'multan', lat: 30.1575, lng: 71.5249, full: false, blurb: 'The City of Saints in South Punjab, with family homes in Gulgasht, Bosan Road, DHA and the Cantt.', police: 'Punjab Police Khidmat Markaz' },
  { name: 'Hyderabad', slug: 'male-cooks-hyderabad', province: 'Sindh', photo: 'hyderabad', lat: 25.396, lng: 68.3578, full: false, blurb: 'Sindh’s second city, with established family neighbourhoods in Latifabad, Qasimabad and the Cantt.', police: 'Sindh Police verification' },
  { name: 'Quetta', slug: 'male-cooks-quetta', province: 'Balochistan', photo: 'quetta', lat: 30.1798, lng: 66.975, full: false, blurb: 'Balochistan’s capital in a mountain valley, famous for sajji and hospitality, from Jinnah Town to the Cantt.', police: 'Balochistan Police verification' },
];

export const cityNames = cities.map((c) => c.name);
export const cityBy = (name: string) => cities.find((c) => c.name === name);
export const isFullService = (name: string) => !!cityBy(name)?.full;
export const outsideCities = cities.filter((c) => !c.full);

// [name, kind, blurb, landmarks, nearby, typical homes]
type A = [string, string, string, string[], string[], string];

export const cityAreas: Record<string, A[]> = {
  Karachi: [
    ['Clifton', 'neighbourhood', 'Clifton is Karachi’s upscale seaside district of bungalows and apartments, where families hire experienced male cooks for daily meals and entertaining.', ['Sea View', 'Teen Talwar', 'Dolmen Mall Clifton'], ['DHA Defence', 'Bath Island', 'Saddar'], 'bungalows, sea-facing apartments and large family homes'],
    ['DHA Defence', 'housing society', 'DHA Defence Karachi spans eight phases of large homes and apartments, with steady demand for full-time and live-in male cooks.', ['Khayaban-e-Ittehad', 'Bukhari Commercial', 'Sea View'], ['Clifton', 'Korangi', 'Bath Island'], 'large bungalows, villas and apartment buildings'],
    ['Bath Island', 'neighbourhood', 'Bath Island is a small, central and affluent area beside Clifton, home to large family houses that hire senior male cooks.', ['Clifton Bridge', 'Zamzama (nearby)'], ['Clifton', 'DHA Defence', 'Saddar'], 'large family houses and diplomatic residences'],
    ['PECHS', 'housing society', 'PECHS around Tariq Road is a central, well-established society where families hire male cooks for traditional Karachi home food.', ['Tariq Road', 'Allama Iqbal Road', 'Nursery'], ['Tariq Road', 'Bahadurabad', 'Shahrah-e-Faisal'], 'family houses and portions'],
    ['Bahadurabad', 'neighbourhood', 'Bahadurabad is a lively family neighbourhood known for its food street, where male cooks are hired for daily desi meals.', ['Bahadurabad Chowrangi', 'Alamgir Road'], ['PECHS', 'Tariq Road', 'Gulshan-e-Iqbal'], 'family homes and apartments'],
    ['Tariq Road', 'neighbourhood', 'Tariq Road is Karachi’s famous shopping street, surrounded by family homes in PECHS that hire male cooks.', ['Tariq Road market', 'Dolmen Mall Tariq Road'], ['PECHS', 'Bahadurabad', 'Shahrah-e-Faisal'], 'family houses and apartments'],
    ['Gulshan-e-Iqbal', 'neighbourhood', 'Gulshan-e-Iqbal is one of Karachi’s largest residential towns, with many working families hiring part-time and full-time male cooks.', ['Maskan Chowrangi', 'Aziz Bhatti Park', 'University Road'], ['Gulistan-e-Jauhar', 'Bahadurabad', 'North Nazimabad'], 'apartments, family houses and joint families'],
    ['Gulistan-e-Jauhar', 'neighbourhood', 'Gulistan-e-Jauhar is a fast-growing area of apartments and houses near the airport, with steady demand for home cooks.', ['Johar Chowrangi', 'Rashid Minhas Road'], ['Gulshan-e-Iqbal', 'Malir Cantt', 'Shahrah-e-Faisal'], 'apartments and family houses'],
    ['North Nazimabad', 'neighbourhood', 'North Nazimabad is a planned, green residential area with large family houses where male cooks prepare daily meals.', ['Hyderi Market', 'Five Star Chowrangi'], ['Nazimabad', 'Federal B Area', 'Gulberg'], 'family houses and joint families'],
    ['Nazimabad', 'neighbourhood', 'Nazimabad is a historic central neighbourhood of family homes that prefer experienced male cooks for traditional food.', ['Nazimabad Chowrangi', 'Abbasi Shaheed Hospital'], ['North Nazimabad', 'Federal B Area', 'Gulberg'], 'family homes'],
    ['Federal B Area', 'neighbourhood', 'Federal B Area is a central, family-centred area with busy markets, where male home cooks are regularly hired.', ['Ayesha Manzil', 'Water Pump'], ['Gulberg', 'North Nazimabad', 'Gulshan-e-Iqbal'], 'family houses and apartments'],
    ['KDA Scheme 1', 'housing society', 'KDA Scheme 1 is an exclusive, leafy area off Shahrah-e-Faisal with large houses that hire live-in and senior male cooks.', ['Karsaz', 'Shahrah-e-Faisal'], ['Shahrah-e-Faisal', 'PECHS', 'Bahadurabad'], 'large family houses'],
    ['Shahrah-e-Faisal', 'road / neighbourhood', 'Shahrah-e-Faisal is Karachi’s main artery, lined with societies, offices and guest houses that hire male cooks.', ['Nursery', 'FTC', 'Karsaz'], ['PECHS', 'KDA Scheme 1', 'Gulistan-e-Jauhar'], 'family homes, guest houses and offices'],
    ['Malir Cantt', 'cantonment', 'Malir Cantt is a secure, green cantonment with family homes that hire disciplined, experienced male cooks.', ['Malir Cantt gate', 'Askari 5 (nearby)'], ['Askari 4', 'Gulistan-e-Jauhar', 'Scheme 33'], 'cantonment family homes'],
    ['Bahria Town', 'housing society', 'Bahria Town Karachi off the Superhighway is a large gated community of villas and apartments with growing demand for live-in male cooks.', ['Grand Jamia Mosque', 'Bahria Town Karachi gate'], ['Scheme 33', 'Malir Cantt', 'Gulistan-e-Jauhar'], 'villas, houses and apartments'],
    ['Scheme 33', 'neighbourhood', 'Scheme 33 along the Superhighway hosts many cooperative societies where families hire male cooks at practical rates.', ['Superhighway', 'Safoora Chowrangi'], ['Gulistan-e-Jauhar', 'Bahria Town', 'Malir Cantt'], 'family houses in cooperative societies'],
    ['Askari 4', 'housing society', 'Askari 4 on Rashid Minhas Road is a secure apartment community where families hire male cooks for daily meals.', ['Rashid Minhas Road', 'Askari 4 park'], ['Gulistan-e-Jauhar', 'Malir Cantt', 'Gulshan-e-Iqbal'], 'apartments'],
    ['Saddar', 'neighbourhood', 'Saddar is Karachi’s historic downtown, with older family homes, hostels and guest houses that hire male cooks.', ['Empress Market', 'Frere Hall (nearby)'], ['Clifton', 'Bath Island', 'PECHS'], 'family homes, hostels and guest houses'],
    ['Gulberg', 'neighbourhood', 'Gulberg Town in central Karachi is a dense residential area where families hire male cooks for home-style food.', ['Ayesha Manzil (nearby)', 'Gulberg Chowrangi'], ['Federal B Area', 'North Nazimabad', 'Nazimabad'], 'family houses and apartments'],
    ['Korangi', 'neighbourhood', 'Korangi is a large industrial and residential area where families, factories and staff messes hire male cooks.', ['Korangi Industrial Area', 'Korangi Road'], ['DHA Defence', 'Shahrah-e-Faisal', 'Malir Cantt'], 'family homes, factory messes and staff kitchens'],
  ],
  Lahore: [
    ['DHA Defence', 'housing society', 'DHA Lahore is the city’s largest premium community across many phases, with strong demand for full-time and live-in male cooks.', ['Y Block market', 'Packages Mall (nearby)', 'Ring Road'], ['Cantt', 'Askari 11', 'Paragon City'], 'large houses, villas and farmhouses'],
    ['Gulberg', 'neighbourhood', 'Gulberg is Lahore’s upscale central district of offices, restaurants and large homes that hire experienced male cooks.', ['MM Alam Road', 'Liberty Market', 'Main Boulevard'], ['Model Town', 'Shadman', 'Garden Town'], 'large family homes and apartments'],
    ['Model Town', 'neighbourhood', 'Model Town is a historic, green, planned neighbourhood of large houses where families hire male cooks for daily meals.', ['Model Town Park', 'Model Town Link Road'], ['Faisal Town', 'Garden Town', 'Johar Town'], 'large family houses'],
    ['Johar Town', 'neighbourhood', 'Johar Town is a busy, modern residential area near Emporium Mall with many working families hiring male cooks.', ['Emporium Mall', 'Expo Centre', 'Canal Road'], ['Wapda Town', 'Faisal Town', 'Valencia Town'], 'family houses, portions and apartments'],
    ['Bahria Town', 'housing society', 'Bahria Town Lahore off Raiwind Road is a large gated city of villas and apartments with demand for live-in male cooks.', ['Grand Jamia Mosque', 'Eiffel Tower replica'], ['Valencia Town', 'Wapda Town', 'Lake City'], 'villas, houses and apartments'],
    ['Garden Town', 'neighbourhood', 'Garden Town is an established central area of family houses where male cooks prepare traditional Lahori food.', ['Barkat Market', 'Kalma Chowk'], ['Model Town', 'Gulberg', 'Faisal Town'], 'family houses'],
    ['Faisal Town', 'neighbourhood', 'Faisal Town is a well-established family neighbourhood near Akbar Chowk where part-time and full-time male cooks are hired.', ['Akbar Chowk', 'Maulana Shaukat Ali Road'], ['Model Town', 'Johar Town', 'Garden Town'], 'family houses'],
    ['Cantt', 'cantonment', 'Lahore Cantt is a green, secure cantonment of large houses and messes that hire disciplined male cooks.', ['Fortress Stadium', 'Sarwar Road'], ['DHA Defence', 'Cavalry Ground', 'Askari 11'], 'cantonment homes and messes'],
    ['Wapda Town', 'housing society', 'Wapda Town is a large planned society with family homes that hire male cooks on a monthly basis.', ['Wapda Town roundabout', 'Canal Road (nearby)'], ['Johar Town', 'Valencia Town', 'Bahria Town'], 'family houses'],
    ['Valencia Town', 'housing society', 'Valencia Town is a gated community of family homes near Thokar Niaz Baig where male cooks are in demand.', ['Valencia main boulevard', 'Thokar Niaz Baig'], ['Wapda Town', 'Johar Town', 'Bahria Town'], 'family houses'],
    ['Allama Iqbal Town', 'neighbourhood', 'Allama Iqbal Town is a large, busy residential area with joint families hiring male cooks for everyday desi meals.', ['Moon Market', 'Karim Block'], ['Samanabad', 'Johar Town', 'Faisal Town'], 'family houses and joint families'],
    ['Township', 'neighbourhood', 'Township is a well-populated residential area in south Lahore where families hire part-time and full-time male cooks.', ['Township market', 'College Road'], ['Johar Town', 'Faisal Town', 'Model Town'], 'family houses'],
    ['Cavalry Ground', 'neighbourhood', 'Cavalry Ground is a secure, central neighbourhood beside the Cantt with family homes that hire male cooks.', ['Cavalry Ground market', 'Walton Road'], ['Cantt', 'Gulberg', 'DHA Defence'], 'family houses'],
    ['Shadman', 'neighbourhood', 'Shadman is a central, established area near Jail Road with family homes that value experienced male cooks.', ['Shadman Market', 'Jail Road'], ['Gulberg', 'Garden Town', 'Samanabad'], 'family houses and apartments'],
    ['Askari 11', 'housing society', 'Askari 11 on Bedian Road is a secure Askari community where families hire male cooks for home meals.', ['Bedian Road', 'Askari 11 commercial'], ['DHA Defence', 'Cantt', 'Paragon City'], 'family houses and apartments'],
    ['Lake City', 'housing society', 'Lake City on Raiwind Road is a premium gated community of villas where live-in male cooks are common.', ['Raiwind Road', 'Lake City golf course'], ['Bahria Town', 'Valencia Town', 'Wapda Town'], 'villas and large houses'],
    ['State Life Society', 'housing society', 'State Life Housing Society is a family community where male cooks are hired for daily cooking.', ['State Life main boulevard', 'Main Ferozepur Road (nearby)'], ['DHA Defence', 'Township', 'Model Town'], 'family houses'],
    ['EME Society', 'housing society', 'EME Society off Multan Road is a secure community of family homes that hire male cooks.', ['Multan Road', 'EME main gate'], ['Valencia Town', 'Wapda Town', 'Johar Town'], 'family houses'],
    ['Paragon City', 'housing society', 'Paragon City off Barki Road is a modern gated society where new homeowners hire male cooks.', ['Barki Road', 'Paragon main boulevard'], ['DHA Defence', 'Askari 11', 'Cantt'], 'new family houses'],
    ['Samanabad', 'neighbourhood', 'Samanabad is an established family area in central Lahore where male cooks prepare traditional home food.', ['Samanabad Morr', 'Multan Road (nearby)'], ['Allama Iqbal Town', 'Shadman', 'Garden Town'], 'family houses and joint families'],
  ],
  Faisalabad: [
    ['Peoples Colony', 'neighbourhood', 'Peoples Colony is one of Faisalabad’s most popular residential areas, with joint families hiring male cooks for daily meals.', ['D Ground (nearby)', 'Peoples Colony No. 1 & 2'], ['D Ground', 'Madina Town', 'Jinnah Colony'], 'family houses and joint families'],
    ['Madina Town', 'neighbourhood', 'Madina Town is a large, well-planned family area along Susan Road where male cooks are in steady demand.', ['Susan Road', 'Madina Town markets'], ['Susan Road', 'Peoples Colony', 'Gulberg'], 'family houses'],
    ['Susan Road', 'road / neighbourhood', 'Susan Road is a prime residential and commercial corridor with family homes that hire experienced male cooks.', ['Susan Road commercial', 'Madina Town'], ['Madina Town', 'Canal Road', 'Kohinoor City'], 'family houses'],
    ['Gulberg', 'neighbourhood', 'Gulberg Faisalabad is an established, central neighbourhood of family homes that hire male cooks.', ['Gulberg main road', 'Kotwali Road (nearby)'], ['Civil Lines', 'Madina Town', 'Peoples Colony'], 'family houses'],
    ['Batala Colony', 'neighbourhood', 'Batala Colony is a busy family neighbourhood where male cooks prepare everyday Punjabi food.', ['Batala Colony market', 'Satiana Road (nearby)'], ['Satiana Road', 'Peoples Colony', 'Jinnah Colony'], 'family houses'],
    ['Jinnah Colony', 'neighbourhood', 'Jinnah Colony is a central residential and business area where families and businesses hire male cooks.', ['Jinnah Colony market', 'Clock Tower (nearby)'], ['Civil Lines', 'Peoples Colony', 'Gulberg'], 'family houses and businesses'],
    ['Canal Road', 'road / neighbourhood', 'Canal Road is lined with upscale housing schemes and farmhouses where live-in male cooks are common.', ['Canal Road', 'Faisalabad Canal'], ['Wapda City', 'Eden Valley', 'Susan Road'], 'houses, villas and farmhouses'],
    ['D Ground', 'neighbourhood', 'D Ground in Peoples Colony is a bustling area with family homes and food outlets that hire male cooks.', ['D Ground market'], ['Peoples Colony', 'Batala Colony', 'Jinnah Colony'], 'family houses and food outlets'],
    ['Kohinoor City', 'neighbourhood', 'Kohinoor City near Jaranwala Road is a modern residential area where families hire male cooks.', ['Kohinoor One', 'Jaranwala Road'], ['Susan Road', 'Madina Town', 'Canal Road'], 'family houses and apartments'],
    ['Eden Valley', 'housing society', 'Eden Valley on Canal Road is a gated family community with demand for full-time male cooks.', ['Canal Road', 'Eden Valley gate'], ['Canal Road', 'Wapda City', 'Susan Road'], 'family houses'],
    ['Satiana Road', 'road / neighbourhood', 'Satiana Road has many housing colonies where families hire male cooks on a monthly basis.', ['Satiana Road', 'Abdullahpur (nearby)'], ['Batala Colony', 'Peoples Colony', 'Gulistan Colony'], 'family houses'],
    ['Sargodha Road', 'road / neighbourhood', 'Sargodha Road is a growing corridor of housing schemes and factories that hire male cooks for homes and staff.', ['Sargodha Road', 'University of Agriculture (nearby)'], ['Civil Lines', 'Gulistan Colony', 'Jinnah Colony'], 'family houses and staff kitchens'],
    ['Civil Lines', 'neighbourhood', 'Civil Lines is Faisalabad’s historic administrative area with large homes that hire senior male cooks.', ['Clock Tower', 'Faisalabad Club'], ['Gulberg', 'Jinnah Colony', 'Sargodha Road'], 'large family homes'],
    ['Gulistan Colony', 'neighbourhood', 'Gulistan Colony is a family neighbourhood where male cooks are hired for daily desi meals.', ['Gulistan Colony market'], ['Sargodha Road', 'Satiana Road', 'Civil Lines'], 'family houses'],
    ['Wapda City', 'housing society', 'Wapda City on Canal Road is a planned community where families hire full-time and live-in male cooks.', ['Canal Road', 'Wapda City gate'], ['Canal Road', 'Eden Valley', 'Kohinoor City'], 'family houses'],
  ],
  Gujranwala: [
    ['Satellite Town', 'neighbourhood', 'Satellite Town is Gujranwala’s best-known residential area, with large families hiring male cooks for its famous food culture.', ['Satellite Town markets', 'GT Road (nearby)'], ['Model Town', 'Peoples Colony', 'Civil Lines'], 'family houses and joint families'],
    ['Model Town', 'neighbourhood', 'Model Town is a planned, green neighbourhood with large homes that hire experienced male cooks.', ['Model Town park', 'GT Road'], ['Satellite Town', 'Garden Town', 'DC Colony'], 'large family houses'],
    ['Peoples Colony', 'neighbourhood', 'Peoples Colony is a busy family neighbourhood where male cooks prepare daily Punjabi meals.', ['Peoples Colony market'], ['Satellite Town', 'Gulshan Colony', 'Civil Lines'], 'family houses'],
    ['DC Colony', 'housing society', 'DC Colony is a premium gated community of villas where live-in and full-time male cooks are in demand.', ['DC Colony gate', 'GT Road'], ['Citi Housing', 'Model Town', 'Master City'], 'villas and large houses'],
    ['Citi Housing', 'housing society', 'Citi Housing is a modern gated society where new homeowners hire male cooks.', ['Citi Housing main boulevard'], ['DC Colony', 'Master City', 'Garden Town'], 'new family houses'],
    ['Wapda Town', 'housing society', 'Wapda Town is a planned family community where male cooks are hired on monthly basis.', ['Wapda Town main road'], ['Garden Town', 'Satellite Town', 'Gulshan Colony'], 'family houses'],
    ['Garden Town', 'neighbourhood', 'Garden Town is a family neighbourhood where male cooks are hired for daily home cooking.', ['Garden Town market'], ['Wapda Town', 'Model Town', 'Citi Housing'], 'family houses'],
    ['Gulshan Colony', 'neighbourhood', 'Gulshan Colony is a residential area with joint families who prefer experienced male cooks.', ['Gulshan Colony market'], ['Peoples Colony', 'Wapda Town', 'Satellite Town'], 'family houses'],
    ['Cantt', 'cantonment', 'Gujranwala Cantt (Rahwali) is a secure cantonment area where families hire disciplined male cooks.', ['Rahwali', 'GT Road'], ['DC Colony', 'Citi Housing', 'Model Town'], 'cantonment homes'],
    ['Master City', 'housing society', 'Master City is a new gated housing scheme where families hire male cooks for their new homes.', ['Master City gate', 'GT Road bypass'], ['Citi Housing', 'DC Colony', 'Garden Town'], 'new family houses'],
    ['Nowshera Road', 'road / neighbourhood', 'Nowshera Road is a growing corridor of colonies where families hire male cooks at practical rates.', ['Nowshera Road'], ['Peoples Colony', 'Gulshan Colony', 'Civil Lines'], 'family houses'],
    ['Civil Lines', 'neighbourhood', 'Civil Lines is Gujranwala’s established administrative area with spacious homes that hire male cooks.', ['District courts', 'Civil Lines road'], ['Satellite Town', 'Peoples Colony', 'Model Town'], 'large family homes'],
  ],
  Peshawar: [
    ['Hayatabad', 'neighbourhood', 'Hayatabad is Peshawar’s largest planned township, with large family homes hiring male cooks for karahi, chapli kebab and daily meals.', ['Hayatabad phases 1–7', 'Hayatabad Medical Complex', 'Ring Road'], ['University Town', 'Regi Model Town', 'Board'], 'large family houses'],
    ['University Town', 'neighbourhood', 'University Town is an upscale, leafy area of large homes and guest houses that hire experienced male cooks.', ['University of Peshawar', 'Arbab Road'], ['Hayatabad', 'Tehkal', 'Board'], 'large houses and guest houses'],
    ['Cantt', 'cantonment', 'Peshawar Cantt is a green, secure area with family homes and messes that hire disciplined male cooks.', ['Peshawar Club', 'The Mall'], ['Saddar', 'Tehkal', 'University Town'], 'cantonment homes and messes'],
    ['Saddar', 'neighbourhood', 'Saddar is Peshawar’s central commercial area with family homes and guest houses hiring male cooks.', ['Saddar Bazaar', 'Khyber Bazaar (nearby)'], ['Cantt', 'Gulbahar', 'Tehkal'], 'family homes and guest houses'],
    ['Gulbahar', 'neighbourhood', 'Gulbahar is a dense, family-centred area of old Peshawar where male cooks prepare traditional Peshawari food.', ['Gulbahar market', 'GT Road'], ['Saddar', 'Faqirabad', 'Charsadda Road'], 'family houses and joint families'],
    ['DHA Defence', 'housing society', 'DHA Peshawar is a new premium community where homeowners hire full-time and live-in male cooks.', ['DHA Peshawar gate', 'Ring Road'], ['Hayatabad', 'Regi Model Town', 'Warsak Road'], 'new villas and houses'],
    ['Regi Model Town', 'housing society', 'Regi Model Town is a planned society next to Hayatabad where families hire male cooks.', ['Regi Lalma', 'Ring Road'], ['Hayatabad', 'DHA Defence', 'Warsak Road'], 'family houses'],
    ['Warsak Road', 'road / neighbourhood', 'Warsak Road is a growing residential corridor with family houses and farmhouses that hire male cooks.', ['Warsak Road', 'Kababiyan (nearby)'], ['Regi Model Town', 'University Town', 'Tehkal'], 'family houses and farmhouses'],
    ['Tehkal', 'neighbourhood', 'Tehkal is a central, established area between University Town and Cantt with families hiring male cooks.', ['Tehkal Bala', 'Jamrud Road'], ['University Town', 'Cantt', 'Warsak Road'], 'family houses'],
    ['Board', 'neighbourhood', 'Board Bazaar area near the university is home to families and student hostels that hire male cooks.', ['Board Bazaar', 'Jamrud Road'], ['Hayatabad', 'University Town', 'Tehkal'], 'family houses and hostels'],
    ['Dalazak Road', 'road / neighbourhood', 'Dalazak Road is a residential corridor with colonies where families hire male cooks on monthly basis.', ['Dalazak Road', 'Ring Road (nearby)'], ['Gulbahar', 'Faqirabad', 'Charsadda Road'], 'family houses'],
    ['Gulberg', 'neighbourhood', 'Gulberg Peshawar near the Cantt is a family area where male cooks are hired for daily meals.', ['Gulberg market'], ['Cantt', 'Saddar', 'Tehkal'], 'family houses'],
    ['Faqirabad', 'neighbourhood', 'Faqirabad is a busy residential area of Peshawar where joint families hire male cooks.', ['Faqirabad market'], ['Gulbahar', 'Dalazak Road', 'Charsadda Road'], 'family houses and joint families'],
    ['Charsadda Road', 'road / neighbourhood', 'Charsadda Road has many housing schemes where families hire male cooks at practical rates.', ['Charsadda Road'], ['Gulbahar', 'Faqirabad', 'Dalazak Road'], 'family houses'],
  ],
  Multan: [
    ['Cantt', 'cantonment', 'Multan Cantt is a green, secure area of large homes that hire disciplined, experienced male cooks.', ['Multan Cantt', 'Abdali Road (nearby)'], ['Officers Colony', 'Gulgasht Colony', 'Mumtazabad'], 'cantonment homes'],
    ['Gulgasht Colony', 'neighbourhood', 'Gulgasht Colony is Multan’s best-known upscale residential area, where families hire male cooks for daily meals and guests.', ['Gulgasht market', 'Bosan Road'], ['Bosan Road', 'Shah Rukn-e-Alam Colony', 'Officers Colony'], 'large family houses'],
    ['Shah Rukn-e-Alam Colony', 'neighbourhood', 'Shah Rukn-e-Alam Colony is a large, established family area where male cooks prepare traditional Saraiki and Punjabi food.', ['Shah Rukn-e-Alam market'], ['Gulgasht Colony', 'New Multan', 'Garden Town'], 'family houses and joint families'],
    ['Bosan Road', 'road / neighbourhood', 'Bosan Road is a premium residential corridor near BZU with housing schemes that hire male cooks.', ['Bahauddin Zakariya University', 'Bosan Road'], ['Gulgasht Colony', 'Buch Villas', 'Wapda Town'], 'family houses and villas'],
    ['DHA Defence', 'housing society', 'DHA Multan is a new premium community where families hire full-time and live-in male cooks.', ['DHA Multan gate', 'Bosan Road (nearby)'], ['Buch Villas', 'Royal Orchard', 'Bosan Road'], 'new villas and houses'],
    ['Model Town', 'neighbourhood', 'Model Town Multan is a planned family neighbourhood where male cooks are hired for home cooking.', ['Model Town market'], ['Garden Town', 'New Multan', 'Mumtazabad'], 'family houses'],
    ['New Multan', 'neighbourhood', 'New Multan is a large, populated family area where male cooks are hired on monthly basis.', ['New Multan market'], ['Shah Rukn-e-Alam Colony', 'Model Town', 'Qasim Bela'], 'family houses'],
    ['Wapda Town', 'housing society', 'Wapda Town Multan is a planned society of family homes that hire male cooks.', ['Wapda Town gate'], ['Bosan Road', 'Gulgasht Colony', 'Buch Villas'], 'family houses'],
    ['Buch Villas', 'housing society', 'Buch Villas is a premium gated community where live-in male cooks are common.', ['Buch Villas gate', 'Bosan Road'], ['Royal Orchard', 'DHA Defence', 'Bosan Road'], 'villas'],
    ['Royal Orchard', 'housing society', 'Royal Orchard is a modern gated society with new homes that hire male cooks.', ['Royal Orchard main boulevard'], ['Buch Villas', 'DHA Defence', 'Wapda Town'], 'new family houses'],
    ['Garden Town', 'neighbourhood', 'Garden Town Multan is a family neighbourhood where male cooks prepare daily meals.', ['Garden Town market'], ['Model Town', 'Shah Rukn-e-Alam Colony', 'Mumtazabad'], 'family houses'],
    ['Mumtazabad', 'neighbourhood', 'Mumtazabad is a busy, established area of family homes that hire male cooks.', ['Mumtazabad market'], ['Cantt', 'Model Town', 'Garden Town'], 'family houses'],
    ['Qasim Bela', 'neighbourhood', 'Qasim Bela is a residential area near the Cantt where families hire male cooks at practical rates.', ['Qasim Bela market'], ['Cantt', 'New Multan', 'Mumtazabad'], 'family houses'],
    ['Officers Colony', 'neighbourhood', 'Officers Colony is a quiet, established area of spacious homes that hire experienced male cooks.', ['Officers Colony'], ['Cantt', 'Gulgasht Colony', 'Mumtazabad'], 'spacious family homes'],
  ],
  Hyderabad: [
    ['Latifabad', 'neighbourhood', 'Latifabad is Hyderabad’s largest residential town, with family units where male cooks prepare daily Sindhi and desi meals.', ['Latifabad units', 'Auto Bhan Road (nearby)'], ['Qasimabad', 'Auto Bhan Road', 'Naseem Nagar'], 'family houses and joint families'],
    ['Qasimabad', 'neighbourhood', 'Qasimabad is a popular, growing area of family homes where male cooks are in steady demand.', ['Qasimabad main road', 'Wadhu Wah Road'], ['Latifabad', 'Wadhu Wah Road', 'Naseem Nagar'], 'family houses'],
    ['Cantt', 'cantonment', 'Hyderabad Cantt is a secure, green area with family homes that hire disciplined male cooks.', ['Hyderabad Cantt', 'Sarfaraz Colony (nearby)'], ['Saddar', 'Hirabad', 'Citizen Colony'], 'cantonment homes'],
    ['Saddar', 'neighbourhood', 'Saddar is Hyderabad’s central commercial area with older family homes and guest houses hiring male cooks.', ['Saddar Bazaar', 'Resham Gali (nearby)'], ['Cantt', 'Hirabad', 'Paretabad'], 'family homes and guest houses'],
    ['Citizen Colony', 'neighbourhood', 'Citizen Colony is an established family neighbourhood where male cooks are hired for home cooking.', ['Citizen Colony market'], ['Cantt', 'Latifabad', 'Gulistan-e-Sajjad'], 'family houses'],
    ['Gulistan-e-Sajjad', 'neighbourhood', 'Gulistan-e-Sajjad is a planned residential area where families hire male cooks on monthly basis.', ['Gulistan-e-Sajjad main road'], ['Citizen Colony', 'Qasimabad', 'Jamshoro Road'], 'family houses'],
    ['Auto Bhan Road', 'road / neighbourhood', 'Auto Bhan Road is a prime residential and commercial corridor with family homes that hire male cooks.', ['Auto Bhan Road', 'Latifabad (nearby)'], ['Latifabad', 'Qasimabad', 'Hirabad'], 'family houses and apartments'],
    ['Wadhu Wah Road', 'road / neighbourhood', 'Wadhu Wah Road in Qasimabad is lined with family homes and schemes where male cooks are hired.', ['Wadhu Wah Road'], ['Qasimabad', 'Naseem Nagar', 'Latifabad'], 'family houses'],
    ['Hirabad', 'neighbourhood', 'Hirabad is a historic central neighbourhood with joint families who prefer experienced male cooks.', ['Hirabad', 'Pakka Qila (nearby)'], ['Saddar', 'Paretabad', 'Cantt'], 'family houses and joint families'],
    ['Naseem Nagar', 'neighbourhood', 'Naseem Nagar is a family area in Qasimabad where male cooks prepare daily meals.', ['Naseem Nagar Chowk'], ['Qasimabad', 'Wadhu Wah Road', 'Latifabad'], 'family houses'],
    ['Jamshoro Road', 'road / neighbourhood', 'Jamshoro Road is a growing corridor of housing schemes and hostels that hire male cooks.', ['Jamshoro Road', 'Sindh University (nearby)'], ['Gulistan-e-Sajjad', 'Qasimabad', 'Citizen Colony'], 'family houses and hostels'],
    ['Paretabad', 'neighbourhood', 'Paretabad is a dense, established area where joint families hire male cooks at practical rates.', ['Paretabad market'], ['Hirabad', 'Saddar', 'Latifabad'], 'family houses and joint families'],
  ],
  Quetta: [
    ['Jinnah Town', 'neighbourhood', 'Jinnah Town is one of Quetta’s most sought-after residential areas, where families hire male cooks for daily meals and guests.', ['Jinnah Town market', 'Samungli Road'], ['Samungli Road', 'Shahbaz Town', 'Chaman Housing Scheme'], 'large family houses'],
    ['Samungli Road', 'road / neighbourhood', 'Samungli Road is a prime residential corridor with family homes that hire male cooks for sajji, karahi and everyday food.', ['Samungli Road', 'Quetta Airport (nearby)'], ['Jinnah Town', 'Airport Road', 'Shahbaz Town'], 'family houses'],
    ['Cantt', 'cantonment', 'Quetta Cantt is a secure, green area of family homes and messes that hire disciplined male cooks.', ['Quetta Cantt', 'Command and Staff College'], ['Zarghoon Road', 'Brewery Road', 'Airport Road'], 'cantonment homes and messes'],
    ['Satellite Town', 'neighbourhood', 'Satellite Town is a large family neighbourhood in Quetta where male cooks are hired on monthly basis.', ['Satellite Town market'], ['Sariab Road', 'Brewery Road', 'Arbab Karam Khan Road'], 'family houses'],
    ['Shahbaz Town', 'neighbourhood', 'Shahbaz Town is an established residential area of family homes that hire male cooks.', ['Shahbaz Town market'], ['Jinnah Town', 'Samungli Road', 'Chaman Housing Scheme'], 'family houses'],
    ['Airport Road', 'road / neighbourhood', 'Airport Road is a residential corridor near the airport with family homes and guest houses hiring male cooks.', ['Quetta Airport', 'Airport Road'], ['Samungli Road', 'Cantt', 'Jinnah Town'], 'family homes and guest houses'],
    ['Zarghoon Road', 'road / neighbourhood', 'Zarghoon Road is a central road with offices, guest houses and family homes that hire male cooks.', ['Zarghoon Road', 'Serena Hotel (nearby)'], ['Cantt', 'Brewery Road', 'Jinnah Town'], 'family homes, offices and guest houses'],
    ['Brewery Road', 'road / neighbourhood', 'Brewery Road is a residential corridor where families hire male cooks for daily cooking.', ['Brewery Road'], ['Satellite Town', 'Zarghoon Road', 'Cantt'], 'family houses'],
    ['Chaman Housing Scheme', 'housing society', 'Chaman Housing Scheme is a planned family community where male cooks are in demand.', ['Chaman Housing gate'], ['Jinnah Town', 'Shahbaz Town', 'Samungli Road'], 'family houses'],
    ['Arbab Karam Khan Road', 'road / neighbourhood', 'Arbab Karam Khan Road is a busy residential area where joint families hire male cooks.', ['Arbab Karam Khan Road'], ['Satellite Town', 'Sariab Road', 'Brewery Road'], 'family houses and joint families'],
    ['Sariab Road', 'road / neighbourhood', 'Sariab Road is a long residential and university corridor where families and hostels hire male cooks.', ['University of Balochistan', 'Sariab Road'], ['Satellite Town', 'Arbab Karam Khan Road', 'Brewery Road'], 'family houses and hostels'],
    ['Model Town', 'neighbourhood', 'Model Town Quetta is a planned family neighbourhood where male cooks prepare everyday meals.', ['Model Town market'], ['Jinnah Town', 'Satellite Town', 'Zarghoon Road'], 'family houses'],
  ],
};

// Keyword pages for cities outside Islamabad / Rawalpindi (male cooks only).
export const cityKeywordPrefixes = ['Male Cook in', 'Hire Male Cook in', 'Male Home Cook', 'Male Cook for Home', 'Full Time Male Cook', 'Part Time Male Cook', 'Live In Male Cook', 'Male Cook Agency'] as const;
export const areaKeywordPrefixes = ['Male Cook in', 'Hire Male Cook in', 'Male Home Cook in'] as const;
