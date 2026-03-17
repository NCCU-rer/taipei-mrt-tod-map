"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import {
    MapContainer,
    TileLayer,
    Polyline,
    Marker,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { STATIONS } from "../data/stations";
import { STATION_GEO, LINE_PATHS } from "../data/stationsGeo";
import { getLineColors } from "../data/lines";
import type { StationData } from "../types/mrt";

// ── Helper: 根據 ID 取得 lat/lng ─────────────────────────
function getPos(id: string): [number, number] | null {
    const g = STATION_GEO[id];
    return g ? [g.lat, g.lng] : null;
}

// ── 設定初始視圖 ──────────────────────────────────────────
function MapInit({ center, zoom }: { center: [number, number]; zoom: number }) {
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
}) {
    const { displayValue, strokeColor, isSelected, isInComparison, compIdx, isDimmed, displayMode, hasData } = opts;
    const size = isSelected || isInComparison ? 38 : 32;
    const half = size / 2;
    const borderWidth = isInComparison ? 4 : isSelected ? 3.5 : 2.5;
    const opacity = isDimmed ? 0.18 : 1;
    const valueColor = hasData
        ? displayMode === "tod"
            ? "#003d82"
            : "#c8102e"
        : "#9ca3af";
    const val = hasData && displayValue !== undefined && displayValue !== "-"
        ? displayValue
        : "—";

    // 比對序號 badge
    const badgeHtml = isInComparison && compIdx >= 0
        ? `<div style="position:absolute;top:-4px;left:-4px;width:14px;height:14px;border-radius:50%;background:${COMPARISON_COLORS[compIdx]};border:1.5px solid white;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:bold;color:white;">${compIdx + 1}</div>`
        : "";

    const shadow = isSelected || isInComparison
        ? "0 3px 8px rgba(0,0,0,0.45)"
        : "0 1px 4px rgba(0,0,0,0.25)";

    return L.divIcon({
        html: `
      <div style="
        position: relative;
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
      ">
        ${val}
        ${badgeHtml}
      </div>
    `,
        className: "",          // 清除 Leaflet 預設 class（白底矩形來自此）
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
    onStationClick,
}: GeoMapProps) {
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

            {/* 站點 Markers（DivIcon 圓形卡片）*/}
            {STATIONS.map((station) => {
                const geo = STATION_GEO[station.id];
                if (!geo) return null;

                const pos: [number, number] = [geo.lat, geo.lng];
                const displayValue = displayValues[station.id];
                const hasData = displayValue !== undefined && displayValue !== "-";

                // 路線篩選
                const stationLines = station.lines ?? [station.id.replace(/\d.*/, "")];
                const inSelectedLine =
                    selectedLine === "all" || stationLines.includes(selectedLine);
                const isDimmed = !inSelectedLine;

                const isSelected = station.id === selectedStationId;
                const compIdx = comparisonStations.indexOf(station.id);
                const isInComparison = compIdx >= 0;

                // 邊框顏色
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
