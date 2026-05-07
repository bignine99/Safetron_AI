import json
import pandas as pd
import os

INPUT_JSON = os.path.join('.raw_data', 'dashboard_data.json')
OUTPUT_JSON = os.path.join('dashboard', 'src', 'data', 'summary.json')

def main():
    print(f"Loading {INPUT_JSON}...")
    with open(INPUT_JSON, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    df = pd.DataFrame(data)
    
    summary = {
        "totalAccidents": len(df),
        "uniqueCompanies": int(df['시공회사명'].nunique()),
        "avgRiskIndex": round(float(df['사고위험도지수(Risk_Index)'].mean()), 1),
        "highRiskCount": int(len(df[df['사고위험도지수(Risk_Index)'] > 80])),
        
        "typeDistribution": df['사고유형_분류(KOSHA)'].value_counts().to_dict(),
        
        "trendData": {
            "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            "values": df['사고_월'].value_counts().sort_index().tolist()
        },
        
        "topCompanies": df.groupby('시공회사명')['사고위험도지수(Risk_Index)'].mean().sort_values(ascending=False).head(10).to_dict()
    }
    
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    
    print(f"Summary saved to {OUTPUT_JSON}")

if __name__ == "__main__":
    main()
