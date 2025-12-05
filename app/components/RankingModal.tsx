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
import { X, Award, Info, ChevronLeft, ChevronRight, Train } from "lucide-react";
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
  onBarClick: (data: any) => void;
}

interface CustomBarProps {
  fill: string | string[];
  x: number;
  y: number;
  width: number;
  height: number;
  payload?: any;
  [key: string]: any;
}

// 🔥 自訂 Tooltip - 同時顯示分數和房價
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
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
              <span className="font-bold text-gray-900">
                {data.price} 萬/坪
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
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
const CustomBar = (props: CustomBarProps) => {
  const { fill, x, y, width, height } = props;

  if (!fill) {
    return null;
  }

  if (Array.isArray(fill)) {
    const colors = fill.filter((c) => c).map((c) => addOpacityToColor(c, 0.75));

    if (colors.length === 0) {
      return null;
    }

    const radius = 8;

    if (colors.length === 2) {
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
            fill={colors[0]}
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
            fill={colors[1]}
          />
        </g>
      );
    } else if (colors.length === 3) {
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
            fill={colors[0]}
          />
          <rect
            x={x + thirdWidth}
            y={y}
            width={thirdWidth}
            height={height}
            fill={colors[1]}
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
            fill={colors[2]}
          />
        </g>
      );
    } else {
      const fillWithOpacity = addOpacityToColor(colors[0], 0.75);
      const radius = 8;
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
  }

  const radius = 8;
  const fillWithOpacity = addOpacityToColor(fill as string, 0.75);

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
}: RankingModalProps) {
  const [selectedLineFilter, setSelectedLineFilter] = useState<string>("all");
  const [internalPage, setInternalPage] = useState(0);

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
  const filteredData =
    selectedLineFilter === "all"
      ? rankingData
      : rankingData.filter((item) =>
          stationBelongsToLine(item, selectedLineFilter)
        );

  // 🔥 重新計算分頁（使用動態 itemsPerPage）
  const filteredTotalPages = Math.ceil(
    filteredData.length / effectiveItemsPerPage
  );

  const currentPageData = filteredData.slice(
    internalPage * effectiveItemsPerPage,
    (internalPage + 1) * effectiveItemsPerPage
  );

  // 🔥 準備合併圖表資料
  const chartData = currentPageData.map((item) => ({
    ...item,
    priceValue: item.price ? parseFloat(item.price) : null,
  }));

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
  const priceCount = chartData.filter(
    (item) => item.priceValue !== null
  ).length;

  // 🔥 路線切換時重置頁碼
  useEffect(() => {
    setInternalPage(0);
  }, [selectedLineFilter]);

  // 🔥 每次打開視窗時重置到第一頁
  useEffect(() => {
    if (isOpen) {
      setInternalPage(0);
      setSelectedLineFilter("all");
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
                  {/* 🔥 手機版提示 */}
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
                      {/* 🔥 左側 Y 軸：分數（動態範圍） */}
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
                      {/* 🎨 右側 Y 軸：房價（黑色系） */}
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
                      {/* 🎨 長條圖：分數（帶透明度） */}
                      <Bar
                        yAxisId="left"
                        dataKey="score"
                        name="綜合分數"
                        onClick={onBarClick}
                        cursor="pointer"
                        shape={<CustomBar />}
                      >
                        {chartData.map((entry, index) => {
                          const colors = getDisplayColors(
                            entry,
                            selectedLineFilter
                          );
                          const fillValue =
                            colors.length > 1 ? colors : colors[0];
                          return (
                            <Cell key={`cell-${index}`} fill={fillValue} />
                          );
                        })}
                      </Bar>
                      {/* 🎨 折線圖：房價（黑色加粗） */}
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
