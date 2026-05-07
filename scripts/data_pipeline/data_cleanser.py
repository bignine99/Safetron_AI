import pandas as pd
import numpy as np
import os
import re

# 1. Configuration
INPUT_CSV = os.path.join('.raw_data', '국토안전관리원_건설안전사고사례_20250630.csv')
OUTPUT_CSV = os.path.join('.raw_data', 'cleaned_safety_data_06.csv')

# 2. Utility Functions

def parse_damage_cost(val):
    if pd.isna(val) or val == '미입력': return 0
    val = str(val).strip()
    m = {'1,000만원 미만':500,'1,000만 ~ 5,000만원 미만':3000,'5,000만 ~ 1억원 미만':7500,
         '1억 ~ 5억원 미만':30000,'5억 ~ 10억원 미만':75000,'10억 ~ 20억원 미만':150000,
         '20억 ~ 50억원 미만':350000,'50억 ~ 100억원 미만':750000,'100억원 이상':1500000}
    return m.get(val, 0)

def parse_workers_count(val):
    if pd.isna(val) or val == '미입력': return 0
    val = str(val).strip()
    m = {'20인 미만':10,'20~49인':35,'50~99인':75,'100~299인':200,'300~499인':400,'500인 이상':500}
    return m.get(val, 0)

def parse_accident_name(name):
    res = {'프로젝트명':'','도':'','시':'','세부주소':'','업체명':''}
    if pd.isna(name): return pd.Series(res)
    name = str(name).strip()
    cm = re.search(r'_([^\s]+)$', name)
    if cm:
        res['업체명'] = cm.group(1).strip()
        name = name[:cm.start()].strip()
    am = re.match(r'^([가-힣]+(?:도|특별시|광역시|자치시))\s+([가-힣]+(?:시|군|구))\s+(.+)', name)
    if am:
        res['도'] = am.group(1).strip()
        res['시'] = am.group(2).strip()
        rem = am.group(3).strip()
        sm = re.match(r'^([가-힣]+(?:동|읍|면|리)\s*[\d\-\~외필지]+)\s+(.+)', rem)
        if sm:
            res['세부주소'] = sm.group(1).strip()
            res['프로젝트명'] = sm.group(2).strip()
        else:
            parts = rem.split(' ', 1)
            res['세부주소'] = parts[0] if len(parts)==2 else ''
            res['프로젝트명'] = parts[1] if len(parts)==2 else rem
    else:
        res['프로젝트명'] = name
    return pd.Series(res)

# --- KOSHA Mappings ---
def map_accident_type(val):
    val = str(val).strip()
    if '떨어짐' in val or '추락' in val: return '떨어짐(추락)'
    if '넘어짐' in val or '전도' in val: return '넘어짐(전도)'
    if '끼임' in val or '협착' in val: return '끼임(협착)'
    if '부딪힘' in val or '충돌' in val: return '부딪힘(충돌)'
    if '맞음' in val or '낙하' in val: return '맞음(낙하/비래)'
    if '무너짐' in val or '붕괴' in val or '매몰' in val: return '무너짐(붕괴)'
    if '절단' in val or '베임' in val or '찔림' in val: return '베임/찔림/찰과상'
    if '깔림' in val or '뒤집힘' in val or '전복' in val: return '깔림/전복'
    if '화재' in val or '폭발' in val: return '화재/폭발'
    if '감전' in val: return '감전'
    if '질식' in val or '중독' in val: return '질식/중독'
    return '기타'

def map_accident_object(val):
    val = str(val).strip()
    if any(k in val for k in ['비계','동바리','거푸집','가시설']): return '가설구조물/거푸집'
    if any(k in val for k in ['굴착기','기중기','트럭','콘크리트펌프','크레인','건설기계']): return '건설기계장비'
    if any(k in val for k in ['토사','암석','지반','옹벽','굴착면']): return '지반/토사/구조물'
    if any(k in val for k in ['공구','전동기','용접기','절단기']): return '기계/수공구'
    if any(k in val for k in ['자재','철근','시멘트','파이프','H빔','유리']): return '건설자재(철근/파이프등)'
    if any(k in val for k in ['전기','전선','케이블']): return '전기차단/가설전선'
    return '기타(일반객체)'

