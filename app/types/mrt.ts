// 站名位置類型
export type LabelPosition =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "bottom-right";

// 站點資料結構定義
export interface StationData {
  id: string;
  name: string;
  x: number;
  y: number;
  labelPosition?: LabelPosition; // 可選的站名位置，預設為 bottom
  labelOffset?: { x: number; y: number }; // 可選的自定義偏移量
  lines?: string[]; // 🔥 添加這一行：站點所屬的路線列表
}

// 站點 TOD 資料結構
export type StationTodData = Record<string, Record<string, number>>;

// 路線資訊結構
export interface LineInfo {
  id: string;
  name: string;
  color: string;
}
