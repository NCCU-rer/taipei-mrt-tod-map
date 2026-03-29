"use client";

import React, { useMemo } from "react";
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
  Legend,
  Cell,
} from "recharts";
import {
  X,
  TrendingUp,
  Home,
  Activity,
  DollarSign,
  Footprints,
  Bike,
  Network,
  Bus,
  ShoppingBag,
  Building2,
  MapPinned,
  CarFront,
  Award,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";
import { StationData } from "../types/mrt";
import { TODDetailData as StationDetails } from "../data/todDetails";

interface ComparisonStation {
  station: StationData;
  details: StationDetails | null;
  color: string;
}

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  stations: ComparisonStation[];
}

// 🎨 雷達圖資料點類型
interface RadarDataPoint {
  subject: string;
  [stationName: string]: number | string;
}

// 🎨 長條圖資料點類型
interface BarDataPoint {
  name: string;
  score: number;
  price: number | null;
  count: number | null;
  color: string;
}

// 🎨 Tooltip Payload 類型
interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
  dataKey: string;
  payload: RadarDataPoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

// 🎨 指標圖示對應
const getIndicatorIcon = (subject: string) => {
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

// 🏠 生成房價資訊連結
const getPriceInfoUrl = (stationName: string): string => {
  const cleanName = stationName.replace("站", "");
  const encodedName = encodeURIComponent(`${cleanName}站`);
  return `https://buy.yungching.com.tw/mrt/%E5%8F%B0%E5%8C%97%E5%B8%82-_c/?kw=${encodedName}`;
};

// 🎨 格式化價格
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 0 }).format(
    price
  );
};

