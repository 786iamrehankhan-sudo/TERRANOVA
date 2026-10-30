import atacama from "@/assets/loc-atacama.jpg";
import iceland from "@/assets/loc-iceland.jpg";
import antarctica from "@/assets/loc-antarctica.jpg";
import deathvalley from "@/assets/loc-deathvalley.jpg";
import haughton from "@/assets/loc-haughton.jpg";
import hawaii from "@/assets/loc-hawaii.jpg";
import california from "@/assets/loc-california.jpg";

/**
 * Feature indices are 0–1 qualitative ratings curated by the TerraTwin team from
 * published field-analog literature. They are NOT instrument measurements.
 * `null` means "no compatible information" — never treated as zero.
 */
export const FEATURES = {
  aridity: { label: "Dryness", help: "How little liquid water is present." },
  cold: { label: "Cold", help: "How cold the place is year-round." },
  roughness: { label: "Surface roughness", help: "How rocky and bumpy the ground is." },
  slope: { label: "Steep slopes", help: "How much of the terrain is steep." },
  basalt: { label: "Volcanic rock", help: "Amount of basalt — dark rock from cooled lava." },
  impact: { label: "Impact features", help: "Craters made by asteroids or meteorites." },
  ice: { label: "Ground ice", help: "Frozen water in or under the soil." },
  regolith: { label: "Loose dust & soil", help: "Fine broken rock covering the surface (called regolith)." },
  sediment: { label: "Water-made rock", help: "Layers left by ancient lakes or rivers." },
  lighting: { label: "Extreme lighting", help: "Long days/nights or low sun angles, as at the poles." },
  caves: { label: "Caves & lava tubes", help: "Underground spaces useful for shelter tests." },
  sterile: { label: "Very little life", help: "How few plants and microbes there are." },
} as const;
export type FeatureKey = keyof typeof FEATURES;
export type Profile = Record<FeatureKey, number | null>;

export type MissionId =
  | "rover" | "astronaut" | "geology" | "habitat" | "solar" | "surface" | "underground";

export const MISSIONS: { id: MissionId; label: string; short: string; weights: Partial<Record<FeatureKey, number>> }[] = [
  { id: "rover", label: "Rover Testing", short: "Drive robots over realistic ground.", weights: { roughness: 3, slope: 2, regolith: 3, aridity: 1, sterile: 1 } },
  { id: "astronaut", label: "Astronaut Training", short: "Practice moving, working and surviving.", weights: { cold: 2, aridity: 2, roughness: 2, sterile: 1, lighting: 1, impact: 1 } },
  { id: "geology", label: "Geological Research", short: "Study rocks that resemble the target.", weights: { basalt: 3, impact: 3, sediment: 3, ice: 1 } },
  { id: "habitat", label: "Habitat Testing", short: "Test shelters in harsh conditions.", weights: { cold: 3, aridity: 2, sterile: 2, caves: 1, lighting: 1 } },
  { id: "solar", label: "Solar Equipment Testing", short: "Test panels under similar light & dust.", weights: { lighting: 3, regolith: 2, aridity: 2, cold: 1 } },
  { id: "surface", label: "Surface Exploration", short: "Plan routes and navigate open terrain.", weights: { roughness: 2, slope: 2, impact: 2, regolith: 2, sterile: 1 } },
  { id: "underground", label: "Underground Exploration", short: "Explore caves and lava tubes.", weights: { caves: 4, basalt: 2, ice: 1 } },
];

export type DataStatus = "available" | "partial" | "missing";

export interface EarthLocation {
  id: string;
  name: string;
  country: string;
  region: string;
  environment: "Desert" | "Polar" | "Volcanic";
  terrain: string;
  image: string;
  lat: number;
  lon: number;
  summary: string;
  geography: string;
  climate: { meanTempC: number | null; precipMm: number | null; elevationM: string; note: string };
  geology: string;
  terrainText: string;
  missions: MissionId[];
  strengths: string[];
  limitations: string[];
  /** 0–1: how well documented this site is in our curated set. */
  documentation: number;
  datasets: { name: string; status: DataStatus }[];
  profile: Profile;
}

