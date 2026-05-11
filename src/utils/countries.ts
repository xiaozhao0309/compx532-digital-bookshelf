const COUNTRY_COLORS: Record<string, string> = {
  中国: "#C8453B",
  美国: "#3D5A80",
  英国: "#1F3A5F",
  俄罗斯: "#8A2E2E",
  日本: "#BD3D44",
  韩国: "#0047A0",
  哥伦比亚: "#E8B931",
  以色列: "#3F7CAC",
  法国: "#1F4E79",
  德国: "#3A3A3A",
  意大利: "#4A7A4F",
  印度: "#E68F2A",
  西班牙: "#C24D2C",
  巴西: "#4A8B4F",
  阿根廷: "#5BA0CF",
  墨西哥: "#5C7C3A",
  加拿大: "#A02A2A",
  澳大利亚: "#1F3A5F",
  新西兰: "#1F3A5F",
  南非: "#3A7A3A",
  埃及: "#C8453B",
  土耳其: "#C8453B",
  伊朗: "#3A7A3A",
  尼日利亚: "#1F8E3A",
  瑞典: "#3F7CAC",
  挪威: "#1F3A5F",
  芬兰: "#3F7CAC",
  丹麦: "#C8453B",
  荷兰: "#E68F2A",
  比利时: "#1F1F1F",
  瑞士: "#C8453B",
  葡萄牙: "#3A7A3A",
  希腊: "#3F7CAC",
  奥地利: "#C8453B",
  波兰: "#A02A2A",
  捷克: "#1F3A5F",
  乌克兰: "#3F7CAC",
  爱尔兰: "#3A7A3A",
  芬: "#3F7CAC",
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
  if (!normalized || normalized === "未知") return "#8A8071";
  if (COUNTRY_COLORS[normalized]) return COUNTRY_COLORS[normalized];
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 31 + normalized.charCodeAt(i)) | 0;
  }
  return FALLBACK_PALETTE[Math.abs(hash) % FALLBACK_PALETTE.length];
}

const COUNTRY_FLAGS: Record<string, string> = {
  中国: "🇨🇳",
  美国: "🇺🇸",
  英国: "🇬🇧",
  俄罗斯: "🇷🇺",
  日本: "🇯🇵",
  韩国: "🇰🇷",
  哥伦比亚: "🇨🇴",
  以色列: "🇮🇱",
  法国: "🇫🇷",
  德国: "🇩🇪",
  意大利: "🇮🇹",
  印度: "🇮🇳",
  西班牙: "🇪🇸",
  巴西: "🇧🇷",
  阿根廷: "🇦🇷",
  墨西哥: "🇲🇽",
  加拿大: "🇨🇦",
  澳大利亚: "🇦🇺",
  新西兰: "🇳🇿",
  南非: "🇿🇦",
  埃及: "🇪🇬",
  土耳其: "🇹🇷",
  伊朗: "🇮🇷",
  尼日利亚: "🇳🇬",
  瑞典: "🇸🇪",
  挪威: "🇳🇴",
  芬兰: "🇫🇮",
  丹麦: "🇩🇰",
  荷兰: "🇳🇱",
  比利时: "🇧🇪",
  瑞士: "🇨🇭",
  葡萄牙: "🇵🇹",
  希腊: "🇬🇷",
  奥地利: "🇦🇹",
  波兰: "🇵🇱",
  捷克: "🇨🇿",
  乌克兰: "🇺🇦",
  爱尔兰: "🇮🇪",
};

export function flagFor(country: string): string {
  return COUNTRY_FLAGS[(country || "").trim()] ?? "🏳️";
}

const REGIONS: Array<{ name: string; countries: string[] }> = [
  {
    name: "东亚",
    countries: ["中国", "日本", "韩国"],
  },
  {
    name: "南亚 / 中东",
    countries: ["印度", "以色列", "土耳其", "伊朗"],
  },
  {
    name: "欧洲",
    countries: [
      "英国",
      "法国",
      "德国",
      "意大利",
      "西班牙",
      "俄罗斯",
      "瑞典",
      "挪威",
      "芬兰",
      "丹麦",
      "荷兰",
      "比利时",
      "瑞士",
      "葡萄牙",
      "希腊",
      "奥地利",
      "波兰",
      "捷克",
      "乌克兰",
      "爱尔兰",
    ],
  },
  {
    name: "美洲",
    countries: [
      "美国",
      "加拿大",
      "墨西哥",
      "哥伦比亚",
      "巴西",
      "阿根廷",
    ],
  },
  {
    name: "非洲",
    countries: ["南非", "埃及", "尼日利亚"],
  },
  {
    name: "大洋洲",
    countries: ["澳大利亚", "新西兰"],
  },
];

export function regionFor(country: string): string {
  const normalized = (country || "").trim();
  for (const r of REGIONS) {
    if (r.countries.includes(normalized)) return r.name;
  }
  return "其他 / 未知";
}

export const REGION_ORDER = [
  "东亚",
  "南亚 / 中东",
  "欧洲",
  "美洲",
  "非洲",
  "大洋洲",
  "其他 / 未知",
];