def map_hierarchical_construction(major_cat, minor_cat):
    major_cat = str(major_cat).strip()
    minor_cat = str(minor_cat).strip()
    text = f"{major_cat} {minor_cat}"
    if '건축' in major_cat or '수장' in minor_cat or '조적' in minor_cat or '미장' in minor_cat or '도장' in minor_cat or '목공사' in minor_cat or '금속' in minor_cat:
        g = '건축공사'
        if '가설' in text: return g,'02 가설공사'
        if '철근콘크리트' in text: return g,'03 철근콘크리트공사'
        if '강구조물' in text: return g,'04 강구조물공사'
        if '철골' in text: return g,'05 철골공사'
        if '조적' in text: return g,'06 조적공사'
        if '미장' in text: return g,'07 미장공사'
        if '방수' in text or '코킹' in text: return g,'08 방수코킹공사'
        if '단열' in text: return g,'09 단열공사'
        if '타일' in text: return g,'10 타일공사'
        if '석공사' in text: return g,'11 석공사'
        if '창호' in text: return g,'12 창호공사'
        if '금속' in text: return g,'13 금속공사'
        if '유리' in text: return g,'14 유리공사'
        if '수장' in text or '목공사' in text: return g,'15 목수장공사'
        if '도장' in text: return g,'16 도장공사'
        if '지붕' in text: return g,'17 지붕잡공사'
        return g,'01 공통공사'
    elif '토목' in major_cat or '도로' in minor_cat or '하천' in minor_cat or '교량' in minor_cat or '터널' in minor_cat:
        g = '토목공사'
        if '가설' in text: return g,'02 가설공사'
        if '토공사' in text: return g,'03 토공사'
        if '흙막이' in text: return g,'04 흙막이공사'
        if '구조물' in text: return g,'05 구조물공사'
        if '우오수' in text or '배수' in text: return g,'06 우오수 및 배수공사'
        if '포장' in text: return g,'08 포장공사'
        if '옹벽' in text or '담장' in text: return g,'10 옹벽 및 담장공사'
        return g,'01 공통공사'
    elif '조경' in major_cat or '조경' in minor_cat or '식재' in minor_cat:
        g = '조경공사'
        if '식재' in text: return g,'06 식재공사'
        return g,'01 공통공사'
    elif '전기설비' in major_cat or '통신설비' in major_cat or '전기' in minor_cat:
        g = '전기공사'
        if '배선' in text or '배관' in text: return g,'07 배선배관공사'
        return g,'01 공통공사'
    elif '기계설비' in major_cat or '산업설비' in major_cat:
        if '소방' in text or '화재' in text: return '소방공사','01 공통공사'
        g = '기계설비공사'
        if '배관' in text: return g,'11 배관설비공사'
        return g,'01 공통공사'
    else:
        if '가설' in minor_cat: return '건축공사','02 가설공사'
        return '기타분류','기타'

