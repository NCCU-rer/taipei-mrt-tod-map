"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import {
    MapContainer,
    TileLayer,
    Polyline,
    Marker,
    Circle,
    useMap,
    useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { STATIONS } from "../data/stations";
import { STATION_GEO, LINE_PATHS } from "../data/stationsGeo";
import { getLineColors } from "../data/lines";
import type { StationData } from "../types/mrt";

// ── Helper ────────────────────────────────────────────────
function getPos(id: string): [number, number] | null {
    const g = STATION_GEO[id];
    return g ? [g.lat, g.lng] : null;
}

// ── 設定初始視圖 ──────────────────────────────────────────
function MapInit({
    center,
    zoom,
}: {
    center: [number, number];
    zoom: number;
}) {
    const map = useMap();
    const didInit = useRef(false);
    useEffect(() => {
        if (!didInit.current) {
            map.setView(center, zoom);
            didInit.current = true;
        }
    }, []);
    return null;
}

// ── 建立站點圓形 DivIcon ───────────────────────────────────
const COMPARISON_COLORS = ["#003d82", "#0056b3", "#0072c6"];

function createStationIcon(opts: {
    displayValue: string | number | undefined;
    strokeColor: string;
    isSelected: boolean;
    isInComparison: boolean;
    compIdx: number;
    isDimmed: boolean;
    displayMode: "tod" | "price";
    hasData: boolean;
    stationName: string;
}) {
    const {
        displayValue,
        strokeColor,
        isSelected,
        isInComparison,
        compIdx,
        isDimmed,
        displayMode,
        hasData,
        stationName,
    } = opts;
    const size = isSelected || isInComparison ? 38 : 32;
    const half = size / 2;
    const borderWidth = isInComparison ? 4 : isSelected ? 3.5 : 2.5;
    const opacity = isDimmed ? 0.18 : 1;
    const valueColor = hasData
        ? displayMode === "tod"
            ? "#003d82"
            : "#c8102e"
        : "#9ca3af";
    const val =
        hasData && displayValue !== undefined && displayValue !== "-"
            ? displayValue
            : "—";

    const badgeHtml =
        isInComparison && compIdx >= 0
            ? `<div style="position:absolute;top:-4px;left:-4px;width:14px;height:14px;border-radius:50%;background:${COMPARISON_COLORS[compIdx]};border:1.5px solid white;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:bold;color:white;">${compIdx + 1}</div>`
            : "";

    const shadow =
        isSelected || isInComparison
            ? "0 3px 8px rgba(0,0,0,0.45)"
            : "0 1px 4px rgba(0,0,0,0.25)";

    // Hover tooltip label (站名) — 顯示在圓圈上方
    const labelHtml = `<div class="geo-hover-label">${stationName}</div>`;

    return L.divIcon({
        html: `
      <div class="geo-station-wrapper" style="position:relative;width:${size}px;height:${size}px;">
        <div style="
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: white;
          border: ${borderWidth}px solid ${strokeColor};
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: ${shadow};
          opacity: ${opacity};
          font-size: ${size >= 38 ? 12 : 10}px;
          font-weight: 900;
          color: ${valueColor};
          font-family: system-ui, -apple-system, sans-serif;
          pointer-events: auto;
          user-select: none;
          box-sizing: border-box;
          transition: transform 0.15s;
          cursor: pointer;
        ">
          ${val}
          ${badgeHtml}
        </div>
        ${labelHtml}
      </div>
    `,
        className: "",
        iconSize: [size, size],
        iconAnchor: [half, half],
    });
}

// ── Props ─────────────────────────────────────────────────
interface GeoMapProps {
    selectedStationId: string | null;
    selectedLine: string;
    displayValues: Record<string, string | number>;
    displayMode: "tod" | "price";
    comparisonStations: string[];
    isComparisonMode: boolean;
    selectedBuffer: string;           // "150" | "300" — 用於緩衝圈
    onStationClick: (station: StationData) => void;
}

const LINE_OPACITY_DIM = 0.12;
const CENTER: [number, number] = [25.048, 121.513];
const ZOOM = 12;

