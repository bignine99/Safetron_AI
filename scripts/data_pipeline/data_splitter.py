import pandas as pd
import numpy as np
import json
import os
import re

# 1. Configuration
INPUT_CSV = os.path.join('.raw_data', 'cleaned_safety_data_06.csv')
DASHBOARD_JSON = os.path.join('.raw_data', 'dashboard_data.json')
KG_JSONL = os.path.join('.raw_data', 'knowledge_graph_ontology.jsonl')

def main():
    print(f"Loading {INPUT_CSV}...")
    df = pd.read_csv(INPUT_CSV, encoding='utf-8-sig', low_memory=False)
    
    # 2. 불필요한 열 (인구통계학적 세부 정보 등) 정의
    demographic_cols = [
        '내국인 사망자', '외국인 사망자', '남성 사망자', '여성 사망자', 
        '10이상20미만 사망자', '20이상30미만 사망자', '30이상40미만 사망자', '40이상50미만 사망자', '50이상60미만 사망자', '60이상 사망자', 
        '내국인 부상자', '외국인 부상자', '남성 부상자', '여성 부상자', 
        '10이상20미만 부상자', '20이상30미만 부상자', '30이상40미만 부상자', '40이상50미만 부상자', '50이상60미만 부상자', '60이상 부상자'
    ]
    # '사망자', '부상자' 문자열 합계 열은 '사망자수_총합', '부상자수_총합'으로 이미 처리되어 있으므로 원본 문자열 컬럼은 삭제해도 됨.
    redundant_raw_cols = ['사망자', '부상자', '세부주소', '사고일시_Parsed', '인적사고종류(대분류)', '물적사고종류', '사고위치 장소(직접입력)', '사고위치 부위(직접입력)']
    
    text_cols = ['사고경위', '재발방지대책', '구체적사고원인', '사고발생후 조치사항', '안전관리계획', '설계안정성검토', '사고조사방법', '향후조치계획']
    
    # =========================================================
    # PART 1: Dashboard Data (JSON Array)
    # 통계분석용 구조화 데이터 (불필요한 열 제거)
    # =========================================================
    print("Generating Dashboard JSON...")
    cols_to_drop_for_dashboard = demographic_cols + redundant_raw_cols + text_cols
    df_dashboard = df.drop(columns=[c for c in cols_to_drop_for_dashboard if c in df.columns], errors='ignore')
    
    # 용량 최적화를 위해 일부 결측치 치환
    df_dashboard.fillna('', inplace=True)
    
    # JSON 파일로 변환 (Orient='records' 형태의 JSON Array)
    dashboard_records = df_dashboard.to_dict(orient='records')
    with open(DASHBOARD_JSON, 'w', encoding='utf-8') as f:
        json.dump(dashboard_records, f, ensure_ascii=False, indent=2)
    print(f" -> Dashboard JSON exported: {len(dashboard_records)} records")

    # CSV 파일로도 변환 (cleaned_safety_data_07.csv)
    OUTPUT_CSV_07 = os.path.join('.raw_data', 'cleaned_safety_data_07.csv')
    df_dashboard.to_csv(OUTPUT_CSV_07, encoding='utf-8-sig', index=False)
    print(f" -> Dashboard CSV exported: {OUTPUT_CSV_07} ({df_dashboard.shape[1]} columns)")


    # =========================================================
    # PART 2: Knowledge Graph Ontology Data (JSONL)
    # 텍스트형 데이터 기반 온톨로지 추출
    # =========================================================
    print("Generating Knowledge Graph Ontology (JSONL)...")
    
    who_keywords = ['작업자', '근로자', '반장', '소장', '기사', '신호수', '철근공', '목수', '비계공', '조적공', '용접공', '배관공', '미장공', '도장공', '운전원', '청소부', '협력업체']
    where_keywords = ['지하', '지상', '1층', '2층', '3층', '옥상', '지붕', '램프', '계단', '비계', '외부', '내부', '난간', '개구부', '피트', '엘리베이터', '주차장', '옹벽', '데크', '사다리']
    what_keywords = ['동바리', '거푸집', '가설', '사다리', '크레인', '지게차', '굴착기', '철근', '유로폼', 'H-BEAM', 'H빔', '파이프', '펌프카', '리프트', '전선', '공구', '자재', '안전대', '안전모', '안전화']
    
    ontology_list = []
    
    for idx, row in df.iterrows():
        narrative = str(row.get('사고경위', ''))
        cause_detail = str(row.get('구체적사고원인', ''))
        full_text = narrative + " " + cause_detail
        
        # Who
        who_matches = [w for w in who_keywords if w in narrative]
        if not who_matches: who_matches = ['작업자'] # fallback
        
        # Where
        where_matches = [w for w in where_keywords if w in narrative]
        
        # What
        what_matches = [w for w in what_keywords if w in full_text]
        
        # When (간단한 정규식 추출 시도)
        when_match = re.search(r'([0-9]{4}년\s*[0-9]{1,2}월\s*[0-9]{1,2}일).*?([0-9]{1,2}시(?:\s*[0-9]{1,2}분)?)', narrative)
        when_text = when_match.group(0) if when_match else str(row.get('사고_월', '알수없음')) + '월'
        
        obj = {
            "고유코드": row['고유코드'],
            "ontology": {
                "누가": list(set(who_matches)),
                "언제": when_text,
                "어디서": list(set(where_matches)),
                "무엇때문에": list(set(what_matches)),
                "사고원인": cause_detail.strip(),
                "사고결과": {
                    "유형": row.get('사고유형_분류(KOSHA)', ''),
                    "피해규모": f"사망 {row.get('사망자수_총합',0)}명, 부상 {row.get('부상자수_총합',0)}명"
                },
                "사고발생후조치": str(row.get('사고발생후 조치사항', '')).strip(),
                "재발방지대책": str(row.get('재발방지대책', '')).strip()
            },
            "raw_text": {
                "안전관리계획": str(row.get('안전관리계획', '')).strip(),
                "설계안정성검토": str(row.get('설계안정성검토', '')).strip(),
                "사고조사방법": str(row.get('사고조사방법', '')).strip(),
                "향후조치계획": str(row.get('향후조치계획', '')).strip()
            }
        }
        ontology_list.append(obj)
        
    # Write JSONL
    with open(KG_JSONL, 'w', encoding='utf-8-sig') as f:
        for r in ontology_list:
            f.write(json.dumps(r, ensure_ascii=False) + '\n')
            
    print(f" -> Knowledge Graph JSONL exported: {len(ontology_list)} records")

if __name__ == "__main__":
    main()
