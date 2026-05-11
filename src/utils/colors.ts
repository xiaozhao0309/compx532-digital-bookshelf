const CATEGORY_PALETTE = [
  "#8B5A3C", // warm brown
  "#3E5C76", // muted indigo
  "#6B4226", // mahogany
  "#5B7C5B", // sage green
  "#A85C5C", // brick red
  "#4A6C8F", // dusty blue
  "#7D6B4F", // tobacco
  "#6E5A8C", // dusty purple
  "#A87F5C", // tan
  "#4F7C7C", // teal
  "#8C6F5C", // taupe
  "#6F8C5B", // olive
];

export function colorForCategory(category: string): string {
  if (!category) return "#7D6B4F";
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash * 31 + category.charCodeAt(i)) | 0;
  }
  return CATEGORY_PALETTE[Math.abs(hash) % CATEGORY_PALETTE.length];
}

export function spineWidthFor(totalPages?: number): number {
  if (!totalPages || totalPages <= 0) return 36;
  const w = 26 + Math.min(totalPages / 30, 20);
  return Math.round(w);
}
