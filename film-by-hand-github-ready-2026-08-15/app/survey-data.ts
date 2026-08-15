export const equipment = ["Paterson developing tank", "Jobo processing system", "AGO tank", "Filmomat", "Stainless-steel developing tank", "Rondinax", "Kindermann tank", "Morse tank", "Laboratory / commercial processor", "Custom-built setup", "Other"];
export const filmTypes = ["Ilford", "Agfa", "Adox", "Kentmere", "Kodak", "ECN-2 / Cinema Film", "Slide Film / E-6", "Fujifilm", "CineStill", "Experimental / alternative film", "Other"];
export const knowledge = ["Film manufacturer's datasheet", "Developer manufacturer's instructions", "Massive Dev Chart", "Books / darkroom manuals", "Online photography forums", "Reddit", "YouTube", "ChatGPT / other AI tools", "Advice from another photographer", "Personal experience", "Trial and error", "Other"];
export const stages = ["Loading film onto the reel", "Measuring chemicals", "Mixing / diluting chemicals", "Maintaining correct temperature", "Timing development", "Agitation", "Stop bath", "Fixing", "Washing", "Final rinse", "Drying", "Cutting and storing negatives"];
export const frequency = ["Almost never", "Rarely", "Sometimes", "Often", "Almost every roll"];
export const problems = ["Uneven development", "Incorrect temperature", "Incorrect development time", "Incorrect chemical dilution", "Incorrect agitation", "Scratches", "Fingerprints", "Dust", "Water marks", "Insufficient fixing", "Overdevelopment", "Underdevelopment", "Chemical contamination", "Film sticking together", "Difficulty loading the reel", "Drying problems", "Other"];
export const difficultyLabels = ["Very easy", "Easy", "Moderate", "Difficult", "Very difficult"];
export const ageRanges = ["Under 18", "18–24", "25–34", "35–44", "45–54", "55–64", "65+", "Prefer not to say"];
export const photographyRelationships = ["Passion", "Profession", "Both passion and profession"];

const regionCodes = "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW".split(" ");
const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
export const countries = regionCodes.map((code) => ({ code, name: countryNames.of(code) ?? code })).sort((a, b) => a.name.localeCompare(b.name));

export const citiesByCountry: Record<string, string[]> = {
  IN: ["Ahmedabad", "Bengaluru", "Bhopal", "Chandigarh", "Chennai", "Delhi", "Goa", "Hyderabad", "Jaipur", "Kochi", "Kolkata", "Lucknow", "Mumbai", "Pune", "Thiruvananthapuram"],
  US: ["Atlanta", "Austin", "Boston", "Chicago", "Dallas", "Denver", "Detroit", "Houston", "Los Angeles", "Miami", "New York City", "Philadelphia", "Portland", "San Diego", "San Francisco", "Seattle", "Washington, D.C."],
  GB: ["Belfast", "Birmingham", "Brighton", "Bristol", "Cardiff", "Edinburgh", "Glasgow", "Leeds", "Liverpool", "London", "Manchester", "Newcastle", "Nottingham", "Oxford"],
  CA: ["Calgary", "Edmonton", "Halifax", "Hamilton", "Montreal", "Ottawa", "Quebec City", "Toronto", "Vancouver", "Victoria", "Winnipeg"],
  AU: ["Adelaide", "Brisbane", "Canberra", "Darwin", "Gold Coast", "Hobart", "Melbourne", "Perth", "Sydney"],
  DE: ["Berlin", "Bonn", "Cologne", "Dresden", "Düsseldorf", "Frankfurt", "Hamburg", "Leipzig", "Munich", "Stuttgart"],
  FR: ["Bordeaux", "Lille", "Lyon", "Marseille", "Montpellier", "Nantes", "Nice", "Paris", "Strasbourg", "Toulouse"],
  IT: ["Bologna", "Florence", "Genoa", "Milan", "Naples", "Palermo", "Rome", "Turin", "Venice"],
  ES: ["Barcelona", "Bilbao", "Granada", "Madrid", "Málaga", "Seville", "Valencia", "Zaragoza"],
  JP: ["Fukuoka", "Hiroshima", "Kobe", "Kyoto", "Nagoya", "Osaka", "Sapporo", "Sendai", "Tokyo", "Yokohama"],
  KR: ["Busan", "Daegu", "Daejeon", "Gwangju", "Incheon", "Jeju", "Seoul", "Suwon"],
  CN: ["Beijing", "Chengdu", "Chongqing", "Guangzhou", "Hangzhou", "Nanjing", "Shanghai", "Shenzhen", "Tianjin", "Wuhan", "Xi'an"],
  BR: ["Belo Horizonte", "Brasília", "Curitiba", "Fortaleza", "Porto Alegre", "Recife", "Rio de Janeiro", "Salvador", "São Paulo"],
  MX: ["Cancún", "Guadalajara", "Mexico City", "Monterrey", "Oaxaca", "Puebla", "Querétaro", "Tijuana"],
  ZA: ["Cape Town", "Durban", "East London", "Johannesburg", "Port Elizabeth", "Pretoria"],
  NL: ["Amsterdam", "Eindhoven", "Groningen", "Rotterdam", "The Hague", "Utrecht"],
  BE: ["Antwerp", "Bruges", "Brussels", "Ghent", "Leuven", "Liège"],
  SE: ["Gothenburg", "Malmö", "Stockholm", "Uppsala"],
  NO: ["Bergen", "Oslo", "Stavanger", "Trondheim"],
  DK: ["Aalborg", "Aarhus", "Copenhagen", "Odense"],
  FI: ["Espoo", "Helsinki", "Tampere", "Turku"],
  IE: ["Cork", "Dublin", "Galway", "Limerick"],
  NZ: ["Auckland", "Christchurch", "Dunedin", "Hamilton", "Wellington"],
  SG: ["Singapore"], HK: ["Hong Kong"], AE: ["Abu Dhabi", "Dubai", "Sharjah"],
};

export type Answers = {
  name: string;
  country: string;
  countryCode: string;
  city: string;
  ageRange: string;
  photographyRelationship: string;
  startYear: number;
  equipment: string;
  equipmentOther: string;
  filmTypes: string[];
  filmTypesOther: string;
  knowledgeSources: string[];
  knowledgeOther: string;
  difficulty: Record<string, number>;
  problemFrequency: string;
  problems: string[];
  problemsOther: string;
  frustration: string;
  workspaceSize: string;
  workspaceAreaM2: number;
};

export const initialAnswers: Answers = { name: "", country: "", countryCode: "", city: "", ageRange: "", photographyRelationship: "", startYear: 1997, equipment: "", equipmentOther: "", filmTypes: [], filmTypesOther: "", knowledgeSources: [], knowledgeOther: "", difficulty: {}, problemFrequency: "", problems: [], problemsOther: "", frustration: "", workspaceSize: "8 m² · 86 ft²", workspaceAreaM2: 8 };
