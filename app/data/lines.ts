import { LineInfo } from "../types/mrt";

// 路線名稱與顏色對應
export const LINES: LineInfo[] = [
  { id: "BR", name: "文湖線", color: "#aa753f" },
  { id: "R", name: "淡水信義線", color: "#d12d33" },
  { id: "G", name: "松山新店線", color: "#007c59" },
  { id: "O", name: "中和新蘆線", color: "#fca311" },
  { id: "BL", name: "板南線", color: "#0072c6" },
  { id: "Y", name: "環狀線", color: "#cce226" },
];

// 顏色輔助函式
export const getLineColor = (stationId: string): string => {
  if (stationId.startsWith("R")) return "#d12d33"; // 紅線
  if (stationId.startsWith("BL")) return "#0072c6"; // 藍線
  if (stationId.startsWith("G")) return "#007c59"; // 綠線
  if (stationId.startsWith("O")) return "#fca311"; // 橘線
  if (stationId.startsWith("BR")) return "#aa753f"; // 棕線
  return "#999"; // 預設
};