export const LOCATIONS: EarthLocation[] = [
  {
    id: "atacama", name: "Atacama Desert", country: "Chile", region: "South America", environment: "Desert",
    terrain: "Salt flats & dry hills", image: atacama, lat: -24.5, lon: -69.25,
    summary: "One of the driest places on Earth. Some areas see almost no rain for years.",
    geography: "A high plateau between the Andes and the Pacific coast in northern Chile.",
    climate: { meanTempC: 17, precipMm: 15, elevationM: "0 – 4,000+", note: "Extremely dry, strong sunlight, large day–night temperature swings." },
    geology: "Salt deposits (nitrates, sulfates), volcanic sediments and very old, weathered soils.",
    terrainText: "Flat salt pans, dry riverbeds, rocky hills and loose fine soil.",
    missions: ["rover", "solar", "surface", "geology"],
    strengths: ["Mars-like dry soil with very few microbes", "Clear skies, intense sunlight", "Long history of rover field tests"],
    limitations: ["Much warmer than Mars", "Thick breathable atmosphere", "No real impact craters nearby"],
    documentation: 0.9,
    datasets: [{ name: "Landsat", status: "available" }, { name: "MODIS", status: "available" }, { name: "Sentinel-2", status: "available" }, { name: "Copernicus DEM", status: "available" }],
    profile: { aridity: 1, cold: 0.25, roughness: 0.5, slope: 0.35, basalt: 0.3, impact: 0.05, ice: 0, regolith: 0.85, sediment: 0.6, lighting: 0.2, caves: 0.05, sterile: 0.95 },
  },
  {
    id: "iceland", name: "Icelandic Volcanic Regions", country: "Iceland", region: "Europe", environment: "Volcanic",
    terrain: "Lava fields & black sand", image: iceland, lat: 64.9, lon: -18.5,
    summary: "Young lava fields, black volcanic sand and glaciers, side by side.",
    geography: "Volcanic highlands across central Iceland, on the Mid-Atlantic Ridge.",
    climate: { meanTempC: 2, precipMm: null, elevationM: "0 – 2,100", note: "Cool and windy. Rainfall varies widely across the island." },
    geology: "Basalt lava flows, volcanic glass, ash, and rock changed by hot water.",
    terrainText: "Rough lava, sandy plains, ridges and some lava tubes.",
    missions: ["rover", "astronaut", "geology", "underground"],
    strengths: ["Basalt similar to Moon and Mars volcanic plains", "Lava tubes for cave tests", "Easy access"],
    limitations: ["Wet climate with moss and life", "Mild temperatures compared to space", "Frequent clouds"],
    documentation: 0.8,
    datasets: [{ name: "Landsat", status: "available" }, { name: "Sentinel-2", status: "available" }, { name: "Copernicus DEM", status: "available" }, { name: "NASA POWER", status: "partial" }],
    profile: { aridity: 0.3, cold: 0.55, roughness: 0.85, slope: 0.5, basalt: 1, impact: 0, ice: 0.4, regolith: 0.6, sediment: 0.3, lighting: 0.55, caves: 0.7, sterile: 0.45 },
  },
  {
    id: "antarctica", name: "Antarctica Dry Valleys", country: "Antarctica", region: "Antarctica", environment: "Polar",
    terrain: "Ice-free polar valleys", image: antarctica, lat: -77.5, lon: 162,
    summary: "Ice-free valleys that are cold, dry and windy — very much like Mars.",
    geography: "McMurdo Dry Valleys, a series of snow-free valleys west of McMurdo Sound.",
    climate: { meanTempC: -20, precipMm: 50, elevationM: "0 – 2,000", note: "Freezing, very dry, months of daylight and darkness." },
    geology: "Granite and dolerite bedrock, frozen soils (permafrost), salty lakes.",
    terrainText: "Gravel valley floors, polygon-shaped frozen ground, steep rock walls.",
    missions: ["astronaut", "habitat", "geology", "solar"],
    strengths: ["Cold + dry, the closest Earth match to Mars climate", "Polar lighting cycles", "Ground ice"],
    limitations: ["Very hard and costly to reach", "Rock types differ from Martian basalt", "Strict environmental rules"],
    documentation: 0.85,
    datasets: [{ name: "Landsat", status: "available" }, { name: "MODIS", status: "available" }, { name: "Copernicus DEM", status: "partial" }, { name: "NASA POWER", status: "available" }],
    profile: { aridity: 0.9, cold: 1, roughness: 0.55, slope: 0.6, basalt: 0.35, impact: 0, ice: 0.9, regolith: 0.55, sediment: 0.45, lighting: 1, caves: 0, sterile: 0.9 },
  },
  {
    id: "death-valley", name: "Death Valley", country: "USA", region: "North America", environment: "Desert",
    terrain: "Salt pans & badlands", image: deathvalley, lat: 36.5, lon: -117,
    summary: "A hot, dry basin with salt flats, ancient lakebeds and eroded hills.",
    geography: "A deep desert basin in eastern California, partly below sea level.",
    climate: { meanTempC: 25, precipMm: 60, elevationM: "-86 – 3,366", note: "Extremely hot summers, very little rain." },
    geology: "Old lake deposits, salts, alluvial fans and colorful layered rocks.",
    terrainText: "Flat salt crust, gravel fans, steep canyons and ridges.",
    missions: ["rover", "geology", "surface"],
    strengths: ["Ancient lake deposits like Jezero and Gale", "Good road access", "Varied terrain in a small area"],
    limitations: ["Very hot, unlike Mars", "Plants and animals present", "No ground ice"],
    documentation: 0.85,
    datasets: [{ name: "Landsat", status: "available" }, { name: "MODIS", status: "available" }, { name: "Sentinel-2", status: "available" }, { name: "Copernicus DEM", status: "available" }],
    profile: { aridity: 0.85, cold: 0.05, roughness: 0.55, slope: 0.55, basalt: 0.25, impact: 0, ice: 0, regolith: 0.7, sediment: 0.9, lighting: 0.2, caves: 0.05, sterile: 0.7 },
  },
  {
    id: "haughton", name: "Haughton Crater", country: "Canada", region: "North America", environment: "Polar",
    terrain: "Arctic impact crater", image: haughton, lat: 75.38, lon: -89.68,
    summary: "A 23 km asteroid crater in the high Arctic, used for Mars mission practice.",
    geography: "Devon Island, Nunavut — one of the largest uninhabited islands on Earth.",
    climate: { meanTempC: -16, precipMm: null, elevationM: "0 – 400", note: "Polar desert: cold, dry and windy with long summer daylight." },
    geology: "Impact-shattered rock (breccia), limestone and dolomite, frozen ground.",
    terrainText: "Crater rim, rocky plains, valleys and gullies.",
    missions: ["astronaut", "geology", "surface", "habitat"],
    strengths: ["Real impact crater", "Cold polar desert", "Ground ice and gullies"],
    limitations: ["Limestone instead of volcanic rock", "Only reachable in short summer", "Weather can stop work"],
    documentation: 0.75,
    datasets: [{ name: "Landsat", status: "available" }, { name: "Sentinel-2", status: "partial" }, { name: "Copernicus DEM", status: "available" }, { name: "NASA POWER", status: "partial" }],
    profile: { aridity: 0.75, cold: 0.9, roughness: 0.6, slope: 0.4, basalt: 0.1, impact: 1, ice: 0.75, regolith: 0.5, sediment: 0.55, lighting: 0.9, caves: 0, sterile: 0.8 },
  },
  {
    id: "hawaii", name: "Hawaii Volcanic Regions", country: "USA", region: "Oceania", environment: "Volcanic",
    terrain: "High volcanic slopes", image: hawaii, lat: 19.82, lon: -155.47,
    summary: "High, barren volcano slopes with basalt soil and cinder cones.",
    geography: "Upper slopes of Mauna Kea and Mauna Loa on Hawaiʻi Island.",
    climate: { meanTempC: 4, precipMm: null, elevationM: "2,000 – 4,207", note: "Cool and dry above the clouds; strong sunlight at altitude." },
    geology: "Basalt lava, volcanic ash soils (tephra), cinder cones and lava tubes.",
    terrainText: "Loose ash slopes, lava rock, cones and tubes.",
    missions: ["rover", "habitat", "geology", "underground", "astronaut"],
    strengths: ["Basaltic soil like lunar and Martian plains", "Lava tubes", "Used for habitat simulations"],
    limitations: ["Lower slopes have vegetation", "Altitude and weather changes", "Culturally important land"],
    documentation: 0.8,
    datasets: [{ name: "Landsat", status: "available" }, { name: "Sentinel-2", status: "available" }, { name: "Copernicus DEM", status: "available" }, { name: "NASA POWER", status: "available" }],
    profile: { aridity: 0.6, cold: 0.5, roughness: 0.75, slope: 0.45, basalt: 1, impact: 0, ice: 0.1, regolith: 0.85, sediment: 0.1, lighting: 0.2, caves: 0.8, sterile: 0.7 },
  },
  {
    id: "california-lava", name: "California Lava Fields", country: "USA", region: "North America", environment: "Volcanic",
    terrain: "Basalt flows & lava tubes", image: california, lat: 41.71, lon: -121.51,
    summary: "Old lava flows full of caves and lava tubes, great for underground practice.",
    geography: "Lava Beds National Monument and nearby volcanic fields in northern California.",
    climate: { meanTempC: 9, precipMm: 370, elevationM: "1,200 – 1,700", note: "Semi-dry with cold winters and warm summers." },
    geology: "Basalt flows, cinder cones and more than 700 lava-tube caves.",
    terrainText: "Rough lava, collapsed tube trenches and cave entrances.",
    missions: ["underground", "rover", "geology"],
    strengths: ["Many accessible lava tubes", "Basaltic rock", "Good access and infrastructure"],
    limitations: ["Vegetation on the surface", "Climate unlike Moon or Mars", "No impact features"],
    documentation: 0.65,
    datasets: [{ name: "Landsat", status: "available" }, { name: "Sentinel-2", status: "available" }, { name: "Copernicus DEM", status: "available" }, { name: "MODIS", status: "partial" }],
    profile: { aridity: 0.45, cold: 0.35, roughness: 0.8, slope: 0.3, basalt: 0.95, impact: 0, ice: 0.15, regolith: 0.45, sediment: 0.1, lighting: 0.2, caves: 1, sterile: 0.4 },
  },
];

