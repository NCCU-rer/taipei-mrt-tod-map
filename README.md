# 台北捷運 TOD 生活圈地圖 (Taipei MRT TOD Map)

本專案是一個基於網頁的互動式資料視覺化平台，用於展示與分析台北捷運各站點周邊的「大眾運輸導向發展 (Transit-Oriented Development, TOD)」相關指標與房價資訊。

透過此平台，使用者可以輕鬆地切換不同年度的資料，並藉由多項環境與機能指標（如步行友善度、生活機能等多樣性）來綜合評估各個捷運站周邊的生活圈發展潛力與現況。

## 系統核心功能

- **互動式地理圖台**：運用 Leaflet 呈現台北捷運路網，直觀比較各站點差異。
- **多維度指標分析**：支援 8 項 TOD 評估指標篩選，自動計算並重新排行。
- **資料年度與環域切換**：自動抓取並支援不同資料年度（如 112、114 年）以及環域範圍（150m、300m）的快速切換。
- **顯示模式切換**：可一鍵切換查看站點的「TOD 綜合指數」或「區域房屋均價」。
- **站點比對功能**：提供最多 3 個站點同框比較各指標的雷達圖與詳細分數。

## 技術架構

- **前端框架**：Next.js (App Router) / React
- **樣式工具**：Tailwind CSS
- **地圖組件**：Leaflet / React-Leaflet
- **圖表繪製**：Recharts
- **圖示庫**：Lucide React

## 線上服務預覽

本專案已部署至 Zeabur，您可以直接點擊下方連結進行完整體驗：
👉 [https://taipei-tod-map.zeabur.app/](https://taipei-tod-map.zeabur.app/)

## 資料更新說明

本專案的前端資料由 Python 資料處理腳本自動產生。若未來有新年度的 CSV 資料需要匯入，請依下列步驟操作：

1. 將新的 CSV 資料夾（例如 `Y115`）放置於 `DATA/` 目錄下。
2. 確保資料夾內含有 `*logminmax.csv` 結尾的原始資料檔案。
3. 執行資料轉換腳本：
   ```bash
   cd DATA/Script
   python convert-csv-to-ts.py
   ```
4. 腳本會自動將所有年度（包含歷史資料與新增資料）進行標準化，並重新生成前端所需的 `app/data/todData.ts` 以及 `app/data/todDetails.ts` 檔案。

## 作者資訊

本專案由以下作者開發與維護：

- **Author**: Peng, Tsung-Chun
- **Email**: ablecck12@gmail.com
- **GitHub**: [https://github.com/Nody-Peng](https://github.com/Nody-Peng)

© All rights reserved.
