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
  Legend,
} from "recharts";
import {
  X,
  Award,
  Info,
  ChevronLeft,
  ChevronRight,
  Train,
  ArrowUpDown,
  Check,
} from "lucide-react";
import { LINES } from "../data/lines";

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

// 🔥 長條圖點擊資料類型
interface BarClickData {
  stationId: string;
  [key: string]: unknown;
}

// 🔥 圖表資料類型
interface ChartDataItem extends RankingData {
  priceValue: number | null;
}

// 🔥 自訂長條圖 Props 類型
interface CustomBarProps {
  fill?: string | string[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: ChartDataItem;
  [key: string]: unknown;
}

// 🔥 Tooltip Payload 類型
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

// 🔥 自訂 Tooltip - 同時顯示分數和房價
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
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

// 判斷站點是否屬於指定路線（支援轉乘站）
const stationBelongsToLine = (
  station: RankingData,
  lineId: string
): boolean => {
  if (station.lines && station.lines.length > 0) {
    return station.lines.includes(lineId);
  }

  if (lineId === "BR") {
    return station.stationId.startsWith("BR");
  }
  if (lineId === "R") {
    return (
      station.stationId.startsWith("R") && !station.stationId.startsWith("BR")
    );
  }
  if (lineId === "G") {
    return station.stationId.startsWith("G");
  }
  if (lineId === "O") {
    return station.stationId.startsWith("O");
  }
  if (lineId === "BL") {
    return station.stationId.startsWith("BL");
  }
  if (lineId === "Y") {
    return station.stationId.startsWith("Y");
  }

  return false;
};

// 取得站點的顯示顏色（根據篩選路線）
const getDisplayColor = (
  station: RankingData,
  selectedLineFilter: string
): string => {
  if (selectedLineFilter !== "all" && station.lines) {
    const line = LINES.find((l) => l.id === selectedLineFilter);
    return line?.color || station.color;
  }
  return station.color;
};

// 取得站點的所有顏色（用於分半顯示）
const getDisplayColors = (
  station: RankingData,
  selectedLineFilter: string
): string[] => {
  if (
    selectedLineFilter === "all" &&
    station.colors &&
    station.colors.length > 1
  ) {
    return station.colors;
  }
  return [getDisplayColor(station, selectedLineFilter)];
};

// 🎨 將顏色轉換為帶透明度的版本
const addOpacityToColor = (color: string, opacity: number = 0.75): string => {
  if (!color || typeof color !== "string") {
    return `rgba(128, 128, 128, ${opacity})`;
  }

  if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return color;
};

// 🔥 自訂長條圖形狀 - 支援分半顏色 + 透明度
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

  // 🔥 處理逗號分隔的顏色字串
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

  const filteredColors = colors
    .filter((c) => c)
    .map((c) => addOpacityToColor(c, 0.75));

  if (filteredColors.length === 0) {
    return null;
  }