# ============================================================
# 3. 가상 건설사 1,275개 생성 함수
# ============================================================
def generate_companies(n_total=1275):
    """공종별로 1,275개 가상 건설사 프로필을 생성합니다. 숫자 없이 자연스러운 사명."""
    np.random.seed(42)
    
    prefixes = [
        '대한','한양','삼성','현대','동아','포스코','금호','롯데','쌍용','태영',
        '한진','두산','대림','호반','제일','계룡','한화','코오롱','신세계','중앙',
        '유진','한라','부영','이수','동부','우림','삼부','경남','진흥','동원',
        '성원','세종','남광','풍림','극동','벽산','한신','동문','일성','서희',
        '반도','모아','우미','라인','대보','영무','한일','범양','동양','경동',
        '삼호','태평양','신동아','광명','선진','대우','강남','미래','동성','한국',
        '서울','인천','경기','부산','대전','광주','울산','세한','남해','동해',
        '백두','지평','하나','청우','우정','도화','건양','국보','보성','효성',
        '남성','중흥','진로','도원','명성','한마음','새한','우진','천일','삼환',
        '태광','금성','대명','동건','한성','유성','일진','신한','정원','삼정',
        '덕산','화성','로얄','동진','한솔','일신','동화','보광','청구','삼진',
        '보림','화인','동서','한백','라온','비전','대성','한중','경보','신성',
        '청솔','녹원','범한','정우','한주','동광','서진','승일','태성','고려',
    ]
    
    # 자연스러운 접미사 (130 접두 × 10 접미 = 1,300 고유 조합 → 숫자 불필요)
    suffixes = [
        '건설', '종합건설', '건설산업', '엔지니어링', '건설개발',
        'E&C', '미래산업', '건축', '건설기술', '씨앤씨',
    ]
    
    corp_types = ['(주)','주식회사 ']
    
    # 공종별 회사 수 배분
    gongsa_alloc = {
        '건축공사': 500, '토목공사': 350, '전기공사': 150,
        '기계설비공사': 120, '조경공사': 80, '소방공사': 45, '기타분류': 30
    }
    
    cg = ['AAA','AA+','AA','A+','A','BBB+','BBB','BB+','BB','B+','B']
    er = ['50인 미만','50~99인','100~299인','300~499인','500~999인','1000인 이상']
    rv = ['100억 미만','100~500억','500~1000억','1000~3000억','3000~5000억','5000억~1조','1조 이상']
    ct_opts = ['ISO 45001','KOSHA-MS','ISO 45001 + KOSHA-MS','없음']
    
    # 전체 고유 이름 풀을 미리 생성 (접두 × 접미 × 법인유형)
    name_pool = []
    for ci, ct in enumerate(corp_types):
        for pi, pf in enumerate(prefixes):
            for si, sf in enumerate(suffixes):
                name_pool.append(f"{ct}{pf}{sf}")
    # 셔플하여 다양하게 배분
    np.random.shuffle(name_pool)
    
    all_profiles = {}
    gongsa_map = {}
    name_idx = 0
    
    for gongsa, count in gongsa_alloc.items():
        cos = []
        for j in range(count):
            nm = name_pool[name_idx]
            name_idx += 1
            
            tier = min(j // (count // 5 + 1), 4)
            cr_i = max(0, min(tier*2 + np.random.randint(-1,2), len(cg)-1))
            
            # 현실적 산업재해율: 대형 0.01~0.08%, 소형 0.05~0.25%
            ir_low = 0.01 + tier * 0.01
            ir_high = 0.08 + tier * 0.04
            ir_val = round(np.random.uniform(ir_low, ir_high), 3)
            
            # 현실적 사고건수: 대형사 8~25건, 소형사 1~8건 (10년 누적)
            acc_lo = max(1, 8 - tier * 2)
            acc_hi = max(3, 25 - tier * 5)
            acc_cnt = np.random.randint(acc_lo, acc_hi + 1)
            
            # 현실적 사망건수: 대부분 0, 대형사도 최대 2~3건
            death_weights = {0:[0.4,0.3,0.2,0.07,0.03], 1:[0.5,0.3,0.15,0.05,0],
                            2:[0.6,0.25,0.1,0.05,0], 3:[0.7,0.2,0.07,0.03,0], 4:[0.8,0.15,0.05,0,0]}
            d_probs = death_weights.get(tier, death_weights[4])
            death_cnt = np.random.choice([0,1,2,3,4], p=d_probs)
            death_cnt = min(death_cnt, acc_cnt)  # 사망건수 <= 사고건수
            
            all_profiles[nm] = {
                '전문공종': gongsa,
                '신용등급': cg[cr_i],
                '직원규모': er[max(0, min(5-tier+np.random.randint(-1,1), len(er)-1))],
                '연매출규모': rv[max(0, min(6-tier+np.random.randint(-1,1), len(rv)-1))],
                '안전인증보유': ct_opts[min(tier,2)] if tier<3 else np.random.choice(ct_opts),
                '안전관리비_투자비율(%)': round(np.random.uniform(max(1.0,3.5-tier*0.5), max(2.0,4.5-tier*0.4)), 2),
                '하도급비율(%)': round(np.random.uniform(20+tier*5, 45+tier*7), 1),
                '산업재해율(%)': ir_val,
                '최근10년_사고건수': acc_cnt,
                '최근10년_사망사고건수': death_cnt,
            }
            cos.append(nm)
        gongsa_map[gongsa] = cos
    
    return all_profiles, gongsa_map

# 4. Main Pipeline
def main():
    print(f"Loading raw data from: {INPUT_CSV}")
    try:
        df = pd.read_csv(INPUT_CSV, encoding='cp949')
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return

    print(f"Original shape: {df.shape}")
    df.replace('미입력', '기타', inplace=True)
    
    # --- Time ---
    print("Parsing Datetimes...")
    df['사고일시_Parsed'] = pd.to_datetime(df['사고일시'], errors='coerce')
    df['사고_연도'] = df['사고일시_Parsed'].dt.year.fillna(0).astype(int)
    df['사고_월'] = df['사고일시_Parsed'].dt.month.fillna(0).astype(int)
    df['사고_시간대'] = df['사고일시_Parsed'].dt.hour.fillna(-1).astype(int)

    # --- Numeric ---
    print("Normalizing Numeric Variables...")
    df['피해금액_정규화(만원)'] = df['피해금액'].apply(parse_damage_cost)
    df['작업자수_정규화(명)'] = df['작업자수'].apply(parse_workers_count)
    df['사망자수_총합'] = pd.to_numeric(df['사망자'], errors='coerce').fillna(0).astype(int)
    df['부상자수_총합'] = pd.to_numeric(df['부상자'], errors='coerce').fillna(0).astype(int)

    # --- Parse Name ---
    print("Parsing Accident Names...")
    parsed = df['사고명'].apply(parse_accident_name)
    df = pd.concat([df, parsed], axis=1)
    df['고유코드'] = df.apply(lambda r: f"{r['사고_연도'] if r['사고_연도']>0 else 0}-{str(r.name+1).zfill(5)}", axis=1)

    # --- Duration ---
    print("Calculating durations...")
    s = pd.to_datetime(df['해당공종 공사시작일'], errors='coerce')
    e = pd.to_datetime(df['해당공종 공사종료일'], errors='coerce')
    df['작업중지일수(추정)'] = (e - s).dt.days.fillna(0).clip(lower=0).astype(int)

    # Reorder
    drop_cols = ['사고명','사고일시']
    front = ['고유코드','프로젝트명','도','시','세부주소','업체명']
    other = [c for c in df.columns if c not in front + drop_cols]
    df = df[front + other]

    # --- KOSHA ---
    print("Applying KOSHA Mappings...")
    mapped = df.apply(lambda r: map_hierarchical_construction(r.get('공종(대분류)',''), r.get('공종(소분류)','')), axis=1)
    df['공사_분류(표준)'] = [x[0] for x in mapped]
    df['대공종_분류(표준)'] = [x[1] for x in mapped]
    df['사고유형_분류(KOSHA)'] = df['인적사고종류(대분류)'].apply(map_accident_type)
    df['사고객체_분류(KOSHA)'] = df['사고객체(대분류)'].apply(map_accident_object)

    # ============================================================
    # --- Step 5: 1,275개 가상 시공회사 (공종별 배치) ---
    # ============================================================
    print("Generating 1,275 virtual companies by construction type...")
    all_profiles, gongsa_map = generate_companies(1275)
    print(f"  -> {len(all_profiles)}개 가상 건설사 생성 완료")
    
    # 공종 매칭 회사 배정
    def assign_company(gongsa_val):
        cos = gongsa_map.get(gongsa_val)
        if not cos:
            cos = gongsa_map.get('기타분류', gongsa_map['건축공사'])
        return np.random.choice(cos)
    
    df['시공회사명'] = df['공사_분류(표준)'].apply(assign_company)
    
    for k in ['신용등급','직원규모','연매출규모','안전인증보유',
              '안전관리비_투자비율(%)','하도급비율(%)','산업재해율(%)',
              '최근10년_사고건수','최근10년_사망사고건수']:
        df[k] = df['시공회사명'].map(lambda n: all_profiles[n][k])
    
    # 보험료 등급
    csm = {'AAA':5,'AA+':4.5,'AA':4,'A+':3.5,'A':3,'BBB+':2.5,'BBB':2,'BB+':1.5,'BB':1,'B+':0.5,'B':0}
    pl = ['S등급(최우량)','A등급(우량)','B등급(보통)','C등급(주의)','D등급(위험)']
    cert_sc = {'ISO 45001 + KOSHA-MS':3,'ISO 45001':2,'KOSHA-MS':1.5,'없음':0}
    
    def calc_pg(row):
        cs = csm.get(row['신용등급'],1)
        si = row['안전관리비_투자비율(%)']
        ir = row['산업재해율(%)']
        sub = row['하도급비율(%)']
        ct_s = cert_sc.get(row['안전인증보유'],0)
        comp = cs*2 + si*2 + ct_s*1.5 - ir*8 - (sub/25)
        if comp > 16: return pl[0]
        elif comp > 13: return pl[1]
        elif comp > 10: return pl[2]
        elif comp > 7: return pl[3]
        else: return pl[4]
    
    df['보험료_등급'] = df.apply(calc_pg, axis=1)
    df['최근3년_사고추세'] = np.random.choice(['감소추세','유지','증가추세'], size=len(df), p=[0.35,0.40,0.25])

    # ============================================================
    # --- Step 6: Risk Index (2nd-max = 100점) ---
    # ============================================================
    print("Calculating Risk Index...")
    risk_raw = (
        df['사망자수_총합']*50 + df['부상자수_총합']*5 +
        np.log1p(df['피해금액_정규화(만원)'])*1.5 +
        np.log1p(df['작업중지일수(추정)'])*0.5
    )
    sorted_scores = risk_raw.sort_values(ascending=False).unique()
    ref = sorted_scores[1] if len(sorted_scores)>1 else sorted_scores[0]
    norm = (risk_raw / ref) * 100
    df['이상치_플래그'] = np.where(norm > 100, '극단적이상치(예외처리)', '')
    df['사고위험도지수(Risk_Index)'] = norm.clip(upper=100).round(2)

    # --- Export ---
    print(f"Exporting to: {OUTPUT_CSV}")
    df.to_csv(OUTPUT_CSV, encoding='utf-8-sig', index=False)
    
    print(f"Done. Shape: {df.shape}")
    print(f"마지막 열: {df.columns[-1]}")
    
    # 검증
    unique_cos = df['시공회사명'].nunique()
    print(f"\n고유 시공회사 수: {unique_cos}")
    print(f"\n=== 공종별 회사 수 ===")
    co_gongsa = df.drop_duplicates('시공회사명')[['시공회사명','공사_분류(표준)']].copy()
    co_gongsa['전문공종'] = co_gongsa['시공회사명'].map(lambda n: all_profiles[n]['전문공종'])
    print(co_gongsa['전문공종'].value_counts().to_string())
    
    print(f"\n=== 보험료 등급 분포 ===")
    for g in pl:
        cnt = (df['보험료_등급']==g).sum()
        print(f"  {g}: {cnt:,}건 ({cnt/len(df)*100:.1f}%)")
    
    top5 = df.nlargest(5, '사고위험도지수(Risk_Index)')
    print(f"\n=== Risk Index Top 5 ===")
    print(top5[['고유코드','사망자수_총합','부상자수_총합','이상치_플래그','사고위험도지수(Risk_Index)']].to_string())

if __name__ == "__main__":
    main()
