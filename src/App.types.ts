export type FocusDim = "country" | "category" | "decade" | "status";

export interface Focus {
  dim: FocusDim;
  value: string;
}
