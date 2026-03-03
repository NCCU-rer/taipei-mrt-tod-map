"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  X,
  Award,
  Info,
  ChevronLeft,
  ChevronRight,
  Train,
  ArrowUpDown,
} from "lucide-react";
import { LINES } from "../data/lines";

// --- 介面定義 ---

interface RankingData {
  name: string;
  score: number;
  rank: number;
  stationId: string;
  color: string;
  colors?: string[];
  price: string | null;
  lines?: string[];
}

interface RankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rankingData: RankingData[];
  selectedIndicators: string[];
  indicatorLabels: string[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onBarClick: (data: BarClickData) => void;
  onCompareStations?: (stationIds: string[]) => void;
}

interface BarClickData {
  stationId: string;
  [key: string]: unknown;
}

interface ChartDataItem extends RankingData {
  priceValue: number | null;
}

interface CustomBarProps {
  fill?: string | string[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: ChartDataItem;
  [key: string]: unknown;
}

interface TooltipPayload {
  payload: ChartDataItem;
  dataKey?: string;
  name?: string;
  value?: number;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

// --- Helper Components & Functions ---

// 🔥 自訂 Tooltip
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }
  const data = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg z-50">
      <p className="font-bold text-gray-800 mb-2">{data.name}</p>
      <div className="space-y-1 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-600">排名：</span>
          <span className="font-bold text-[#c8102e]">#{data.rank}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-600">綜合分數：</span>
          <span className="font-bold text-[#003d82]">
            {data.score.toFixed(1)}
          </span>
        </div>
        {data.priceValue && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-600">平均單價：</span>
            <span className="font-bold text-gray-900">{data.price} 萬/坪</span>
          </div>
        )}
      </div>
    </div>
  );
};

// 🔥 自訂長條圖形狀 (支援單色與雙色分割)
const CustomBar: React.FC<CustomBarProps> = (props) => {
  const { fill, x, y, width, height } = props;

  if (
    !fill ||
    x === undefined ||
    y === undefined ||
    width === undefined ||
    height === undefined
  ) {
    return null;
  }

  // 處理顏色字串 (逗號分隔代表多色)
  let colors: string[];
  if (typeof fill === "string" && fill.includes(",")) {
    colors = fill.split(",");
  } else if (typeof fill === "string") {
    colors = [fill];
  } else if (Array.isArray(fill)) {
    colors = fill;
  } else {
    return null;
  }

  const filteredColors = colors.filter((c) => c);
  if (filteredColors.length === 0) return null;

  const radius = 8; // 圓角大小

  // 雙色處理 (轉乘站)
  if (filteredColors.length === 2) {
    const halfWidth = width / 2;
    return (
      <g>
        <path
          d={`
            M ${x} ${y + height}
            L ${x} ${y + radius}
            Q ${x} ${y} ${x + radius} ${y}
            L ${x + halfWidth} ${y}
            L ${x + halfWidth} ${y + height}
            Z
          `}
          fill={filteredColors[0]}
        />
        <path
          d={`
            M ${x + halfWidth} ${y}
            L ${x + width - radius} ${y}
            Q ${x + width} ${y} ${x + width} ${y + radius}
            L ${x + width} ${y + height}
            L ${x + halfWidth} ${y + height}
            Z
          `}
          fill={filteredColors[1]}
        />
      </g>
    );
  } else {
    // 單色處理
    return (
      <path
        d={`
          M ${x} ${y + height}
          L ${x} ${y + radius}
          Q ${x} ${y} ${x + radius} ${y}
          L ${x + width - radius} ${y}
          Q ${x + width} ${y} ${x + width} ${y + radius}
          L ${x + width} ${y + height}
          Z
        `}
        fill={filteredColors[0]}
      />
    );
  }
};

// --- 主元件 ---

