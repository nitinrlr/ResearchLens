/** The colors a collection can have. `ink` is the icon color drawn on top. */
export const COLLECTION_COLORS = {
  red: { label: "Red", fill: "#e5484d", ink: "#ffffff" },
  orange: { label: "Orange", fill: "#f76b15", ink: "#ffffff" },
  yellow: { label: "Yellow", fill: "#ffd60a", ink: "#1c1c1c" },
  green: { label: "Green", fill: "#30a46c", ink: "#ffffff" },
  lightBlue: { label: "Light blue", fill: "#7cc4fa", ink: "#0b1c3d" },
  darkBlue: { label: "Dark blue", fill: "#3e63dd", ink: "#ffffff" },
  purple: { label: "Purple", fill: "#8e4ec6", ink: "#ffffff" },
  pink: { label: "Pink", fill: "#e93d82", ink: "#ffffff" },
  white: { label: "White", fill: "#f5f6fa", ink: "#1c1c1c" },
  black: { label: "Black", fill: "#111216", ink: "#ffffff" },
} as const;

export type CollectionColor = keyof typeof COLLECTION_COLORS;

export const DEFAULT_COLLECTION_COLOR: CollectionColor = "darkBlue";

export function isCollectionColor(value: unknown): value is CollectionColor {
  return typeof value === "string" && Object.hasOwn(COLLECTION_COLORS, value);
}

/** A stored color, or the default if it's missing or no longer offered. */
export function collectionColor(value: string | null | undefined) {
  return COLLECTION_COLORS[isCollectionColor(value) ? value : DEFAULT_COLLECTION_COLOR];
}
