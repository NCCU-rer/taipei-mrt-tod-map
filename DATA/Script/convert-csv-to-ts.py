# DATA/scripts/convert-csv-to-ts.py
import pandas as pd
import json
import os
import glob

def normalize_station_name(name):
    """標準化站名：移除「站」字"""
    if pd.isna(name):
        return ""
    return str(name).replace('站', '').strip()

def process_all_years(data_dir, output_dir):
    """掃描所有 YXXX 資料夾下的 logminmax.csv 檔案並轉換為 TS"""
    
    # 🔥 明確指定只抓取 Y 開頭資料夾內的 *logminmax.csv
    search_pattern = os.path.join(data_dir, 'Y*', '*logminmax.csv')
    csv_files = glob.glob(search_pattern)
    
    if not csv_files:
        print(f"❌ 在 {data_dir} 找不到任何 YXXX 資料夾或對應的 CSV 檔案")
        return
        
    print(f"🔍 總共找到 {len(csv_files)} 個檔案，準備處理多個年份...\n")
    
    tod_details = {}
    
    # 定義指標名稱與雷達圖標籤
    indicators = [
        "步行友善度", "自行車便利度", "街道連通度", "大眾運輸可達度",
        "生活機能多樣性", "都市密度強度", "區域整合度", "低汽車依賴度"
    ]
    
    radar_labels = {
        "步行友善度": "步行友善", "自行車便利度": "自行車",
        "街道連通度": "街道連通", "大眾運輸可達度": "大眾運輸",
        "生活機能多樣性": "生活機能", "都市密度強度": "都市密度",
        "區域整合度": "區域整合", "低汽車依賴度": "低汽車依賴"
    }

    for csv_path in csv_files:
        basename = os.path.basename(csv_path)
        
        # 🔥 解析檔名，例如 "114年_150M_logminmax.csv" -> year="114", buffer="150"
        try:
            parts = basename.split('_')
            year = parts[0].replace('年', '')
            buffer = parts[1].upper().replace('M', '')
        except Exception as e:
            print(f"⚠️ 無法解析檔名: {basename}，跳過此檔")
            continue
            
        print(f"處理 👉 {year}年 {buffer}m 資料 ({basename})...")
        
        df = pd.read_csv(csv_path, encoding='utf-8')
        
        for _, row in df.iterrows():
            station_name = normalize_station_name(row.get('NAME'))
            if not station_name:
                continue
                
            # 檢查 TOD 分數是否存在
            if pd.isna(row.get('TOD整體分數')):
                continue
                
            tod_score = float(row['TOD整體分數'])
            # 修正 Y114 分數為 0~1 的問題，統一轉換為百分制 (0~100)
            if tod_score <= 1.0:
                tod_score *= 100
            count = int(row['交易物件數量']) if pd.notna(row.get('交易物件數量')) else None
            price = round(float(row['建物單價元/坪']), 2) if pd.notna(row.get('建物單價元/坪')) else None
            
            # 提取指標數據
            indicator_data = {}
            for ind in indicators:
                val = row.get(ind, 0)
                indicator_data[ind] = float(val) if pd.notna(val) else 0.0
                
            # 雷達圖資料
            radar_data = [
                {"subject": radar_labels[ind], "value": round(indicator_data[ind], 3)}
                for ind in indicators
            ]
            
            # 初始化字典結構：tod_details[站名][年份][環域]
            if station_name not in tod_details:
                tod_details[station_name] = {}
            if year not in tod_details[station_name]:
                tod_details[station_name][year] = {}
                
            tod_details[station_name][year][buffer] = {
                "score": round(tod_score, 2),
                "count": count,
                "price": price,
                "raw": indicator_data,       
                "normalized": indicator_data,
                "radar": radar_data
            }

    # 確保輸出目錄存在
    os.makedirs(output_dir, exist_ok=True)

    # 收集統計資訊
    years_sorted = sorted({y for s in tod_details.values() for y in s.keys()})
    buffers_sorted = sorted({b for s in tod_details.values() for y in s.values() for b in y.keys()})

    print(f"\n📊 處理完成，共彙整了 {len(tod_details)} 個站點！")
    print(f"涵蓋年份: {', '.join(years_sorted)}")
    print(f"涵蓋環域: {', '.join(buffers_sorted)}m\n")

    # ========== 生成 todDetails.ts ==========
    details_output = os.path.join(output_dir, 'todDetails.ts')
    with open(details_output, 'w', encoding='utf-8') as f:
        f.write("// Auto-generated from CSV data\n")
        f.write("// 請勿手動編輯此檔案\n")
        f.write(f"// 包含年份: {', '.join(years_sorted)}\n")
        f.write(f"// 包含環域: {', '.join(buffers_sorted)}m\n\n")
        
        f.write("export interface TODDetailData {\n")
        f.write("  score: number;\n")
        f.write("  count: number | null;\n")
        f.write("  price: number | null;\n")
        f.write("  raw: Record<string, number>;\n")
        f.write("  normalized: Record<string, number>;\n")
        f.write("  radar: Array<{ subject: string; value: number }>;\n")
        f.write("}\n\n")
        
        f.write("export const TOD_DETAILS: Record<string, Record<string, Record<string, TODDetailData>>> = ")
        f.write(json.dumps(tod_details, indent=2, ensure_ascii=False))
        f.write(";\n")
    
    print(f"✅ todDetails.ts 已生成: {details_output}")
    
    # ========== 生成 todData.ts ==========
    tod_data = {}
    for station_name, years_data in tod_details.items():
        tod_data[station_name] = {}
        for year, buffers_data in years_data.items():
            for buffer, detail in buffers_data.items():
                key = f"{year}_{buffer}"
                tod_data[station_name][key] = detail["score"]
                
    data_output = os.path.join(output_dir, 'todData.ts')
    with open(data_output, 'w', encoding='utf-8') as f:
        f.write("// Auto-generated from CSV data\n")
        f.write("// 請勿手動編輯此檔案\n")
        f.write(f"// 包含年份: {', '.join(years_sorted)}\n")
        f.write(f"// 包含環域: {', '.join(buffers_sorted)}m\n\n")
        
        f.write("export const TOD_DATA: Record<string, Record<string, number>> = ")
        f.write(json.dumps(tod_data, indent=2, ensure_ascii=False))
        f.write(";\n\n")
        f.write("export const AVAILABLE_YEARS = Array.from(\n")
        f.write("  new Set(\n")
        f.write("    Object.values(TOD_DATA)\n")
        f.write("      .flatMap((station) => Object.keys(station))\n")
        f.write("      .map((key) => key.split('_')[0])\n")
        f.write("  )\n")
        f.write(").sort((a, b) => Number(b) - Number(a));\n")
        
    print(f"✅ todData.ts 已生成: {data_output}")

if __name__ == "__main__":
    # 根據你的資料夾結構設定路徑
    SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
    DATA_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, '..')) 
    OUTPUT_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, '../../app/data'))
    
    print(f"📁 資料目錄: {DATA_DIR}")
    print(f"📁 輸出目錄: {OUTPUT_DIR}\n")
    
    process_all_years(DATA_DIR, OUTPUT_DIR)