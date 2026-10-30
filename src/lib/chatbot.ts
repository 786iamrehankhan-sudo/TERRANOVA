// Rule-based chatbot knowledge base for TERRANOVA

export interface ChatMessage {
  role: "user" | "bot";
  text: string;
  timestamp: Date;
}

// ─── Knowledge base ──────────────────────────────────────────────────────────

const KB: { patterns: RegExp[]; answer: string }[] = [
  // ── Greetings ──
  {
    patterns: [/^(hi|hello|hey|howdy|sup|yo)\b/i, /^good (morning|afternoon|evening)/i],
    answer:
      "Hey! 👋 I'm NOVA, your guide to TERRANOVA. Ask me about Earth analog sites, Moon & Mars targets, missions, or how the AI matching works!",
  },
  {
    patterns: [/how are you/i, /how r u/i],
    answer:
      "I'm doing great — floating somewhere between Earth and Mars 🚀. How can I help you explore today?",
  },
  {
    patterns: [/^(thanks|thank you|thx|cheers)\b/i],
    answer: "You're welcome! Anything else you'd like to know about Earth analogs or space missions? 🌍",
  },
  {
    patterns: [/^(bye|goodbye|see you|cya)\b/i],
    answer: "Safe travels, explorer! Come back anytime 🚀🌕",
  },
  {
    patterns: [/your name|who are you|what are you/i],
    answer:
      "I'm NOVA — TERRANOVA's built-in guide. I know everything about the Earth analog sites, Moon & Mars targets, mission types, and how the matching algorithm works. Ask away!",
  },

  // ── What is TERRANOVA ──
  {
    patterns: [/what is terranova|about terranova|what does terranova do/i],
    answer:
      "TERRANOVA is an Earth-analog explorer that helps researchers and space agencies find places on Earth that resemble the Moon or Mars. It compares 12 terrain traits (aridity, cold, roughness, etc.) and ranks Earth sites by their similarity to a chosen planetary target and mission type.",
  },

  // ── Earth Locations ──
  {
    patterns: [/how many (locations|sites|places|analogs)/i, /number of (locations|sites)/i],
    answer: "TERRANOVA has **7 Earth analog locations**: Atacama Desert, Icelandic Volcanic Regions, Antarctica Dry Valleys, Death Valley, Haughton Crater, Hawaii Volcanic Regions, and California Lava Fields.",
  },
  {
    patterns: [/atacama/i],
    answer:
      "🏜️ **Atacama Desert (Chile)** — One of the driest places on Earth. Almost no rain for years. Features salt flats, dry hills, and Mars-like soil with very few microbes. Best for: Rover Testing, Solar Equipment, Surface Exploration, Geology. Similarity strength: aridity (1.0), regolith (0.85), sterility (0.95).",
  },
  {
    patterns: [/iceland/i],
    answer:
      "🌋 **Icelandic Volcanic Regions** — Young lava fields, black volcanic sand, and glaciers. The basalt rock closely resembles Moon and Mars volcanic plains. Has lava tubes for underground testing. Best for: Rover Testing, Astronaut Training, Geology, Underground Exploration.",
  },
  {
    patterns: [/antarctica|dry valley/i],
    answer:
      "🧊 **Antarctica Dry Valleys** — Ice-free, cold, and windy — the closest Earth match to Mars climate. Features polygon-shaped frozen ground, gravel floors, and polar lighting cycles. Best for: Astronaut Training, Habitat Testing, Geology, Solar Equipment.",
  },
  {
    patterns: [/death valley/i],
    answer:
      "🏜️ **Death Valley (USA)** — A hot, dry basin with ancient lakebeds and eroded hills. Ancient lake deposits closely resemble Mars' Jezero and Gale craters. Best for: Rover Testing, Geology, Surface Exploration. Note: much warmer than Mars.",
  },
  {
    patterns: [/haughton/i],
    answer:
      "💥 **Haughton Crater (Canada)** — A real 23 km asteroid impact crater on Devon Island in the high Arctic. Cold polar desert with ground ice and gullies. Best for: Astronaut Training, Geology, Surface Exploration, Habitat Testing.",
  },
  {
    patterns: [/hawaii/i],
    answer:
      "🌺 **Hawaii Volcanic Regions (USA)** — High barren volcano slopes on Mauna Kea and Mauna Loa with basaltic soil, cinder cones, and lava tubes. Used for habitat simulations. Best for: Rover Testing, Habitat Testing, Geology, Underground Exploration, Astronaut Training.",
  },
  {
    patterns: [/california|lava (field|bed)/i],
    answer:
      "🪨 **California Lava Fields (USA)** — Old basalt flows with over 700 lava-tube caves at Lava Beds National Monument. Best for: Underground Exploration, Rover Testing, Geology. Strength: caves (1.0), basalt (0.95).",
  },

  // ── Planets / Targets ──
  {
    patterns: [/shackleton/i],
    answer:
      "🌑 **Shackleton Crater (Moon)** — A deep crater at the lunar south pole whose floor never sees sunlight. Permanently shadowed regions may trap water ice — a key resource for future crews. Diameter ~21 km, depth ~4 km.",
  },
  {
    patterns: [/lunar south pole|moon.*south pole|south pole.*moon/i],
    answer:
      "🌑 **Lunar South Polar Region** — The wider polar area chosen for upcoming crewed landings (Artemis). Heavily cratered highlands with ridges, long shadows, and possible water ice in shadowed craters.",
  },
  {
    patterns: [/jezero/i],
    answer:
      "🔴 **Jezero Crater (Mars)** — An ancient lake with a river delta. Perseverance rover's landing site. Layered sediment, clays, and carbonates may preserve evidence of ancient microbial life. Diameter ~45 km.",
  },
  {
    patterns: [/gale/i],
    answer:
      "🔴 **Gale Crater (Mars)** — A huge crater (~154 km) with Mount Sharp — a 5 km layered mountain recording Mars' climate history. Explored by the Curiosity rover. Shows evidence of ancient lakes.",
  },
  {
    patterns: [/moon|lunar/i],
    answer:
      "🌕 **Moon** — Airless, dusty, and cratered. Gravity: 0.17g. Day: ~29.5 Earth days. The south pole may hold water ice for future bases. TERRANOVA targets: Shackleton Crater and Lunar South Polar Region.",
  },
  {
    patterns: [/mars|martian/i],
    answer:
      "🔴 **Mars** — A cold desert planet with ancient lakes, volcanoes, and canyons. Gravity: 0.38g. Day: 24h 37m. TERRANOVA targets: Jezero Crater and Gale Crater. Best Earth analogs: Atacama, Antarctica Dry Valleys.",
  },
  {
    patterns: [/earth/i],
    answer:
      "🌍 **Earth** — Our training ground! TERRANOVA tracks 7 Earth locations that partly mimic Moon or Mars environments. None fully copies low gravity, vacuum, or space radiation — but they're the best we've got.",
  },

  // ── Missions ──
  {
    patterns: [/mission.*type|type.*mission|what.*mission|list.*mission/i],
    answer:
      "TERRANOVA supports **7 mission types**:\n• 🤖 Rover Testing\n• 👨‍🚀 Astronaut Training\n• 🪨 Geological Research\n• 🏠 Habitat Testing\n• ☀️ Solar Equipment Testing\n• 🗺️ Surface Exploration\n• 🕳️ Underground Exploration",
  },
  {
    patterns: [/rover/i],
    answer:
      "🤖 **Rover Testing** — Focuses on roughness, regolith (loose soil), and slope. Best Earth analogs: Atacama Desert, Hawaii, California Lava Fields.",
  },
  {
    patterns: [/astronaut.*train|train.*astronaut/i],
    answer:
      "👨‍🚀 **Astronaut Training** — Focuses on cold, aridity, roughness, and extreme lighting. Best Earth analogs: Antarctica Dry Valleys, Haughton Crater.",
  },
  {
    patterns: [/geolog/i],
    answer:
      "🪨 **Geological Research** — Focuses on basalt, impact features, and sediment layers. Best Earth analogs: Iceland (basalt), Haughton (impact), Death Valley (sediment).",
  },
  {
    patterns: [/habitat/i],
    answer:
      "🏠 **Habitat Testing** — Focuses on cold, aridity, sterility, and caves. Best Earth analogs: Antarctica Dry Valleys, Hawaii, Haughton Crater.",
  },
  {
    patterns: [/solar/i],
    answer:
      "☀️ **Solar Equipment Testing** — Focuses on extreme lighting, regolith, and aridity. Best Earth analogs: Atacama Desert, Antarctica (polar lighting).",
  },
  {
    patterns: [/surface.*explor|explor.*surface/i],
    answer:
      "🗺️ **Surface Exploration** — Focuses on roughness, slope, impact features, and regolith. Best Earth analogs: Haughton Crater, Iceland, Atacama.",
  },
  {
    patterns: [/underground|cave|lava tube/i],
    answer:
      "🕳️ **Underground Exploration** — Focuses on caves and lava tubes. Best Earth analogs: California Lava Fields (caves: 1.0), Hawaii (caves: 0.8), Iceland (caves: 0.7).",
  },

  // ── Features / Traits ──
  {
    patterns: [/trait|feature|how.*score|score.*how|what.*rate|rate.*what/i],
    answer:
      "TERRANOVA rates each Earth location on **12 traits** (scale 0–1):\n• 💧 Dryness (aridity)\n• ❄️ Cold\n• 🪨 Surface roughness\n• ⛰️ Steep slopes\n• 🌋 Volcanic rock (basalt)\n• 💥 Impact features\n• 🧊 Ground ice\n• 🌫️ Loose dust & soil (regolith)\n• 🪸 Water-made rock (sediment)\n• 🔆 Extreme lighting\n• 🕳️ Caves & lava tubes\n• 🦠 Very little life (sterile)",
  },

  // ── AI Match ──
  {
    patterns: [/ai match|matching|how.*match|match.*work/i],
    answer:
      "🤖 The **AI Match** compares a planetary target's 12 trait ratings to each Earth site's ratings. Similarity = 1 − |target − site| per trait. Traits are weighted by mission importance. The final score is a weighted average — higher = more similar. Coverage and documentation quality give a confidence score.",
  },

  // ── PWA ──
  {
    patterns: [/install|pwa|home.*screen|app/i],
    answer:
      "📱 TERRANOVA is a **Progressive Web App (PWA)**! You can install it on your device: look for the install button in your browser's address bar (Chrome/Edge) or use the install banner that appears after a few seconds.",
  },

  // ── Data sources ──
  {
    patterns: [/data.*source|source.*data|dataset|nasa|lola|mola|crism|diviner|landsat|sentinel/i],
    answer:
      "📡 TERRANOVA references these data sources (not live-connected yet):\n• **LOLA** — Lunar elevation maps (NASA PDS)\n• **Diviner** — Lunar surface temperatures (NASA PDS)\n• **MOLA** — Mars elevation (NASA PDS)\n• **CRISM** — Mars mineral maps (NASA PDS)\n• **Landsat / MODIS / Sentinel** — Earth imagery\n• **Copernicus DEM** — Earth elevation model",
  },

  // ── Best site questions ──
  {
    patterns: [/best.*mars|most.*like.*mars|closest.*mars/i],
    answer:
      "🔴 The **best Earth analogs for Mars** are:\n1. **Atacama Desert** — ultra-dry, Mars-like soil, sterile\n2. **Antarctica Dry Valleys** — cold + dry, closest climate match\n3. **Iceland** — volcanic basalt similar to Martian plains\n4. **Death Valley** — ancient lake deposits like Jezero/Gale",
  },
  {
    patterns: [/best.*moon|most.*like.*moon|closest.*moon/i],
    answer:
      "🌕 The **best Earth analogs for the Moon** are:\n1. **Haughton Crater** — real impact crater, cold polar desert\n2. **Iceland** — basalt similar to lunar mare\n3. **Hawaii** — basaltic regolith, lava tubes\n4. **California Lava Fields** — extensive lava tube network",
  },
  {
    patterns: [/best.*rover|rover.*best/i],
    answer: "🤖 Best sites for **Rover Testing**: Atacama Desert (score ~85%), Hawaii (~78%), California Lava Fields (~72%). All have rough terrain and loose regolith.",
  },
  {
    patterns: [/driest|most.*dry|dry.*most/i],
    answer: "💧 The **driest** Earth analog in TERRANOVA is the **Atacama Desert** (aridity: 1.0 — the maximum). Antarctica Dry Valleys is a close second (aridity: 0.9).",
  },
  {
    patterns: [/coldest|most.*cold|cold.*most/i],
    answer: "❄️ The **coldest** Earth analog is **Antarctica Dry Valleys** (cold: 1.0 — the maximum), with a mean temperature of −20 °C. Haughton Crater is next (cold: 0.9).",
  },
  {
    patterns: [/most.*volcanic|volcanic.*most|most.*basalt/i],
    answer: "🌋 The most volcanic sites are **Iceland** and **Hawaii** (basalt: 1.0 each). California Lava Fields is close behind (basalt: 0.95).",
  },
  {
    patterns: [/most.*cave|cave.*most|best.*underground/i],
    answer: "🕳️ Best sites for caves/lava tubes: **California Lava Fields** (caves: 1.0), **Hawaii** (caves: 0.8), **Iceland** (caves: 0.7).",
  },
  {
    patterns: [/impact.*crater|crater.*impact/i],
    answer: "💥 Only one site has a real impact crater: **Haughton Crater** (impact: 1.0) — a 23 km asteroid impact on Devon Island, Canada.",
  },

  // ── Compare ──
  {
    patterns: [/compare|side.*by.*side|difference.*between/i],
    answer: "📊 Use the **Compare** page to put multiple Earth analog sites side by side. Go to the nav → Compare, or visit /compare. You can select up to 3+ sites and see all 12 traits at once.",
  },

  // ── Navigation help ──
  {
    patterns: [/where.*explore|explore.*page|how.*explore/i],
    answer: "🗺️ Go to the **Explore** page from the nav bar to browse Earth and planetary locations with filters by planet, environment, and more.",
  },
  {
    patterns: [/research|report|pdf|download/i],
    answer: "📄 The **Research** page lets you view saved analyses, download PDF reports of your AI Match results, and explore data sources and methodology.",
  },
  {
    patterns: [/analogs.*page|library|analog.*library/i],
    answer: "📚 The **Earth Analogs** page is your searchable library of all 7 analog locations. Filter by country, environment, terrain, or mission type.",
  },

  // ── Fallback ──
  {
    patterns: [/.*/],
    answer:
      "🤔 I'm not sure about that one. Try asking me about:\n• A specific location (e.g. \"Tell me about Iceland\")\n• A planet (\"What is Mars?\")\n• Mission types (\"What missions are there?\")\n• The AI matching (\"How does matching work?\")\n• Best sites (\"Best site for rover testing?\")",
  },
];

// ─── Engine ───────────────────────────────────────────────────────────────────

export function getBotResponse(input: string): string {
  const trimmed = input.trim();
  for (const entry of KB) {
    for (const pattern of entry.patterns) {
      if (pattern.test(trimmed)) {
        return entry.answer;
      }
    }
  }
  // Should never reach here because of the .* fallback, but just in case:
  return "I don't have an answer for that yet. Try asking about Earth analogs, missions, or planets!";
}

export const SUGGESTED_QUESTIONS = [
  "What is TERRANOVA?",
  "Best sites for Mars?",
  "Tell me about Atacama",
  "How does AI matching work?",
  "What missions are there?",
  "Best site for rover testing?",
  "What is Jezero crater?",
  "Coldest analog site?",
];
