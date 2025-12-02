"use client";

import React from "react";
import {
  Calendar,
  MapPin,
  Train,
  Activity,
  BarChart3,
  CheckSquare,
  Square,
  Footprints,
  Bike,
  Network,
  Bus,
  ShoppingBag,
  Building2,
  MapPinned,
  CarFront,
} from "lucide-react";
import { LINES } from "../data/lines";

// 8項指標定義（加上圖示）
const INDICATORS = [
  { id: "walk", label: "步行友善", key: "步行友善度", icon: Footprints },
  { id: "bike", label: "自行車便利", key: "自行車便利度", icon: Bike },
  { id: "street", label: "街道連通", key: "街道連通度", icon: Network },
  { id: "transit", label: "大眾運輸", key: "大眾運輸可達度", icon: Bus },
  { id: "life", label: "生活機能", key: "生活機能多樣性", icon: ShoppingBag },
  { id: "density", label: "都市密度", key: "都市密度強度", icon: Building2 },
  { id: "integration", label: "區域整合", key: "區域整合度", icon: MapPinned },
  { id: "lowcar", label: "低汽車依賴", key: "低汽車依賴度", icon: CarFront },
];

// 顯示模式
type DisplayMode = "tod" | "price";

interface ControlPanelProps {
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedBuffer: string;
  setSelectedBuffer: (buffer: string) => void;
  selectedLine: string;
  setSelectedLine: (line: string) => void;
  selectedIndicators: string[];
  setSelectedIndicators: React.Dispatch<React.SetStateAction<string[]>>;
  onShowRanking: () => void;
}

export default function ControlPanel({
  displayMode,
  setDisplayMode,
  selectedYear,
  setSelectedYear,
  selectedBuffer,
  setSelectedBuffer,
  selectedLine,
  setSelectedLine,
  selectedIndicators,
  setSelectedIndicators,
  onShowRanking,
}: ControlPanelProps) {
  const toggleIndicator = (id: string) => {
    setSelectedIndicators((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id];
      return newSelection.length > 0 ? newSelection : prev;
    });
  };

  // 全選/取消全選
  const toggleSelectAll = () => {
    if (selectedIndicators.length === INDICATORS.length) {
      setSelectedIndicators([INDICATORS[0].id]);
    } else {
      setSelectedIndicators(INDICATORS.map((ind) => ind.id));
    }
  };

  return (
    <div className="space-y-5">
      {/* 顯示模式 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-[#003d82]" />
          <h3 className="text-sm font-bold text-gray-700">顯示模式</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setDisplayMode("tod")}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              displayMode === "tod"
                ? "bg-[#003d82] text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            TOD 指數
          </button>
          <button
            onClick={() => setDisplayMode("price")}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              displayMode === "price"
                ? "bg-[#c8102e] text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            房價 (萬/坪)
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200"></div>

      {/* 資料年度 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-[#003d82]" />
          <h3 className="text-sm font-bold text-gray-700">資料年度</h3>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
        >
          <option value="112">112 年度 (2023)</option>
          <option value="111">111 年度 (2022)</option>
          <option value="110">110 年度 (2021)</option>
        </select>
      </div>

      {/* 環域範圍 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-[#003d82]" />
          <h3 className="text-sm font-bold text-gray-700">環域範圍</h3>
        </div>
        <select
          value={selectedBuffer}
          onChange={(e) => setSelectedBuffer(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
        >
          <option value="150">150 公尺 (步行 2-3 分鐘)</option>
          <option value="300">300 公尺 (步行 4-5 分鐘)</option>
        </select>
      </div>

      {/* 捷運路線 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Train className="w-4 h-4 text-[#003d82]" />
          <h3 className="text-sm font-bold text-gray-700">捷運路線</h3>
        </div>
        <select
          value={selectedLine}
          onChange={(e) => setSelectedLine(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
        >
          <option value="all">所有路線</option>
          {LINES.filter((line) => line.id !== "Y").map((line) => (
            <option key={line.id} value={line.id}>
              {line.name}
            </option>
          ))}
        </select>
      </div>

      <div className="border-t border-gray-200"></div>

      {/* 指標篩選 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-[#003d82]" />
            <h3 className="text-sm font-bold text-gray-700">指標篩選</h3>
            <button
              onClick={toggleSelectAll}
              className="text-xs text-[#003d82] hover:text-[#0056b3] font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
            >
              {selectedIndicators.length === INDICATORS.length
                ? "取消全選"
                : "全選"}
            </button>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {selectedIndicators.length}/{INDICATORS.length}
          </span>
        </div>

        {/* 兩排四個的網格佈局 */}
        <div className="grid grid-cols-2 gap-2 bg-gray-50 rounded-lg p-3">
          {INDICATORS.map((indicator) => {
            const IconComponent = indicator.icon;
            return (
              <button
                key={indicator.id}
                onClick={() => toggleIndicator(indicator.id)}
                className={`flex items-center gap-2 p-2.5 rounded-md transition-all ${
                  selectedIndicators.includes(indicator.id)
                    ? "bg-white shadow-sm border border-[#003d82]/20"
                    : "bg-gray-50 hover:bg-white border border-transparent"
                }`}
              >
                {selectedIndicators.includes(indicator.id) ? (
                  <CheckSquare className="w-4 h-4 text-[#003d82] flex-shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-gray-300 flex-shrink-0" />
                )}
                <IconComponent className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-700 font-medium">
                  {indicator.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 查看排名按鈕 */}
      <button
        onClick={onShowRanking}
        className="w-full px-4 py-3 bg-[#003d82] text-white rounded-lg text-sm font-medium hover:bg-[#002d5f] transition-colors"
      >
        查看排名
      </button>
    </div>
  );
}

export { INDICATORS };
