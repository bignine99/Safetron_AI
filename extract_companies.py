import json
import pandas as pd
import os

INPUT_JSON = os.path.join('.raw_data', 'dashboard_data.json')
OUTPUT_JSON = os.path.join('dashboard', 'src', 'data', 'companies.json')

def main():
    print(f"Loading {INPUT_JSON}...")
    with open(INPUT_JSON, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    df = pd.DataFrame(data)
    
    # Use column search to be safe with encodings
    target_cols = [
        '시공회사명', '전문공종', '신용등급', '직원규모', '연매출규모', '안전인증보유', 
        '산업재해율(%)', '최근10년_사고건수', '최근10년_사망사고건수', '최근3년_사고추세', '보험료_등급'
    ]
    
    available_cols = [c for c in target_cols if c in df.columns]
    
    company_profiles = df.drop_duplicates('시공회사명')[available_cols].to_dict(orient='records')
    
    # Add average Risk Index per company
    if '사고위험도지수(Risk_Index)' in df.columns:
        risk_means = df.groupby('시공회사명')['사고위험도지수(Risk_Index)'].mean().to_dict()
        for p in company_profiles:
            p['avg_risk_index'] = round(float(risk_means.get(p['시공회사명'], 0)), 2)
            p['accident_count'] = int(len(df[df['시공회사명'] == p['시공회사명']]))

    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(company_profiles, f, ensure_ascii=False, indent=2)
    
    print(f"Company profiles saved to {OUTPUT_JSON} (Count: {len(company_profiles)})")

if __name__ == "__main__":
    main()
