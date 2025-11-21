// Project/tod-widget/app/components/DetailPanel.tsx
import {
  X,
  TrendingUp,
  DollarSign,
  Activity,
  BarChart3,
  AlertCircle, // 🔥 新增
} from "lucide-react";

export default function DetailPanel({
  station,
  details,
  selectedBuffer,
  selectedYear,
  onClose,
}: DetailPanelProps) {
  // 🔥 檢查是否有交易資料
  const hasTransactionData = details.count !== null && details.price !== null;

  return (
    <div className="absolute top-4 right-4 w-96 bg-white rounded-lg shadow-2xl overflow-hidden z-10 max-h-[calc(100vh-2rem)] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{station.name}</h2>
          <p className="text-sm text-blue-100">
            {selectedYear} 年度 · {selectedBuffer}m 環域
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1">
        {/* TOD Score Card */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">TOD 整體分數</div>
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {details.score.toFixed(1)}
            </div>
            <div className="inline-block px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
              {details.score >= 80
                ? "優良"
                : details.score >= 60
                ? "良好"
                : "普通"}
            </div>
          </div>
        </div>

        {/* 🔥 交易資料區塊 - 條件顯示 */}
        {hasTransactionData ? (
          <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                <TrendingUp size={14} />
                交易件數
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {details.count}
              </div>
              <div className="text-xs text-gray-500 mt-1">筆</div>
            </div>

            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                <DollarSign size={14} />
                建物單價
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {(details.price / 10000).toFixed(1)}
              </div>
              <div className="text-xs text-gray-500 mt-1">萬元/坪</div>
            </div>
          </div>
        ) : (
          // 🔥 無交易資料的提示
          <div className="p-4 bg-amber-50 border-l-4 border-amber-400">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle size={16} />
              <span className="text-sm font-medium">此環域無交易資料</span>
            </div>
            <p className="text-xs text-amber-700 mt-1">
              {selectedYear} 年度在 {selectedBuffer}m 環域內無不動產交易紀錄
            </p>
          </div>
        )}

        {/* Radar Chart */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Activity size={16} />
            TOD 指標雷達圖
          </h3>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={details.radar}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 1]} tick={false} />
                <Radar
                  name="TOD 指標"
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="p-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <BarChart3 size={16} />
            詳細指標
          </h3>
          {Object.entries(details.raw).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm text-gray-700">{key}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${value * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-800 w-12 text-right">
                  {(value * 100).toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