// ── 主元件 ────────────────────────────────────────────────
export default function GeoMap({
    selectedStationId,
    selectedLine,
    displayValues,
    displayMode,
    comparisonStations,
    isComparisonMode,
    selectedBuffer,
    onStationClick,
}: GeoMapProps) {
    // 取得選取站點的地理位置
    const selectedPos = selectedStationId ? getPos(selectedStationId) : null;
    const bufferRadiusM = selectedBuffer === "150" ? 150 : 300;

    return (
        <MapContainer
            center={CENTER}
            zoom={ZOOM}
            style={{ width: "100%", height: "100%" }}
            zoomControl={true}
        >
            <MapInit center={CENTER} zoom={ZOOM} />

            {/* 底圖 */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* 路線 Polylines */}
            {LINE_PATHS.map(({ lineId, color, segments }) => {
                const dimmed = selectedLine !== "all" && selectedLine !== lineId;
                return segments.map((seg, si) => {
                    const positions = seg
                        .map(getPos)
                        .filter((p): p is [number, number] => p !== null);
                    return (
                        <Polyline
                            key={`${lineId}-${si}`}
                            positions={positions}
                            pathOptions={{
                                color,
                                weight: 5,
                                opacity: dimmed ? LINE_OPACITY_DIM : 0.88,
                            }}
                        />
                    );
                });
            })}

            {/* 🔵 選取站點的 TOD 分析緩衝圈 */}
            {selectedPos && (
                <>
                    {/* 外圈（300m）—— 若當前 buffer 為 300m 顯示實色，否則顯示虛線 */}
                    <Circle
                        center={selectedPos}
                        radius={300}
                        pathOptions={{
                            color: "#003d82",
                            fillColor: "#003d82",
                            fillOpacity: 0.04,
                            weight: 2,
                            dashArray: selectedBuffer === "300" ? undefined : "6 4",
                            opacity: selectedBuffer === "300" ? 0.55 : 0.25,
                        }}
                    />
                    {/* 內圈（150m）—— 若當前 buffer 為 150m 顯示實色，否則顯示虛線 */}
                    <Circle
                        center={selectedPos}
                        radius={150}
                        pathOptions={{
                            color: "#c8102e",
                            fillColor: "#c8102e",
                            fillOpacity: 0.06,
                            weight: 2,
                            dashArray: selectedBuffer === "150" ? undefined : "6 4",
                            opacity: selectedBuffer === "150" ? 0.7 : 0.35,
                        }}
                    />
                </>
            )}

            {/* 站點 Markers（DivIcon 圓形 + 站名懸停標籤）*/}
            {STATIONS.map((station) => {
                const geo = STATION_GEO[station.id];
                if (!geo) return null;

                const pos: [number, number] = [geo.lat, geo.lng];
                const displayValue = displayValues[station.id];
                const hasData = displayValue !== undefined && displayValue !== "-";

                const stationLines = station.lines ?? [station.id.replace(/\d.*/, "")];
                const inSelectedLine =
                    selectedLine === "all" || stationLines.includes(selectedLine);
                const isDimmed = !inSelectedLine;

                const isSelected = station.id === selectedStationId;
                const compIdx = comparisonStations.indexOf(station.id);
                const isInComparison = compIdx >= 0;

                const strokeColor = isInComparison
                    ? COMPARISON_COLORS[compIdx]
                    : (() => {
                        const colors = getLineColors(station);
                        return colors[0] ?? "#999";
                    })();

                const icon = createStationIcon({
                    displayValue,
                    strokeColor,
                    isSelected,
                    isInComparison,
                    compIdx,
                    isDimmed,
                    displayMode,
                    hasData,
                    stationName: station.name,
                });

                return (
                    <Marker
                        key={station.id}
                        position={pos}
                        icon={icon}
                        eventHandlers={{
                            click: () => {
                                if (hasData) onStationClick(station);
                            },
                        }}
                    />
                );
            })}
        </MapContainer>
    );
}