export type PlanetId = "earth" | "moon" | "mars";

export interface Target {
  id: string;
  name: string;
  planet: "moon" | "mars";
  coords: string;
  summary: string;
  overview: string;
  terrain: string;
  surface: string;
  science: string;
  facts: { label: string; value: string }[];
  datasets: { name: string; what: string; source: string }[];
  profile: Profile;
}

export const TARGETS: Target[] = [
  {
    id: "shackleton", name: "Shackleton Crater", planet: "moon", coords: "89.9° S, 0° E",
    summary: "A deep crater at the Moon's south pole whose floor never sees sunlight.",
    overview: "Shackleton sits almost exactly on the lunar south pole. Its rim gets sunlight most of the time, while the inside stays in permanent shadow.",
    terrain: "Steep inner walls, a flat dark floor and a rim with near-constant sunlight.",
    surface: "Covered in fine lunar dust (regolith). The shadowed floor is among the coldest places in the solar system.",
    science: "Permanently shadowed regions may trap water ice — a key resource for future crews.",
    facts: [{ label: "Diameter", value: "~21 km" }, { label: "Depth", value: "~4 km" }, { label: "Sunlight", value: "Rim: mostly lit · Floor: never" }],
    datasets: [{ name: "LOLA", what: "Laser elevation maps", source: "NASA PDS" }, { name: "Diviner", what: "Surface temperatures", source: "NASA PDS" }, { name: "LRO imagery", what: "Surface photos", source: "NASA Trek" }],
    profile: { aridity: 1, cold: 1, roughness: 0.6, slope: 0.9, basalt: 0.2, impact: 1, ice: 0.7, regolith: 1, sediment: 0, lighting: 1, caves: 0, sterile: 1 },
  },
  {
    id: "lunar-south-pole", name: "Lunar South Polar Region", planet: "moon", coords: "80–90° S",
    summary: "The wider polar area chosen for upcoming crewed landings.",
    overview: "A rugged highland region around the south pole with many craters, peaks of near-constant light and shadowed basins.",
    terrain: "Heavily cratered highlands, ridges and long shadows from the low sun.",
    surface: "Bright highland rock and dust; very low sun angles create harsh light and shadow.",
    science: "Possible ice in shadowed craters and steady sunlight on peaks for solar power.",
    facts: [{ label: "Sun angle", value: "Very low, near horizon" }, { label: "Terrain", value: "Cratered highlands" }, { label: "Interest", value: "Water ice, solar power" }],
    datasets: [{ name: "LOLA", what: "Elevation & slope", source: "NASA PDS" }, { name: "Diviner", what: "Temperature maps", source: "NASA PDS" }, { name: "Moon Trek", what: "Interactive maps", source: "NASA Trek" }],
    profile: { aridity: 1, cold: 0.95, roughness: 0.75, slope: 0.75, basalt: 0.15, impact: 1, ice: 0.6, regolith: 1, sediment: 0, lighting: 1, caves: 0.05, sterile: 1 },
  },
  {
    id: "jezero", name: "Jezero Crater", planet: "mars", coords: "18.4° N, 77.5° E",
    summary: "An ancient lake on Mars with a river delta — Perseverance's landing site.",
    overview: "Billions of years ago, a river flowed into Jezero and formed a lake. The delta it left behind is a top place to look for signs of past life.",
    terrain: "Flat crater floor, a fan-shaped delta and rocky crater rim.",
    surface: "Layered sediment, clays and carbonates, plus volcanic rock on the floor.",
    science: "Lake and river deposits may preserve evidence of ancient microbial life.",
    facts: [{ label: "Diameter", value: "~45 km" }, { label: "Feature", value: "Ancient river delta" }, { label: "Mission", value: "Perseverance rover" }],
    datasets: [{ name: "MOLA", what: "Elevation", source: "NASA PDS" }, { name: "CRISM", what: "Mineral maps", source: "NASA PDS" }, { name: "Mars Trek", what: "Interactive maps", source: "NASA Trek" }],
    profile: { aridity: 0.95, cold: 0.85, roughness: 0.55, slope: 0.35, basalt: 0.6, impact: 0.8, ice: 0.2, regolith: 0.8, sediment: 1, lighting: 0.3, caves: 0, sterile: 1 },
  },
  {
    id: "gale", name: "Gale Crater", planet: "mars", coords: "5.4° S, 137.8° E",
    summary: "A huge crater with a 5 km layered mountain, explored by Curiosity.",
    overview: "Gale holds Mount Sharp, a mountain built from stacked layers of rock that record Mars' changing climate.",
    terrain: "Crater floor, dunes, and the layered slopes of Mount Sharp.",
    surface: "Mudstones, sandstones, sand dunes and clay-rich layers.",
    science: "Rocks show Gale once held lakes that could have supported microbes.",
    facts: [{ label: "Diameter", value: "~154 km" }, { label: "Mount Sharp", value: "~5 km high" }, { label: "Mission", value: "Curiosity rover" }],
    datasets: [{ name: "MOLA", what: "Elevation", source: "NASA PDS" }, { name: "CRISM", what: "Mineral maps", source: "NASA PDS" }, { name: "Mars Trek", what: "Interactive maps", source: "NASA Trek" }],
    profile: { aridity: 0.95, cold: 0.8, roughness: 0.6, slope: 0.6, basalt: 0.55, impact: 0.85, ice: 0.15, regolith: 0.85, sediment: 0.95, lighting: 0.3, caves: 0, sterile: 1 },
  },
];