export default function RankingModal({
  isOpen,
  onClose,
  rankingData,
  selectedIndicators,
  indicatorLabels,
  currentPage,
  totalPages,
  itemsPerPage,
  onPrevPage,
  onNextPage,
  onBarClick,
  onCompareStations,
}: RankingModalProps) {
  const [selectedLineFilter, setSelectedLineFilter] = useState<string>("all");
  const [internalPage, setInternalPage] = useState(0);

  // 比對模式狀態
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedStations, setSelectedStations] = useState<string[]>([]);

  // 手機版偵測
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const effectiveItemsPerPage = isMobile ? 8 : itemsPerPage;

  // 資料篩選邏輯
  const filteredData = useMemo<RankingData[]>(
    () =>
      selectedLineFilter === "all"
        ? rankingData
        : rankingData.filter((item) => {
          // 判斷是否屬於該路線
          if (item.lines && item.lines.length > 0) {
            return item.lines.includes(selectedLineFilter);
          }
          if (selectedLineFilter === "BR" && item.stationId.startsWith("BR"))
            return true;
          if (
            selectedLineFilter === "R" &&
            item.stationId.startsWith("R") &&
            !item.stationId.startsWith("BR")
          )
            return true;
          if (selectedLineFilter === "G" && item.stationId.startsWith("G"))
            return true;
          if (selectedLineFilter === "O" && item.stationId.startsWith("O"))
            return true;
          if (selectedLineFilter === "BL" && item.stationId.startsWith("BL"))
            return true;
          if (selectedLineFilter === "Y" && item.stationId.startsWith("Y"))
            return true;
          return false;
        }),
    [rankingData, selectedLineFilter]
  );

  const filteredTotalPages = Math.ceil(
    filteredData.length / effectiveItemsPerPage
  );

  const currentPageData = useMemo<RankingData[]>(
    () =>
      filteredData.slice(
        internalPage * effectiveItemsPerPage,
        (internalPage + 1) * effectiveItemsPerPage
      ),
    [filteredData, internalPage, effectiveItemsPerPage]
  );

  const chartData = useMemo<ChartDataItem[]>(
    () =>
      currentPageData.map((item) => ({
        ...item,
        priceValue: item.price ? parseFloat(item.price) : null,
      })),
    [currentPageData]
  );

  // 計算分數範圍以優化 Y 軸顯示
  const scoreRange = useMemo(() => {
    if (chartData.length === 0) return { min: 0, max: 100 };
    const scores = chartData.map((item) => item.score);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const padding = (maxScore - minScore) * 0.1;
    return {
      min: Math.max(0, Math.floor(minScore - padding)),
      max: Math.ceil(maxScore + padding),
    };
  }, [chartData]);

  // 重置邏輯
  useEffect(() => {
    setInternalPage(0);
  }, [selectedLineFilter]);

  useEffect(() => {
    if (isOpen) {
      setInternalPage(0);
      setSelectedLineFilter("all");
      setComparisonMode(false);
      setSelectedStations([]);
    }
  }, [isOpen]);

  const handlePrevPage = () => {
    if (internalPage > 0) {
      setInternalPage(internalPage - 1);
    }
  };

  const handleNextPage = () => {
    if (internalPage < filteredTotalPages - 1) {
      setInternalPage(internalPage + 1);
    }
  };

  // 🔥 處理站點選擇（比對模式 vs 一般模式）
  const handleStationSelect = (stationId: string) => {
    if (!comparisonMode) {
      onBarClick({ stationId });
      return;
    }
    setSelectedStations((prev) => {
      if (prev.includes(stationId)) {
        return prev.filter((id) => id !== stationId);
      } else {
        if (prev.length < 3) {
          return [...prev, stationId];
        }
        return prev;
      }
    });
  };

  const handleStartComparison = () => {
    if (onCompareStations && selectedStations.length >= 2) {
      onCompareStations(selectedStations);
      onClose();
    }
  };

  // 🔥 計算長條顏色（含比對模式的淡化邏輯）
  const getCellFill = (entry: ChartDataItem) => {
    // 1. 取得基礎顏色
    let baseColors: string[] = [];
    if (selectedLineFilter !== "all" && entry.lines) {
      // 若有篩選路線，優先顯示該路線顏色
      const line = LINES.find((l) => l.id === selectedLineFilter);
      baseColors = [line?.color || entry.color];
    } else {
      baseColors =
        entry.colors && entry.colors.length > 1 ? entry.colors : [entry.color];
    }

    // 2. 判斷是否需要淡化 (Dimming)
    // 規則：如果在比對模式下，且已選擇至少一個站點，則「未被選中的站點」要變淡
    const isSelected = selectedStations.includes(entry.stationId);
    const shouldDim =
      comparisonMode && selectedStations.length > 0 && !isSelected;

    const finalColors = baseColors.map((c) => {
      if (c.startsWith("#")) {
        const r = parseInt(c.slice(1, 3), 16);
        const g = parseInt(c.slice(3, 5), 16);
        const b = parseInt(c.slice(5, 7), 16);
        // 如果要淡化，透明度設為 0.2
        return shouldDim ? `rgba(${r}, ${g}, ${b}, 0.2)` : c;
      }
      return c;
    });

    // 如果有多個顏色，組合成逗號分隔字串傳給 CustomBar
    return finalColors.length > 1 ? finalColors.join(",") : finalColors[0];
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal 容器 (使用 relative 以便放置懸浮底座) */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 pointer-events-none">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] md:max-h-[90vh] overflow-hidden pointer-events-auto animate-in zoom-in-95 duration-200 flex flex-col relative">
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-gray-200 bg-[#003d82] flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-white" />
                <div>
                  <h2 className="text-xl font-bold text-white">站點排名</h2>
                  <p className="text-xs text-blue-200">
                    第 {internalPage + 1} / {filteredTotalPages} 頁
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* 🔥 Header 上的比對模式切換按鈕 */}
                {onCompareStations && (
                  <button
                    onClick={() => {
                      setComparisonMode(!comparisonMode);
                      setSelectedStations([]);
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all border ${comparisonMode
                      ? "bg-white text-[#003d82] border-white"
                      : "bg-[#003d82] text-white border-blue-400 hover:bg-[#002d5f]"
                      }`}
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    {comparisonMode ? "退出比對" : "站點比對"}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* 內容區 - 可捲動 */}
          {/* pb-24 是為了預留底部懸浮底座的空間，避免內容被遮擋 */}
          <div className="flex-1 overflow-y-auto p-3 md:p-6 bg-gray-50 pb-24 relative">
            {/* 指標資訊 */}
            <div className="mb-4 p-3 bg-white rounded-lg border border-gray-100 shadow-sm flex items-start gap-2">
              <Info className="w-4 h-4 text-[#003d82] mt-0.5 flex-shrink-0" />
              <div className="text-xs text-gray-600">
                當前排序指標：
                <span className="font-bold text-[#003d82]">
                  {indicatorLabels.join("、")}
                </span>
              </div>
            </div>

            {/* 路線篩選器 */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedLineFilter("all")}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedLineFilter === "all"
                    ? "bg-[#003d82] text-white shadow-md ring-2 ring-blue-100"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  所有路線
                </button>
                {LINES.filter((line) => line.id !== "Y").map((line) => (
                  <button
                    key={line.id}
                    onClick={() => setSelectedLineFilter(line.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedLineFilter === line.id
                      ? "text-white shadow-md ring-2 ring-opacity-50"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                      }`}
                    style={{
                      backgroundColor:
                        selectedLineFilter === line.id ? line.color : undefined,
                      borderColor:
                        selectedLineFilter === line.id ? line.color : undefined,
                      // @ts-ignore
                      ["--tw-ring-color"]: line.color,
                    }}
                  >
                    {line.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 圖表區域 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 relative">
              {/* 圖表標題列 */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  綜合分數 vs 房價
                  {comparisonMode && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded animate-pulse">
                      請點擊長條圖選擇
                    </span>
                  )}
                </h3>
                {/* 翻頁器 (縮小版) */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={internalPage === 0}
                    className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono text-gray-500">
                    {internalPage + 1}/{filteredTotalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={internalPage >= filteredTotalPages - 1}
                    className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="w-full h-[400px] md:h-[500px]">
                {filteredData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={chartData}
                      margin={{
                        top: 20,
                        right: isMobile ? 0 : 20,
                        left: 0,
                        bottom: 60,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f3f4f6"
                      />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                        tick={{ fontSize: 11, fill: "#6b7280" }}
                      />
                      <YAxis
                        yAxisId="left"
                        domain={[scoreRange.min, scoreRange.max]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: "rgba(0,0,0,0.03)" }}
                      />

                      {/* 分數長條 */}
                      <Bar
                        yAxisId="left"
                        dataKey="score"
                        cursor={comparisonMode ? "cell" : "pointer"} // 游標樣式變化
                        onClick={(data: any) => {
                          if (data?.payload?.stationId)
                            handleStationSelect(data.payload.stationId);
                        }}
                        shape={<CustomBar />}
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={getCellFill(entry)}
                            stroke={
                              selectedStations.includes(entry.stationId)
                                ? "#000"
                                : "none"
                            }
                            strokeWidth={
                              selectedStations.includes(entry.stationId) ? 2 : 0
                            }
                            style={{ transition: "fill 0.3s ease" }} // 增加顏色過渡動畫
                          />
                        ))}
                      </Bar>

                      {/* 房價折線 */}
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="priceValue"
                        stroke="#374151"
                        strokeWidth={2}
                        dot={{ fill: "#374151", r: 3 }}
                        activeDot={{ r: 5 }}
                        opacity={comparisonMode ? 0.3 : 1} // 比對模式下淡化折線，專注於選站
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Train className="w-10 h-10 mb-2 opacity-20" />
                    <p>無符合資料</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 🔥 懸浮操作底座 (Floating Dock) - 僅在比對模式顯示 */}
          {comparisonMode && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[600px] bg-white rounded-2xl shadow-xl border border-gray-200 p-4 animate-in slide-in-from-bottom-10 fade-in duration-300 z-10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-[#003d82] text-white rounded-full text-xs font-bold">
                    {selectedStations.length}
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    已選擇站點 (最多 3 站)
                  </span>
                </div>
                {selectedStations.length > 0 && (
                  <button
                    onClick={() => setSelectedStations([])}
                    className="text-xs text-gray-500 hover:text-red-500"
                  >
                    清空
                  </button>
                )}
              </div>

              {/* 已選站點 Chips */}
              <div className="flex items-center gap-2 min-h-[32px]">
                {selectedStations.length === 0 ? (
                  <span className="text-xs text-gray-400 italic">
                    請點擊上方長條圖選擇站點...
                  </span>
                ) : (
                  selectedStations.map((id) => {
                    const st = rankingData.find((s) => s.stationId === id);
                    return (
                      <div
                        key={id}
                        className="flex items-center gap-1 bg-blue-50 text-[#003d82] px-2 py-1 rounded-lg text-xs font-bold border border-blue-100 animate-in zoom-in"
                      >
                        {st?.name}
                        <button
                          onClick={() => handleStationSelect(id)}
                          className="hover:bg-blue-100 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => {
                    setComparisonMode(false);
                    setSelectedStations([]);
                  }}
                  className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleStartComparison}
                  disabled={selectedStations.length < 2}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold text-white shadow-md transition-all ${selectedStations.length < 2
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#003d82] hover:bg-[#002d5f] hover:scale-[1.02]"
                    }`}
                >
                  開始比對 ({selectedStations.length}/3)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