// 🎨 自訂 Tooltip
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
      <p className="font-bold text-gray-800 mb-2">
        {payload[0].payload.subject}
      </p>
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div
            key={`tooltip-${index}`}
            className="flex items-center gap-2 text-sm"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-bold" style={{ color: entry.color }}>
              {(entry.value * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ComparisonModal({
  isOpen,
  onClose,
  stations,
}: ComparisonModalProps) {
  // 🔥 準備雷達圖資料（合併所有站點）
  const radarData = useMemo<RadarDataPoint[]>(() => {
    if (stations.length === 0 || !stations[0].details) return [];

    const subjects = stations[0].details.radar.map((item) => item.subject);

    return subjects.map((subject) => {
      const dataPoint: RadarDataPoint = { subject };

      stations.forEach((station) => {
        if (station.details) {
          const item = station.details.radar.find((r) => r.subject === subject);
          dataPoint[station.station.name] = item ? item.value : 0;
        }
      });

      return dataPoint;
    });
  }, [stations]);

  // 🔥 準備長條圖資料（TOD 分數、房價、交易量）
  const barData = useMemo<BarDataPoint[]>(() => {
    return stations
      .filter((s) => s.details)
      .map((station) => ({
        name: station.station.name,
        score: station.details!.score,
        price: station.details!.price ? station.details!.price / 10000 : null,
        count: station.details!.count,
        color: station.color,
      }));
  }, [stations]);

  if (!isOpen) return null;

  const validStations = stations.filter((s) => s.details);

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal 內容 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 pointer-events-none">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] md:max-h-[90vh] overflow-hidden pointer-events-auto animate-in zoom-in-95 duration-200">
          {/* 標題列 */}
          <div className="p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-[#003d82] to-[#0056b3]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <ArrowUpDown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    站點比對分析
                  </h2>
                  <p className="text-sm text-blue-100 mt-1">
                    比對 {validStations.length} 個站點的 TOD 指標表現
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* 內容區 */}
          <div
            className="p-4 md:p-6 overflow-y-auto bg-gray-50"
            style={{ maxHeight: "calc(95vh - 120px)" }}
          >
            {validStations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ArrowUpDown className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium text-lg">
                  尚未選擇站點
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  請在比對模式下點選地圖上的站點
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 🔥 站點卡片列表 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {validStations.map((station, index) => (
                    <div
                      key={station.station.id}
                      className="bg-white rounded-lg shadow-md border-2 transition-all hover:shadow-lg"
                      style={{ borderColor: station.color }}
                    >
                      <div
                        className="p-4 rounded-t-lg"
                        style={{ backgroundColor: `${station.color}15` }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: station.color }}
                          >
                            {index + 1}
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {station.station.name}
                          </h3>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        {/* TOD 指數 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              TOD 指數
                            </span>
                          </div>
                          <span
                            className="text-xl font-bold"
                            style={{ color: station.color }}
                          >
                            {station.details!.score.toFixed(1)}
                          </span>
                        </div>
                        {/* 房價 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Home className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              平均單價
                            </span>
                          </div>
                          <span className="text-lg font-bold text-gray-800">
                            {station.details!.price
                              ? `${formatPrice(
                                station.details!.price / 10000
                              )} 萬`
                              : "N/A"}
                          </span>
                        </div>
                        {/* 交易量 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              交易量
                            </span>
                          </div>
                          <span className="text-lg font-bold text-gray-800">
                            {station.details!.count !== null
                              ? `${station.details!.count} 件`
                              : "N/A"}
                          </span>
                        </div>

                        {/* 🔥 查看房價導流按鈕 */}
                        <a
                          href={getPriceInfoUrl(station.station.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                          style={{ backgroundColor: station.color }}
                        >
                          查看區域房價
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 🔥 雷達圖比對 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#003d82]" />
                    各項指標表現比對
                  </h3>
                  <div className="w-full h-[400px] md:h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{ fill: "#6b7280", fontSize: 11 }}
                        />
                        <PolarRadiusAxis
                          angle={30}
                          domain={[0, 1]}
                          tick={false}
                          axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {validStations.map((station) => (
                          <Radar
                            key={station.station.id}
                            name={station.station.name}
                            dataKey={station.station.name}
                            stroke={station.color}
                            strokeWidth={2}
                            fill={station.color}
                            fillOpacity={0.2}
                          />
                        ))}
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 🔥 長條圖比對：TOD 分數 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#003d82]" />
                    TOD 綜合分數比對
                  </h3>
                  <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 12, fill: "#4b5563" }}
                        />
                        <YAxis
                          label={{
                            value: "TOD 分數",
                            angle: -90,
                            position: "insideLeft",
                            style: { fontSize: 12, fill: "#6b7280" },
                          }}
                          tick={{ fontSize: 11, fill: "#6b7280" }}
                        />
                        <Tooltip />
                        <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                          {barData.map((entry, index) => (
                            <Cell
                              key={`score-cell-${index}`}
                              fill={entry.color}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 🔥 長條圖比對：房價 */}
                {barData.some((d) => d.price !== null) && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Home className="w-5 h-5 text-[#003d82]" />
                      平均房價比對
                    </h3>
                    <div className="w-full h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12, fill: "#4b5563" }}
                          />
                          <YAxis
                            label={{
                              value: "房價 (萬/坪)",
                              angle: -90,
                              position: "insideLeft",
                              style: { fontSize: 12, fill: "#6b7280" },
                            }}
                            tick={{ fontSize: 11, fill: "#6b7280" }}
                          />
                          <Tooltip />
                          <Bar dataKey="price" radius={[8, 8, 0, 0]}>
                            {barData.map((entry, index) => (
                              <Cell
                                key={`price-cell-${index}`}
                                fill={entry.color}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* 🔥 詳細指標比對表格 */}
                <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#003d82]" />
                    詳細指標比對
                  </h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-2 text-gray-600 font-semibold">
                          指標
                        </th>
                        {validStations.map((station) => (
                          <th
                            key={station.station.id}
                            className="text-center py-3 px-2 font-semibold"
                            style={{ color: station.color }}
                          >
                            {station.station.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {validStations[0].details!.radar.map((item, index) => {
                        const IconComponent = getIndicatorIcon(item.subject);
                        return (
                          <tr
                            key={`indicator-${index}`}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-4 h-4 text-gray-400" />
                                <span className="font-medium text-gray-700">
                                  {item.subject}
                                </span>
                              </div>
                            </td>
                            {validStations.map((station) => {
                              const value = station.details!.radar.find(
                                (r) => r.subject === item.subject
                              )?.value;
                              const percentage = value
                                ? (value * 100).toFixed(0)
                                : "N/A";

                              // 找出最高值
                              const values = validStations.map(
                                (s) =>
                                  s.details!.radar.find(
                                    (r) => r.subject === item.subject
                                  )?.value || 0
                              );
                              const maxValue = Math.max(...values);
                              const isMax = value === maxValue && value !== 0;

                              return (
                                <td
                                  key={`${station.station.id}-${item.subject}`}
                                  className="text-center py-3 px-2"
                                >
                                  <span
                                    className={`font-bold ${isMax ? "text-lg" : ""
                                      }`}
                                    style={{
                                      color: isMax ? station.color : "#6b7280",
                                    }}
                                  >
                                    {percentage}%
                                  </span>
                                  {isMax && (
                                    <span className="ml-1 text-yellow-500">
                                      ★
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