  const radius = 8;

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
  } else if (filteredColors.length === 3) {
    const thirdWidth = width / 3;
    return (
      <g>
        <path
          d={`
            M ${x} ${y + height}
            L ${x} ${y + radius}
            Q ${x} ${y} ${x + radius} ${y}
            L ${x + thirdWidth} ${y}
            L ${x + thirdWidth} ${y + height}
            Z
          `}
          fill={filteredColors[0]}
        />
        <rect
          x={x + thirdWidth}
          y={y}
          width={thirdWidth}
          height={height}
          fill={filteredColors[1]}
        />
        <path
          d={`
            M ${x + thirdWidth * 2} ${y}
            L ${x + width - radius} ${y}
            Q ${x + width} ${y} ${x + width} ${y + radius}
            L ${x + width} ${y + height}
            L ${x + thirdWidth * 2} ${y + height}
            Z
          `}
          fill={filteredColors[2]}
        />
      </g>
    );
  } else {
    const fillWithOpacity = addOpacityToColor(filteredColors[0], 0.75);
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
        fill={fillWithOpacity}
      />
    );
  }
};

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

  // 🔥 比對模式狀態
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedStations, setSelectedStations] = useState<string[]>([]);

  // 🔥 檢測是否為手機版
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 🔥 根據設備類型決定每頁顯示數量
  const effectiveItemsPerPage = isMobile ? 8 : itemsPerPage;

  // 根據路線篩選資料
  const filteredData = useMemo<RankingData[]>(
    () =>
      selectedLineFilter === "all"
        ? rankingData
        : rankingData.filter((item) =>
            stationBelongsToLine(item, selectedLineFilter)
          ),
    [rankingData, selectedLineFilter]
  );

  // 🔥 重新計算分頁（使用動態 itemsPerPage）
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

  // 🔥 準備合併圖表資料
  const chartData = useMemo<ChartDataItem[]>(
    () =>
      currentPageData.map((item) => ({
        ...item,
        priceValue: item.price ? parseFloat(item.price) : null,
      })),
    [currentPageData]
  );

  // 🔥 動態計算 Y 軸範圍（分數）
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

  // 計算有房價資料的站點數量
  const priceCount = useMemo(
    () => chartData.filter((item) => item.priceValue !== null).length,
    [chartData]
  );

  // 🔥 路線切換時重置頁碼
  useEffect(() => {
    setInternalPage(0);
  }, [selectedLineFilter]);

  // 🔥 每次打開視窗時重置到第一頁
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

  // 🔥 處理站點選擇
  const handleStationSelect = (stationId: string) => {
    if (!comparisonMode) {
      onBarClick({ stationId });
      return;
    }

    setSelectedStations((prev) => {
      if (prev.includes(stationId)) {
        return prev.filter((id) => id !== stationId);
      } else if (prev.length < 3) {
        return [...prev, stationId];
      }
      return prev;
    });
  };

  // 🔥 開始比對
  const handleStartComparison = () => {
    if (onCompareStations && selectedStations.length >= 2) {
      onCompareStations(selectedStations);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal 內容 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 pointer-events-none">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] md:max-h-[90vh] overflow-hidden pointer-events-auto animate-in zoom-in-95 duration-200">
          {/* 標題列 */}
          <div className="p-4 md:p-6 border-b border-gray-200 bg-[#003d82]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <Award className="w-5 h-5 md:w-6 md:h-6 text-white" />
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white">
                    站點排名 (第 {internalPage + 1} / {filteredTotalPages} 頁)
                  </h2>
                  {isMobile && (
                    <p className="text-xs text-blue-200 mt-1">
                      手機版每頁顯示 {effectiveItemsPerPage} 站
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* 內容區 */}
          <div
            className="p-3 md:p-6 overflow-y-auto"
            style={{ maxHeight: "calc(95vh - 100px)" }}
          >
            {/* 選定指標說明 */}
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-[#003d82] mt-0.5 flex-shrink-0" />
                <div className="text-xs md:text-sm text-[#003d82]">
                  <span className="font-bold">選定指標：</span>
                  {indicatorLabels.join("、")}
                </div>
              </div>
            </div>

            {/* 🔥 比對模式控制區 */}
            {onCompareStations && (
              <div className="mb-4 p-4 bg-white rounded-lg border-2 border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <ArrowUpDown className="w-5 h-5 text-[#003d82]" />
                    <div>
                      <h3 className="text-sm font-bold text-gray-800">
                        站點比對模式
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        點擊圖表選擇站點（最多 3 站）
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setComparisonMode(!comparisonMode);
                      setSelectedStations([]);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      comparisonMode
                        ? "bg-[#003d82] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {comparisonMode ? "取消選擇" : "開始選擇"}
                  </button>
                </div>

                {/* 🔥 已選站點顯示 */}
                {comparisonMode && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-gray-600">
                          已選 {selectedStations.length} / 3 站
                        </span>
                        {selectedStations.length > 0 && (
                          <button
                            onClick={() => setSelectedStations([])}
                            className="text-xs text-gray-500 hover:text-red-600 transition-colors"
                          >
                            清除
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedStations.map((stationId, index) => {
                          const station = rankingData.find(
                            (s) => s.stationId === stationId
                          );
                          return (
                            <div
                              key={stationId}
                              className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5"
                            >
                              <span className="w-5 h-5 rounded-full bg-[#003d82] text-white text-xs font-bold flex items-center justify-center">
                                {index + 1}
                              </span>
                              <span className="text-sm font-medium text-gray-700">
                                {station?.name}
                              </span>
                              <button
                                onClick={() => handleStationSelect(stationId)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {selectedStations.length >= 2 && (
                      <button
                        onClick={handleStartComparison}
                        className="px-6 py-2.5 bg-[#003d82] text-white rounded-lg text-sm font-bold hover:bg-[#002d5f] transition-colors shadow-md"
                      >
                        開始比對
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 路線篩選器 */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Train className="w-4 h-4 text-[#003d82]" />
                <h3 className="text-sm font-bold text-gray-700">篩選路線</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {filteredData.length} 站
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedLineFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedLineFilter === "all"
                      ? "bg-[#003d82] text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  所有路線
                </button>
                {LINES.filter((line) => line.id !== "Y").map((line) => (
                  <button
                    key={line.id}
                    onClick={() => setSelectedLineFilter(line.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedLineFilter === line.id
                        ? "text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    style={{
                      backgroundColor:
                        selectedLineFilter === line.id ? line.color : undefined,
                    }}
                  >
                    {line.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 翻頁按鈕 */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePrevPage}
                disabled={internalPage === 0}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  internalPage === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#003d82] text-white hover:bg-[#002d5f]"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">上一頁</span>
              </button>

              <span className="text-xs md:text-sm text-gray-600">
                顯示 {internalPage * effectiveItemsPerPage + 1} -{" "}
                {Math.min(
                  (internalPage + 1) * effectiveItemsPerPage,
                  filteredData.length
                )}{" "}
                / 共 {filteredData.length} 站
              </span>

              <button
                onClick={handleNextPage}
                disabled={internalPage >= filteredTotalPages - 1}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  internalPage >= filteredTotalPages - 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#003d82] text-white hover:bg-[#002d5f]"
                }`}
              >
                <span className="hidden sm:inline">下一頁</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 🔥 合併圖表：長條圖 + 折線圖 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-700">
                  綜合分數排名 vs 平均房價
                  {comparisonMode && (
                    <span className="ml-2 text-xs text-[#003d82] bg-blue-50 px-2 py-1 rounded">
                      點擊長條選擇站點
                    </span>
                  )}
                </h3>
                {priceCount > 0 && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {priceCount} 站有房價資料
                  </span>
                )}
              </div>
              <div className="w-full h-[400px] md:h-[600px]">
                {filteredData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={chartData}
                      margin={{
                        top: 20,
                        right: isMobile ? 20 : 40,
                        left: isMobile ? 10 : 20,
                        bottom: isMobile ? 60 : 80,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={isMobile ? 80 : 100}
                        interval={0}
                        tick={{ fontSize: isMobile ? 9 : 10, fill: "#4b5563" }}
                      />
                      <YAxis
                        yAxisId="left"
                        label={{
                          value: "綜合分數",
                          angle: -90,
                          position: "insideLeft",
                          style: {
                            fontSize: isMobile ? 11 : 13,
                            fill: "#003d82",
                            fontWeight: "600",
                          },
                        }}
                        domain={[scoreRange.min, scoreRange.max]}
                        tick={{
                          fontSize: isMobile ? 9 : 11,
                          fill: "#003d82",
                          fontWeight: "500",
                        }}
                        axisLine={{ stroke: "#003d82", strokeWidth: 2 }}
                        tickLine={{ stroke: "#003d82" }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        label={{
                          value: "房價 (萬/坪)",
                          angle: 90,
                          position: "insideRight",
                          style: {
                            fontSize: isMobile ? 11 : 13,
                            fill: "#1f2937",
                            fontWeight: "600",
                          },
                        }}
                        tick={{
                          fontSize: isMobile ? 9 : 11,
                          fill: "#1f2937",
                          fontWeight: "500",
                        }}
                        axisLine={{ stroke: "#1f2937", strokeWidth: 2 }}
                        tickLine={{ stroke: "#1f2937" }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        yAxisId="left"
                        dataKey="score"
                        name="綜合分數"
                        onClick={(data: unknown) => {
                          // 🔥 從 recharts 事件物件中安全提取 payload
                          if (
                            data &&
                            typeof data === "object" &&
                            "payload" in data
                          ) {
                            const payload = (data as { payload: ChartDataItem })
                              .payload;
                            if (payload?.stationId) {
                              handleStationSelect(payload.stationId);
                            }
                          }
                        }}
                        cursor="pointer"
                        shape={<CustomBar />}
                      >
                        {chartData.map((entry, index) => {
                          const colors = getDisplayColors(
                            entry,
                            selectedLineFilter
                          );
                          // 🔥 將顏色陣列轉為逗號分隔字串
                          const fillValue =
                            colors.length > 1 ? colors.join(",") : colors[0];

                          const isSelected = selectedStations.includes(
                            entry.stationId
                          );

                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={fillValue}
                              stroke={isSelected ? "#003d82" : "none"}
                              strokeWidth={isSelected ? 3 : 0}
                            />
                          );
                        })}
                      </Bar>
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="priceValue"
                        name="平均房價"
                        stroke="#1f2937"
                        strokeWidth={isMobile ? 2 : 3}
                        dot={{
                          fill: "#1f2937",
                          r: isMobile ? 3 : 5,
                          strokeWidth: 2,
                          stroke: "#fff",
                        }}
                        activeDot={{ r: isMobile ? 5 : 7, strokeWidth: 2 }}
                        connectNulls={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">此路線沒有站點資料</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