export const PLANETS: { id: PlanetId; name: string; tagline: string; text: string; facts: { label: string; value: string }[] }[] = [
  { id: "earth", name: "Earth", tagline: "Our training ground", text: "Earth's deserts, volcanoes and polar valleys can partly copy conditions on other worlds.", facts: [{ label: "Gravity", value: "1 g" }, { label: "Day", value: "24 h" }, { label: "Analog sites here", value: String(7) }] },
  { id: "moon", name: "Moon", tagline: "Our nearest neighbour", text: "Airless, dusty and cratered. The south pole may hold water ice for future bases.", facts: [{ label: "Gravity", value: "0.17 g" }, { label: "Day", value: "~29.5 Earth days" }, { label: "Targets", value: "2" }] },
  { id: "mars", name: "Mars", tagline: "The next giant leap", text: "A cold desert planet with ancient lakes, volcanoes and canyons.", facts: [{ label: "Gravity", value: "0.38 g" }, { label: "Day", value: "24 h 37 m" }, { label: "Targets", value: "2" }] },
];

export const SOURCES = [
  { name: "NASA PDS", url: "https://pds.nasa.gov/", provides: "Archive of science data from planetary missions (LOLA, Diviner, MOLA, CRISM).", connected: false },
  { name: "NASA Trek", url: "https://trek.nasa.gov/", provides: "Interactive maps of the Moon, Mars and other bodies.", connected: false },
  { name: "NASA POWER", url: "https://power.larc.nasa.gov/", provides: "Solar and weather data for any point on Earth.", connected: false },
  { name: "NASA Earthdata", url: "https://earthdata.nasa.gov/", provides: "Earth observation data such as Landsat and MODIS.", connected: false },
  { name: "Copernicus Data Space", url: "https://dataspace.copernicus.eu/", provides: "European Sentinel satellite images and the Copernicus DEM elevation model.", connected: false },
];

export const DATASETS = [
  { name: "LOLA", body: "Moon", what: "Laser altimeter — measures height and slope of the lunar surface." },
  { name: "Diviner", body: "Moon", what: "Thermal instrument — maps lunar surface temperatures." },
  { name: "MOLA", body: "Mars", what: "Laser altimeter — global elevation map of Mars." },
  { name: "CRISM", body: "Mars", what: "Spectrometer — identifies minerals on Mars." },
  { name: "Landsat", body: "Earth", what: "Long-running satellite imagery of Earth's land." },
  { name: "MODIS", body: "Earth", what: "Daily images for temperature, vegetation and snow." },
  { name: "Sentinel", body: "Earth", what: "European satellites with high-resolution imagery." },
  { name: "Copernicus DEM", body: "Earth", what: "Global 30 m elevation model of Earth." },
];

export const getLocation = (id: string) => LOCATIONS.find((l) => l.id === id);
export const getTarget = (id: string) => TARGETS.find((t) => t.id === id);
export const getMission = (id: string) => MISSIONS.find((m) => m.id === id);
