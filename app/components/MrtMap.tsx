"use client";

import React, { useState, useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

// 導入類型與資料
import { StationData } from "../types/mrt";
import { STATIONS } from "../data/stations";
import { TOD_DATA } from "../data/todData";
import { TOD_DETAILS } from "../data/todDetails";
import { LINES, getLineColor, getLineColors } from "../data/lines";

// 導入圖示
import {
  Calendar,
  ChevronDown,
  MapPin,
  Train,
  Home,
  DollarSign,
  Activity,
  X,
  ExternalLink,
  TrendingUp,
  BarChart3,
  CheckSquare,
  Square,
  Award,
  Info,
  Footprints,
  Bike,
  Network,
  Bus,
  ShoppingBag,
  Building2,
  MapPinned,
  CarFront,
  Menu,
  ChevronUp,
  List,
} from "lucide-react";

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

// 雷達圖標籤對應圖示
const getRadarIcon = (subject: string) => {
  if (subject.includes("步行")) return Footprints;
  if (subject.includes("自行車")) return Bike;
  if (subject.includes("街道")) return Network;
  if (subject.includes("運輸")) return Bus;
  if (subject.includes("生活")) return ShoppingBag;
  if (subject.includes("密度")) return Building2;
  if (subject.includes("整合")) return MapPinned;
  if (subject.includes("汽車")) return CarFront;
  return Activity;
};

// 顯示模式
type DisplayMode = "tod" | "price";

// --- 單個站點元件 ---
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

  const radius = hasData ? 15 : 12;
  // 加深灰色站點的填充色
  const fill = hasData ? "#ffffff" : "#999999";
  const strokeWidth = isSelected ? 3 : 2.5;
  // 加深灰色站點的文字顏色
  const valueColor = hasData ? "#333" : "#666";

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
    const verticalOffset = 28;
    const horizontalOffset = 28;
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
        opacity: isDimmed ? 0.1 : hasData ? 1 : 0.5,
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

      <circle r={25} fill="transparent" />

      <circle
        r={radius}
        fill={fill}
        stroke={
          hasData
            ? finalColors.length > 1
              ? `url(#${gradientId})`
              : finalColors[0]
            : "#777"
        }
        strokeWidth={strokeWidth}
        style={{
          filter:
            isSelected || (isHovered && hasData)
              ? "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"
              : "none",
          transition: "all 0.2s ease-out",
          transform: isHovered && hasData ? "scale(1.1)" : "scale(1)",
        }}
      />

      <text
        dy=".35em"
        fill={valueColor}
        fontSize={hasData ? 10 : 14}
        fontWeight="900"
        textAnchor="middle"
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        {displayValue}
      </text>

      {rank && rank <= 10 && hasData && (
        <g>
          <circle
            cx={radius - 3}
            cy={-radius + 3}
            r="8"
            fill="#c8102e"
            stroke="#fff"
            strokeWidth="1.5"
          />
          <text
            x={radius - 3}
            y={-radius + 3}
            dy=".35em"
            fill="#fff"
            fontSize={8}
            fontWeight="bold"
            textAnchor="middle"
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            {rank}
          </text>
        </g>
      )}

      <text
        x={labelOffset.x}
        y={labelOffset.y}
        dy={
          labelPosition === "left" || labelPosition === "right" ? ".35em" : "0"
        }
        fill={hasData ? (isSelected ? "#000" : "#555") : "#888"}
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

  // 計算自訂指標分數
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

  // 排名計算
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 0 }).format(
      price
    );
  };

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

  // 排名圖表數據（前20名）
  const rankingChartData = rankedStations
    .slice(0, 20)
    .map((item) => ({
      name: item.station.name,
      score: Number((item.score * 100).toFixed(1)),
      rank: item.rank,
      stationId: item.station.id,
    }))
    .filter((item) => !isNaN(item.score));

  // 處理圖表點擊
  const handleBarClick = (data: any) => {
    if (data && data.stationId) {
      setSelectedStationId(data.stationId);
      setShowRankingModal(false);
      setIsMobileInfoOpen(true);
    }
  };

  // 控制面板內容組件
  const ControlPanel = () => (
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
          {LINES.map((line) => (
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
        onClick={() => setShowRankingModal(true)}
        className="w-full px-4 py-3 bg-gradient-to-r from-[#c8102e] to-[#a00d25] text-white rounded-lg font-medium hover:from-[#a00d25] hover:to-[#8a0b20] transition-all shadow-md flex items-center justify-center gap-2"
      >
        <Award className="w-5 h-5" />
        查看排名
      </button>
    </div>
  );

  // 資訊面板內容組件
  const InfoPanel = () => (
    <>
      {currentStationInfo ? (
        <div className="animate-in fade-in slide-in-from-right duration-300">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {currentStationInfo.name}
            </h3>
            <div className="flex gap-2">
              <a
                href={`https://www.metro.taipei/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#003d82] hover:text-[#0056b3] hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                捷運站資訊
              </a>
              <a
                href={`https://yungching.housefun.com.tw/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#c8102e] hover:text-[#a00d25] hover:underline"
              >
                <Home className="w-3 h-3" />
                查看房價
              </a>
            </div>
          </div>

          {currentDetails ? (
            <>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="col-span-2 bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="flex items-center gap-1.5 text-[#003d82] mb-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">TOD 指數</span>
                  </div>
                  <div className="text-2xl font-bold text-[#003d82] font-mono">
                    {currentDetails.score?.toFixed(1) ?? "N/A"}
                  </div>
                </div>
                {currentStationInfo.rank && (
                  <div className="col-span-2 bg-red-50 rounded-lg p-3 border border-red-100">
                    <div className="flex items-center gap-1.5 text-[#c8102e] mb-1">
                      <Award className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">自訂指標排名</span>
                    </div>
                    <div className="text-2xl font-bold text-[#c8102e] font-mono">
                      #{currentStationInfo.rank}
                      <span className="text-sm font-normal text-red-400 ml-2">
                        分數:{" "}
                        {(currentStationInfo.customScore * 100).toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                    <Activity className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">交易量</span>
                  </div>
                  <div className="text-lg font-bold text-gray-700 font-mono">
                    {currentDetails.count ?? "N/A"}{" "}
                    <span className="text-xs font-normal text-gray-400">
                      件
                    </span>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center gap-1.5 text-green-600 mb-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">平均單價</span>
                  </div>
                  <div className="text-lg font-bold text-green-700 font-mono">
                    {currentDetails.price
                      ? formatPrice(currentDetails.price / 10000)
                      : "N/A"}{" "}
                    <span className="text-xs font-normal text-green-400">
                      萬/坪
                    </span>
                  </div>
                </div>
              </div>

              {currentDetails.radar && (
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#003d82]" />
                    各項指標表現
                  </h4>

                  {/* 雷達圖 */}
                  <div className="w-full h-[240px] -ml-2 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="70%"
                        data={currentDetails.radar.filter(
                          (item: any) => !isNaN(item.value)
                        )}
                      >
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{ fill: "#6b7280", fontSize: 10 }}
                        />
                        <PolarRadiusAxis
                          angle={30}
                          domain={[0, 1]}
                          tick={false}
                          axisLine={false}
                        />
                        <Radar
                          name={currentStationInfo.name}
                          dataKey="value"
                          stroke="#003d82"
                          strokeWidth={2}
                          fill="#0056b3"
                          fillOpacity={0.5}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* 指標列表 */}
                  <div className="space-y-2">
                    {currentDetails.radar
                      .filter((item: any) => !isNaN(item.value))
                      .map((item: any, index: number) => {
                        const IconComponent = getRadarIcon(item.subject);
                        const percentage = (item.value * 100).toFixed(0);
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                          >
                            <IconComponent className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-gray-700">
                                  {item.subject}
                                </span>
                                <span className="text-xs font-bold text-[#003d82]">
                                  {percentage}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-gradient-to-r from-[#003d82] to-[#0056b3] h-1.5 rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 bg-yellow-50 text-yellow-700 text-sm rounded-lg">
              尚無此範圍詳細數據
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <MapPin className="w-8 h-8" />
          </div>
          <p className="text-gray-500 font-medium text-lg">請選擇站點</p>
          <p className="text-sm text-gray-400 mt-2">
            點擊地圖上的捷運站圓點
            <br />
            查看詳細 TOD 分析資料
          </p>
        </div>
      )}
    </>
  );

  return (
    <div className="relative w-full h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-blue-50">
      {/* 桌面版：左側控制面板 */}
      <div className="hidden md:flex w-80 bg-white border-r border-gray-200 shadow-xl flex-col overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-[#003d82] to-[#0056b3]">
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
          <ControlPanel />
        </div>
      </div>

      {/* 手機版：頂部標題欄 */}
      <div className="md:hidden bg-gradient-to-r from-[#003d82] to-[#0056b3] p-4 flex items-center justify-between">
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
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#003d82] to-[#0056b3] flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">設定</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="p-4">
              <ControlPanel />
            </div>
          </div>
        </>
      )}

      {/* 中間地圖區域 */}
      <div className="flex-1 relative bg-white overflow-auto">
        {/* 桌面版圖例 - 完整顯示 */}
        <div className="hidden md:block absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 z-10">
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider border-b border-gray-200 pb-2">
            路線圖例
          </h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {LINES.map((line) => (
              <div
                key={line.id}
                className={`flex items-center gap-2 transition-opacity duration-300 ${
                  selectedLine !== "all" && selectedLine !== line.id
                    ? "opacity-30"
                    : "opacity-100"
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full shadow-sm flex-shrink-0"
                  style={{ backgroundColor: line.color }}
                ></span>
                <span className="text-xs text-gray-700 font-medium">
                  {line.name}
                </span>
              </div>
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

        {/* 手機版圖例 - 可收合 */}
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
                {LINES.map((line) => (
                  <div
                    key={line.id}
                    className={`flex items-center gap-2 transition-opacity duration-300 ${
                      selectedLine !== "all" && selectedLine !== line.id
                        ? "opacity-30"
                        : "opacity-100"
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shadow-sm flex-shrink-0"
                      style={{ backgroundColor: line.color }}
                    ></span>
                    <span className="text-xs text-gray-700 font-medium truncate">
                      {line.name}
                    </span>
                  </div>
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

        {/* SVG 地圖容器 - 桌面版和手機版都居中 */}
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
        <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-[#003d82] to-[#0056b3]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Info className="w-5 h-5" />
            站點資訊
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <InfoPanel />
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
              <InfoPanel />
            </div>
          </div>
        </>
      )}

      {/* 排名視窗 Modal */}
      {showRankingModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
            onClick={() => setShowRankingModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 pointer-events-none">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] md:max-h-[90vh] overflow-hidden pointer-events-auto animate-in zoom-in-95 duration-200">
              <div className="p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-[#c8102e] to-[#a00d25]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Award className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-white">
                        站點排名 TOP 20
                      </h2>
                      <p className="text-xs text-red-100 mt-1">
                        已選 {selectedIndicators.length} 項 - 點擊長條查看詳情
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRankingModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

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
                      {selectedIndicators
                        .map((id) => {
                          const indicator = INDICATORS.find((i) => i.id === id);
                          return indicator?.label;
                        })
                        .join("、")}
                    </div>
                  </div>
                </div>

                {/* 長條圖 */}
                <div className="w-full h-[400px] md:h-[600px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={rankingChartData}
                      margin={{ top: 20, right: 10, left: 10, bottom: 80 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        interval={0}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis
                        label={{
                          value: "綜合分數",
                          angle: -90,
                          position: "insideLeft",
                          style: { fontSize: 12 },
                        }}
                        domain={[0, 100]}
                        tick={{ fontSize: 10 }}
                      />
                      <Tooltip
                        formatter={(value: any) => [`${value} 分`, "綜合分數"]}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        cursor={{ fill: "rgba(0, 61, 130, 0.1)" }}
                      />
                      <Bar
                        dataKey="score"
                        radius={[8, 8, 0, 0]}
                        onClick={handleBarClick}
                        cursor="pointer"
                      >
                        {rankingChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index < 3
                                ? "#c8102e"
                                : index < 10
                                ? "#f97316"
                                : "#003d82"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
