const COUNTRY_COLORS: Record<string, string> = {
  China: "#C8453B",
  USA: "#3D5A80",
  UK: "#1F3A5F",
  Russia: "#8A2E2E",
  Japan: "#BD3D44",
  Korea: "#0047A0",
  Colombia: "#E8B931",
  Israel: "#3F7CAC",
  France: "#1F4E79",
  Germany: "#3A3A3A",
  Italy: "#4A7A4F",
  India: "#E68F2A",
  Spain: "#C24D2C",
  Brazil: "#4A8B4F",
  Argentina: "#5BA0CF",
  Mexico: "#5C7C3A",
  Canada: "#A02A2A",
  Australia: "#1F3A5F",
  "New Zealand": "#1F3A5F",
  "South Africa": "#3A7A3A",
  Egypt: "#C8453B",
  Turkey: "#C8453B",
  Iran: "#3A7A3A",
  Nigeria: "#1F8E3A",
  Sweden: "#3F7CAC",
  Norway: "#1F3A5F",
  Finland: "#3F7CAC",
  Denmark: "#C8453B",
  Netherlands: "#E68F2A",
  Belgium: "#1F1F1F",
  Switzerland: "#C8453B",
  Portugal: "#3A7A3A",
  Greece: "#3F7CAC",
  Austria: "#C8453B",
  Poland: "#A02A2A",
  Czechia: "#1F3A5F",
  Ukraine: "#3F7CAC",
  Ireland: "#3A7A3A",
};

const FALLBACK_PALETTE = [
  "#7B6F6F",
  "#5A7C6F",
  "#7A5B5B",
  "#5B7A8C",
  "#8C7A5B",
  "#6F5B7A",
  "#5B8C7A",
  "#8C5B7A",
];

export function colorForCountry(country: string): string {
  const normalized = (country || "").trim();
  if (!normalized || normalized === "Unknown") return "#8A8071";
  if (COUNTRY_COLORS[normalized]) return COUNTRY_COLORS[normalized];
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 31 + normalized.charCodeAt(i)) | 0;
  }
  return FALLBACK_PALETTE[Math.abs(hash) % FALLBACK_PALETTE.length];
}

const COUNTRY_FLAGS: Record<string, string> = {
  China: "🇨🇳",
  USA: "🇺🇸",
  UK: "🇬🇧",
  Russia: "🇷🇺",
  Japan: "🇯🇵",
  Korea: "🇰🇷",
  Colombia: "🇨🇴",
  Israel: "🇮🇱",
  France: "🇫🇷",
  Germany: "🇩🇪",
  Italy: "🇮🇹",
  India: "🇮🇳",
  Spain: "🇪🇸",
  Brazil: "🇧🇷",
  Argentina: "🇦🇷",
  Mexico: "🇲🇽",
  Canada: "🇨🇦",
  Australia: "🇦🇺",
  "New Zealand": "🇳🇿",
  "South Africa": "🇿🇦",
  Egypt: "🇪🇬",
  Turkey: "🇹🇷",
  Iran: "🇮🇷",
  Nigeria: "🇳🇬",
  Sweden: "🇸🇪",
  Norway: "🇳🇴",
  Finland: "🇫🇮",
  Denmark: "🇩🇰",
  Netherlands: "🇳🇱",
  Belgium: "🇧🇪",
  Switzerland: "🇨🇭",
  Portugal: "🇵🇹",
  Greece: "🇬🇷",
  Austria: "🇦🇹",
  Poland: "🇵🇱",
  Czechia: "🇨🇿",
  Ukraine: "🇺🇦",
  Ireland: "🇮🇪",
};

export function flagFor(country: string): string {
  return COUNTRY_FLAGS[(country || "").trim()] ?? "🏳️";
}

const REGIONS: Array<{ name: string; countries: string[] }> = [
  {
    name: "East Asia",
    countries: ["China", "Japan", "Korea"],
  },
  {
    name: "South Asia & Middle East",
    countries: ["India", "Israel", "Turkey", "Iran"],
  },
  {
    name: "Europe",
    countries: [
      "UK",
      "France",
      "Germany",
      "Italy",
      "Spain",
      "Russia",
      "Sweden",
      "Norway",
      "Finland",
      "Denmark",
      "Netherlands",
      "Belgium",
      "Switzerland",
      "Portugal",
      "Greece",
      "Austria",
      "Poland",
      "Czechia",
      "Ukraine",
      "Ireland",
    ],
  },
  {
    name: "Americas",
    countries: [
      "USA",
      "Canada",
      "Mexico",
      "Colombia",
      "Brazil",
      "Argentina",
    ],
  },
  {
    name: "Africa",
    countries: ["South Africa", "Egypt", "Nigeria"],
  },
  {
    name: "Oceania",
    countries: ["Australia", "New Zealand"],
  },
];

export function regionFor(country: string): string {
  const normalized = (country || "").trim();
  for (const r of REGIONS) {
    if (r.countries.includes(normalized)) return r.name;
  }
  return "Other / Unknown";
}

export const REGION_ORDER = [
  "East Asia",
  "South Asia & Middle East",
  "Europe",
  "Americas",
  "Africa",
  "Oceania",
  "Other / Unknown",
];
