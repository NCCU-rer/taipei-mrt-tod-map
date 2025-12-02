"use client";

import React, { useState, useMemo } from "react";

// 導入類型與資料
import { StationData } from "../types/mrt";
import { STATIONS } from "../data/stations";
import { TOD_DATA } from "../data/todData";
import { TOD_DETAILS } from "../data/todDetails";
import { LINES, getLineColor, getLineColors } from "../data/lines";

// 導入組件
import ControlPanel, { INDICATORS } from "./ControlPanel";
import InfoPanel from "./InfoPanel";
import RankingModal from "./RankingModal";

// 導入圖示
import { ChevronDown, Train, X, Info, Menu, List } from "lucide-react";

// 顯示模式
type DisplayMode = "tod" | "price";

// --- 單個站點元件 (改良版) ---
interface StationNodeProps {
  station: StationData;
  displayValue: string | number;
  displayMode: DisplayMode;
  isSelected: boolean;
  isDimmed: boolean;
  onClick: (station: StationData) => void;
  selectedLine: string;
  rank?: number;
  hasData: boolean;
}

const StationNode: React.FC<StationNodeProps> = ({
  station,
  displayValue,
  displayMode,
  isSelected,
  isDimmed,
  onClick,
  selectedLine,
  rank,
  hasData,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // 🔥 改良 1: 增加圓圈大小
  const radius = 18; // 15 → 18
  const fill = hasData ? "#ffffff" : "#d1d5db";
  const strokeWidth = isSelected ? 3 : 2.5;

  // 🔥 改良 2: 更深的文字顏色
  const valueColor = hasData ? "#1a1a1a" : "#6b7280";

  // 🔥 改良 3: 增加字體大小
  const valueFontSize = hasData ? 11 : 13; // 10/12 → 11/13

  const stationColors = getLineColors(station);
  const displayColors =
    selectedLine === "all"
      ? stationColors
      : stationColors.filter((c) => {
          const lineId = LINES.find((l) => l.color === c)?.id;
          return lineId === selectedLine;
        });

  const finalColors =
    displayColors.length > 0 ? displayColors : [getLineColor(station.id)];

  const labelPosition = station.labelPosition || "bottom";
  const getLabelOffset = () => {
    if (station.labelOffset) return station.labelOffset;
    const verticalOffset = 30; // 28 → 30 (配合圓圈變大)
    const horizontalOffset = 30;
    switch (labelPosition) {
      case "top":
        return { x: 0, y: -verticalOffset };
      case "bottom":
        return { x: 0, y: verticalOffset };
      case "left":
        return { x: -horizontalOffset, y: 0 };
      case "right":
        return { x: horizontalOffset, y: 0 };
      case "bottom-right":
        return { x: horizontalOffset * 0.7, y: verticalOffset * 0.7 };
      default:
        return { x: 0, y: verticalOffset };
    }
  };

  const labelOffset = getLabelOffset();
  const textAnchor =
    labelPosition === "left"
      ? "end"
      : labelPosition === "right" || labelPosition === "bottom-right"
      ? "start"
      : "middle";

  const gradientId = `gradient-${station.id}`;

  return (
    <g
      transform={`translate(${station.x}, ${station.y})`}
      onClick={(e) => {
        e.stopPropagation();
        if (hasData) onClick(station);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: hasData ? "pointer" : "default",
        opacity: isDimmed ? 0.1 : 1,
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <defs>
        {finalColors.length > 1 ? (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            {finalColors.map((color, index) => {
              const offset = (index / (finalColors.length - 1)) * 100;
              return (
                <stop key={index} offset={`${offset}%`} stopColor={color} />
              );
            })}
          </linearGradient>
        ) : null}
      </defs>

      {/* 🔥 改良 4: 增加點擊區域 */}
      <circle r={28} fill="transparent" />

      {/* 主要圓圈 */}
      <circle
        r={radius}
        fill={fill}
        stroke={finalColors.length > 1 ? `url(#${gradientId})` : finalColors[0]}
        strokeWidth={strokeWidth}
        style={{
          // 🔥 改良 5: 增強陰影效果
          filter:
            isSelected || (isHovered && hasData)
              ? "drop-shadow(0px 3px 6px rgba(0,0,0,0.4))"
              : "drop-shadow(0px 1px 2px rgba(0,0,0,0.2))",
          transition: "all 0.2s ease-out",
          // 🔥 改良 6: hover 時放大更多
          transform: isHovered && hasData ? "scale(1.15)" : "scale(1)",
        }}
      />

      {/* 🔥 改良 7: 數字加上白色光暈背景 */}
      <text
        dy=".35em"
        fill="#ffffff"
        fontSize={valueFontSize + 1}
        fontWeight="900"
        textAnchor="middle"
        stroke="#ffffff"
        strokeWidth="3"
        style={{
          pointerEvents: "none",
          userSelect: "none",
          opacity: 0.8,
        }}
      >
        {displayValue}
      </text>

      {/* 🔥 主要數字文字 */}
      <text
        dy=".35em"
        fill={valueColor}
        fontSize={valueFontSize}
        fontWeight="900"
        textAnchor="middle"
        style={{
          pointerEvents: "none",
          userSelect: "none",
          // 🔥 改良 8: 增加文字陰影
          filter: "drop-shadow(0px 1px 1px rgba(255,255,255,0.8))",
        }}
      >
        {displayValue}
      </text>

      {/* 排名徽章 */}
      {rank && rank <= 10 && hasData && (
        <g>
          <circle
            cx={radius - 3}
            cy={-radius + 3}
            r="9"
            fill="#c8102e"
            stroke="#fff"
            strokeWidth="1.5"
          />
          <text
            x={radius - 3}
            y={-radius + 3}
            dy=".35em"
            fill="#fff"
            fontSize={9}
            fontWeight="bold"
            textAnchor="middle"
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            {rank}
          </text>
        </g>
      )}

      {/* 站名標籤 */}
      <text
        x={labelOffset.x}
        y={labelOffset.y}
        dy={
          labelPosition === "left" || labelPosition === "right" ? ".35em" : "0"
        }
        fill={hasData ? (isSelected ? "#000" : "#555") : "#999"}
        fontSize={14}
        fontFamily="Noto Sans CJK TC Regular"
        fontWeight={isSelected ? "bold" : "normal"}
        textAnchor={textAnchor}
        style={{
          pointerEvents: "none",
          textShadow: "0px 0px 4px rgba(255,255,255,0.9)",
          userSelect: "none",
        }}
      >
        {station.name}
      </text>
    </g>
  );
};

// --- 主元件 ---
export default function MrtMap() {
  const [selectedStationId, setSelectedStationId] = useState<string | null>(
    null
  );
  const [selectedYear, setSelectedYear] = useState<string>("112");
  const [selectedBuffer, setSelectedBuffer] = useState<string>("300");
  const [selectedLine, setSelectedLine] = useState<string>("all");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("tod");
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(
    INDICATORS.map((ind) => ind.id)
  );
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileInfoOpen, setIsMobileInfoOpen] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [rankingPage, setRankingPage] = useState(0);

  const getTodValue = (stationId: string) => {
    const station = STATIONS.find((s) => s.id === stationId);
    if (!station) return "-";
    const stationName = station.name.replace("站", "");
    const key = `${selectedYear}_${selectedBuffer}`;
    const value = TOD_DATA[stationName]?.[key];
    return value !== undefined && !isNaN(value) ? value.toFixed(1) : "-";
  };

  const getPriceValue = (stationId: string) => {
    const station = STATIONS.find((s) => s.id === stationId);
    if (!station) return "-";
    const stationName = station.name.replace("站", "");
    const details = TOD_DETAILS[stationName]?.[selectedYear]?.[selectedBuffer];
    if (!details || !details.price || details.price === null) return "-";
    return (details.price / 10000).toFixed(0);
  };

  const getCustomScore = (stationId: string) => {
    const station = STATIONS.find((s) => s.id === stationId);
    if (!station) return 0;
    const stationName = station.name.replace("站", "");
    const details = TOD_DETAILS[stationName]?.[selectedYear]?.[selectedBuffer];
    if (!details || !details.raw) return 0;

    const selectedValues = selectedIndicators
      .map((id) => {
        const indicator = INDICATORS.find((i) => i.id === id);
        if (!indicator) return null;
        const value = details.raw[indicator.key as keyof typeof details.raw];
        return typeof value === "number" && !isNaN(value) ? value : null;
      })
      .filter((v): v is number => v !== null);

    if (selectedValues.length === 0) return 0;
    const sum = selectedValues.reduce((acc, val) => acc + val, 0);
    return sum / selectedValues.length;
  };

  const rankedStations = useMemo(() => {
    const stationsWithScores = STATIONS.map((station) => {
      const stationName = station.name.replace("站", "");
      const hasData = TOD_DATA[stationName] !== undefined;
      if (!hasData) return null;

      const score = getCustomScore(station.id);
      return { station, score };
    })
      .filter((item) => item !== null && item.score > 0)
      .sort((a, b) => b!.score - a!.score);

    return stationsWithScores.map((item, index) => ({
      ...item!,
      rank: index + 1,
    }));
  }, [selectedIndicators, selectedYear, selectedBuffer]);

  const getStationRank = (stationId: string) => {
    const found = rankedStations.find((item) => item.station.id === stationId);
    return found ? found.rank : undefined;
  };

  const handleStationClick = (station: StationData) => {
    setSelectedStationId(station.id);
    setIsMobileInfoOpen(true);
  };

  const handleLegendClick = (lineId: string) => {
    setSelectedLine(selectedLine === lineId ? "all" : lineId);
  };

  const currentDetails = useMemo(() => {
    if (!selectedStationId) return null;
    const station = STATIONS.find((s) => s.id === selectedStationId);
    if (!station) return null;
    const stationName = station.name.replace("站", "");
    const details = TOD_DETAILS[stationName]?.[selectedYear]?.[selectedBuffer];
    return details || null;
  }, [selectedStationId, selectedYear, selectedBuffer]);

  const currentStationInfo = useMemo(() => {
    if (!selectedStationId) return null;
    const station = STATIONS.find((s) => s.id === selectedStationId);
    const todValue = getTodValue(station?.id ?? "");
    const priceValue = getPriceValue(station?.id ?? "");
    const customScore = getCustomScore(station?.id ?? "");
    const rank = getStationRank(station?.id ?? "");
    return station
      ? { ...station, todValue, priceValue, customScore, rank }
      : null;
  }, [selectedStationId, selectedYear, selectedBuffer, selectedIndicators]);

  const checkStationInLine = (station: StationData, lineId: string) => {
    if (lineId === "all") return true;
    if (station.lines && station.lines.includes(lineId)) return true;
    if (station.id.startsWith(lineId)) return true;
    return false;
  };

  // 排名資料準備
  const ITEMS_PER_PAGE = 20;
  const allRankingData = useMemo(() => {
    return rankedStations
      .map((item) => {
        const colors = getLineColors(item.station);
        return {
          name: item.station.name,
          score: Number((item.score * 100).toFixed(1)),
          rank: item.rank,
          stationId: item.station.id,
          color: colors[0] || "#999",
          price: (() => {
            const stationName = item.station.name.replace("站", "");
            const details =
              TOD_DETAILS[stationName]?.[selectedYear]?.[selectedBuffer];
            return details?.price ? (details.price / 10000).toFixed(0) : null;
          })(),
        };
      })
      .filter((item) => !isNaN(item.score));
  }, [rankedStations, selectedYear, selectedBuffer]);

  const totalPages = Math.ceil(allRankingData.length / ITEMS_PER_PAGE);

  const handleBarClick = (data: any) => {
    if (data && data.stationId) {
      setSelectedStationId(data.stationId);
      setShowRankingModal(false);
      setIsMobileInfoOpen(true);
    }
  };

  const handlePrevPage = () => {
    setRankingPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setRankingPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  // 取得選定指標的標籤
  const selectedIndicatorLabels = selectedIndicators
    .map((id) => {
      const indicator = INDICATORS.find((i) => i.id === id);
      return indicator?.label;
    })
    .filter(Boolean) as string[];

  return (
    <div className="relative w-full h-screen flex flex-col md:flex-row bg-gray-50">
      {/* 桌面版：左側控制面板 */}
      <div className="hidden md:flex w-80 bg-white border-r border-gray-200 shadow-xl flex-col overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-[#003d82]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Train className="w-6 h-6 text-[#003d82]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">
                捷運 TOD 分析系統
              </h1>
              <p className="text-xs text-blue-100">
                Transit-Oriented Development
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <ControlPanel
            displayMode={displayMode}
            setDisplayMode={setDisplayMode}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedBuffer={selectedBuffer}
            setSelectedBuffer={setSelectedBuffer}
            selectedLine={selectedLine}
            setSelectedLine={setSelectedLine}
            selectedIndicators={selectedIndicators}
            setSelectedIndicators={setSelectedIndicators}
            onShowRanking={() => {
              setShowRankingModal(true);
              setRankingPage(0);
            }}
          />
        </div>
      </div>

      {/* 手機版：頂部標題欄 */}
      <div className="md:hidden bg-[#003d82] p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Train className="w-6 h-6 text-white" />
          <h1 className="text-lg font-bold text-white">捷運 TOD 分析</h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* 手機版：控制面板抽屜 */}
      {isMobileMenuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="md:hidden fixed top-0 left-0 right-0 bottom-0 bg-white z-50 overflow-y-auto animate-in slide-in-from-top duration-300">
            <div className="p-4 border-b border-gray-200 bg-[#003d82] flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">設定</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="p-4">
              <ControlPanel
                displayMode={displayMode}
                setDisplayMode={setDisplayMode}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                selectedBuffer={selectedBuffer}
                setSelectedBuffer={setSelectedBuffer}
                selectedLine={selectedLine}
                setSelectedLine={setSelectedLine}
                selectedIndicators={selectedIndicators}
                setSelectedIndicators={setSelectedIndicators}
                onShowRanking={() => {
                  setShowRankingModal(true);
                  setRankingPage(0);
                  setIsMobileMenuOpen(false);
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* 中間地圖區域 */}
      <div className="flex-1 relative bg-white overflow-auto">
        {/* 桌面版圖例 */}
        <div className="hidden md:block absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 z-10">
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider border-b border-gray-200 pb-2">
            路線圖例（點擊切換）
          </h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {LINES.filter((line) => line.id !== "Y").map((line) => (
              <button
                key={line.id}
                onClick={() => handleLegendClick(line.id)}
                className={`flex items-center gap-2 transition-all duration-300 px-2 py-1.5 rounded ${
                  selectedLine === line.id
                    ? "bg-blue-50 ring-2 ring-blue-400 shadow-sm"
                    : "hover:bg-gray-100"
                } ${
                  selectedLine !== "all" && selectedLine !== line.id
                    ? "opacity-30"
                    : "opacity-100"
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full shadow-sm flex-shrink-0"
                  style={{ backgroundColor: line.color }}
                ></span>
                <span
                  className={`text-xs font-medium ${
                    selectedLine === line.id
                      ? "text-blue-700 font-bold"
                      : "text-gray-700"
                  }`}
                >
                  {line.name}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 ${
                  displayMode === "tod"
                    ? "bg-blue-100 text-[#003d82]"
                    : "bg-red-100 text-[#c8102e]"
                }`}
              >
                {displayMode === "tod" ? "T" : "$"}
              </div>
              <span>
                圓圈顯示：{displayMode === "tod" ? "TOD 指數" : "房價 (萬/坪)"}
              </span>
            </div>
          </div>
        </div>

        {/* 手機版圖例 */}
        <div className="md:hidden absolute top-4 right-4 z-10">
          {!isLegendOpen && (
            <button
              onClick={() => setIsLegendOpen(true)}
              className="bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all"
            >
              <List className="w-5 h-5 text-[#003d82]" />
            </button>
          )}

          {isLegendOpen && (
            <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-200 max-w-[200px] animate-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  路線圖例
                </h4>
                <button
                  onClick={() => setIsLegendOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="border-t border-gray-200 pt-2 mb-2"></div>
              <div className="grid grid-cols-1 gap-y-2">
                {LINES.filter((line) => line.id !== "Y").map((line) => (
                  <button
                    key={line.id}
                    onClick={() => handleLegendClick(line.id)}
                    className={`flex items-center gap-2 transition-all duration-300 px-2 py-1.5 rounded ${
                      selectedLine === line.id
                        ? "bg-blue-50 ring-2 ring-blue-300"
                        : "hover:bg-gray-100"
                    } ${
                      selectedLine !== "all" && selectedLine !== line.id
                        ? "opacity-30"
                        : "opacity-100"
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shadow-sm flex-shrink-0"
                      style={{ backgroundColor: line.color }}
                    ></span>
                    <span
                      className={`text-xs font-medium truncate ${
                        selectedLine === line.id
                          ? "text-blue-700 font-bold"
                          : "text-gray-700"
                      }`}
                    >
                      {line.name}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 ${
                      displayMode === "tod"
                        ? "bg-blue-100 text-[#003d82]"
                        : "bg-red-100 text-[#c8102e]"
                    }`}
                  >
                    {displayMode === "tod" ? "T" : "$"}
                  </div>
                  <span className="truncate">
                    {displayMode === "tod" ? "TOD 指數" : "房價"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SVG 地圖 */}
        <div className="w-full h-full flex items-center justify-center">
          <svg
            version="1.1"
            viewBox="0 0 1369.96 1150"
            className="w-full h-auto max-w-full max-h-full"
            preserveAspectRatio="xMidYMid meet"
            onClick={() => setSelectedStationId(null)}
          >
            <g fill="none" strokeWidth="10" style={{ pointerEvents: "none" }}>
              <path
                d="m 449.7109 103.2889 v -49.999998"
                stroke="#f98e99"
                style={{
                  opacity:
                    selectedLine === "all" || selectedLine === "R" ? 1 : 0.15,
                  transition: "opacity 0.3s ease-in-out",
                }}
              ></path>
              <path
                d="m 664.7109 1023.2889 h -45"
                stroke="#cce226"
                style={{
                  opacity:
                    selectedLine === "all" || selectedLine === "G" ? 1 : 0.15,
                  transition: "opacity 0.3s ease-in-out",
                }}
              ></path>
              <path
                d="m 1069.7109 553.2889 h -605 c -17.59453 0 -40 22.40547 -40 40 v 125 c 0 14.26086 15.73915 30 30 30 h 85 l 110 110 c 7.35863 7.35863 15 18.39002 15 25 v 220"
                stroke="#007c59"
                style={{
                  opacity:
                    selectedLine === "all" || selectedLine === "G" ? 1 : 0.15,
                  transition: "opacity 0.3s ease-in-out",
                }}
              ></path>
              <path
                d="m 59.710902 103.2889 h 405 c 75 0 75 0 75 75 v 570 h 525"
                stroke="#d12d33"
                style={{
                  opacity:
                    selectedLine === "all" || selectedLine === "R" ? 1 : 0.15,
                  transition: "opacity 0.3s ease-in-out",
                }}
              ></path>
              <path
                d="m 89.7109 943.2889 l 280 -280 c 15 -15 25 -15 55 -15 h 800"
                stroke="#0072c6"
                style={{
                  opacity:
                    selectedLine === "all" || selectedLine === "BL" ? 1 : 0.15,
                  transition: "opacity 0.3s ease-in-out",
                }}
              ></path>
              <path
                d="m 1174.7109 943.2889 h -360.00008 c -34.28884 0 -59.99992 -40.71114 -59.99992 -75 v -445 c 0 -50 0 -50 55 -50 h 370 c 45 0 45 0 45 45 v 230"
                stroke="#aa753f"
                style={{
                  opacity:
                    selectedLine === "all" || selectedLine === "BR" ? 1 : 0.15,
                  transition: "opacity 0.3s ease-in-out",
                }}
              ></path>
              <g
                stroke="#fca311"
                style={{
                  opacity:
                    selectedLine === "all" || selectedLine === "O" ? 1 : 0.15,
                  transition: "opacity 0.3s ease-in-out",
                }}
              >
                <path d="m 409.7109 983.28889 l 235 -234.99999 v -270 c 0 -20 -10 -30 -30 -30 h -180 l -365 365"></path>
                <path d="M 434.73522,447.69034 209.7109,223.2889"></path>
              </g>
            </g>

            {STATIONS.map((station) => {
              const stationName = station.name.replace("站", "");
              const hasAnyData = TOD_DATA[stationName] !== undefined;
              const displayValue =
                displayMode === "tod"
                  ? getTodValue(station.id)
                  : getPriceValue(station.id);
              const isDimmed = !checkStationInLine(station, selectedLine);
              const rank = getStationRank(station.id);

              return (
                <StationNode
                  key={station.id}
                  station={station}
                  displayValue={displayValue}
                  displayMode={displayMode}
                  isSelected={selectedStationId === station.id}
                  isDimmed={isDimmed}
                  onClick={handleStationClick}
                  selectedLine={selectedLine}
                  rank={rank}
                  hasData={hasAnyData}
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* 桌面版：右側資訊面板 */}
      <div className="hidden md:flex w-96 bg-white border-l border-gray-200 shadow-xl flex-col overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-[#003d82]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Info className="w-5 h-5" />
            站點資訊
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <InfoPanel
            stationInfo={currentStationInfo}
            stationDetails={currentDetails}
          />
        </div>
      </div>

      {/* 手機版：底部資訊抽屜 */}
      {currentStationInfo && (
        <>
          <div
            className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
              isMobileInfoOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsMobileInfoOpen(false)}
          />
          <div
            className={`md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 transition-transform duration-300 ${
              isMobileInfoOpen ? "translate-y-0" : "translate-y-full"
            }`}
            style={{ maxHeight: "80vh" }}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between rounded-t-2xl">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Info className="w-5 h-5 text-[#003d82]" />
                站點資訊
              </h3>
              <button
                onClick={() => setIsMobileInfoOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
            <div
              className="p-4 overflow-y-auto"
              style={{ maxHeight: "calc(80vh - 60px)" }}
            >
              <InfoPanel
                stationInfo={currentStationInfo}
                stationDetails={currentDetails}
              />
            </div>
          </div>
        </>
      )}

      {/* 排名視窗 Modal */}
      <RankingModal
        isOpen={showRankingModal}
        onClose={() => setShowRankingModal(false)}
        rankingData={allRankingData}
        selectedIndicators={selectedIndicators}
        indicatorLabels={selectedIndicatorLabels}
        currentPage={rankingPage}
        totalPages={totalPages}
        itemsPerPage={ITEMS_PER_PAGE}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onBarClick={handleBarClick}
      />
    </div>
  );
}
