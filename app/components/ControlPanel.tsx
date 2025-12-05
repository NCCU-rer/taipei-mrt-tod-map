"use client";

import React, { useState } from "react";
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
  Info,
  X,
} from "lucide-react";
import { LINES } from "../data/lines";

// 🔥 8項指標定義（確保 key 與 todDetails.ts 的 raw 欄位一致）
export const INDICATORS = [
  {
    id: "walk",
    label: "步行友善",
    key: "步行友善度", // ✅ 對應 raw.步行友善度
    icon: Footprints,
    description:
      "評估站點周邊的人行道品質、步行環境安全性及無障礙設施完善度。數值越高表示步行環境越友善，適合行人活動。",
  },
  {
    id: "bike",
    label: "自行車便利",
    key: "自行車便利度", // ✅ 對應 raw.自行車便利度
    icon: Bike,
    description:
      "衡量自行車道路網完整性、YouBike 站點密度及自行車停車設施。數值越高代表自行車使用越便利，有助於短程接駁。",
  },
  {
    id: "street",
    label: "街道連通",
    key: "街道連通度", // ✅ 對應 raw.街道連通度
    icon: Network,
    description:
      "分析街道路網的連結性與可達性，評估區域內移動的便利程度。高連通度表示街道系統發達，移動選擇多元。",
  },
  {
    id: "transit",
    label: "大眾運輸",
    key: "大眾運輸可達度", // ✅ 對應 raw.大眾運輸可達度
    icon: Bus,
    description:
      "評估公車站點密度、路線多樣性及轉乘便利性。數值越高表示大眾運輸系統越完善，能有效減少私人運具依賴。",
  },
  {
    id: "life",
    label: "生活機能",
    key: "生活機能多樣性", // ✅ 對應 raw.生活機能多樣性
    icon: ShoppingBag,
    description:
      "衡量商店、餐飲、醫療、教育等生活服務設施的種類與密度。高分代表日常生活需求能在步行範圍內滿足。",
  },
  {
    id: "density",
    label: "都市密度",
    key: "都市密度強度", // ✅ 對應 raw.都市密度強度
    icon: Building2,
    description:
      "評估建築密度、人口密度及土地使用強度。適當的都市密度能支撐大眾運輸系統，創造活躍的都市環境。",
  },
  {
    id: "integration",
    label: "區域整合",
    key: "區域整合度", // ✅ 對應 raw.區域整合度
    icon: MapPinned,
    description:
      "分析站點與周邊區域的整合程度，包含土地使用混合度及都市紋理連貫性。高整合度促進區域均衡發展。",
  },
  {
    id: "lowcar",
    label: "低汽車依賴",
    key: "低汽車依賴度", // ✅ 對應 raw.低汽車依賴度
    icon: CarFront,
    description:
      "評估減少私人汽車使用的環境條件，包含停車供給管制及替代運具可用性。數值越高表示越不需依賴私人汽車。",
  },
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
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<
    (typeof INDICATORS)[0] | null
  >(null);

  const toggleIndicator = (id: string) => {
    setSelectedIndicators((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id];
      // 🔥 確保至少選擇一個指標
      return newSelection.length > 0 ? newSelection : prev;
    });
  };

  // 全選/取消全選
  const toggleSelectAll = () => {
    if (selectedIndicators.length === INDICATORS.length) {
      // 取消全選時，保留第一個指標
      setSelectedIndicators([INDICATORS[0].id]);
    } else {
      // 全選所有指標
      setSelectedIndicators(INDICATORS.map((ind) => ind.id));
    }
  };

  // 顯示指標說明
  const showIndicatorInfo = (
    indicator: (typeof INDICATORS)[0],
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setSelectedInfo(indicator);
    setShowInfoModal(true);
  };

  return (
    <>
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

          {/* 單欄佈局 */}
          <div className="space-y-2 bg-gray-50 rounded-lg p-3">
            {INDICATORS.map((indicator) => {
              const IconComponent = indicator.icon;
              const isSelected = selectedIndicators.includes(indicator.id);
              return (
                <button
                  key={indicator.id}
                  onClick={() => toggleIndicator(indicator.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
                    isSelected
                      ? "bg-white shadow-sm border border-[#003d82]/20"
                      : "bg-gray-50 hover:bg-white border border-transparent"
                  }`}
                >
                  {/* 勾選框 */}
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-[#003d82] flex-shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  )}

                  {/* 圖示 */}
                  <IconComponent className="w-4 h-4 text-gray-400 flex-shrink-0" />

                  {/* 文字 */}
                  <span className="text-sm text-gray-700 font-medium flex-1 text-left">
                    {indicator.label}
                  </span>

                  {/* 說明按鈕 */}
                  <div
                    onClick={(e) => showIndicatorInfo(indicator, e)}
                    className="w-5 h-5 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer"
                    title="查看說明"
                  >
                    <Info className="w-3 h-3 text-[#003d82]" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 查看排名按鈕 */}
        <button
          onClick={onShowRanking}
          className="w-full px-4 py-3 bg-[#003d82] text-white rounded-lg text-sm font-medium hover:bg-[#002d5f] transition-colors shadow-sm hover:shadow-md transition-all"
        >
          查看排名
        </button>
      </div>

      {/* 🔥 指標說明 Modal */}
      {showInfoModal && selectedInfo && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
            onClick={() => setShowInfoModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 pointer-events-auto animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <selectedInfo.icon className="w-5 h-5 text-[#003d82]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {selectedInfo.label}
                    </h3>
                    <p className="text-xs text-gray-500">{selectedInfo.key}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedInfo.description}
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="px-4 py-2 bg-[#003d82] text-white rounded-lg text-sm font-medium hover:bg-[#002d5f] transition-colors"
                >
                  了解
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
