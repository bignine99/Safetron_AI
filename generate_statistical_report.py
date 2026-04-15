import pandas as pd
import numpy as np
import json
import re
from scipy.stats import pearsonr
import statsmodels.api as sm
import os

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer): return int(obj)
        if isinstance(obj, np.floating): return float(obj)
        if isinstance(obj, np.ndarray): return obj.tolist()
        return super(NpEncoder, self).default(obj)

CSV_PATH = r'c:\Users\cho\Desktop\Temp\05_1_code\260410_safety_dashboard\.raw_data\08.csv'
JSON_OUT_PATH = r'c:\Users\cho\Desktop\Temp\05_1_code\260410_safety_dashboard\dashboard\public\data\statistical_report.json'

os.makedirs(os.path.dirname(JSON_OUT_PATH), exist_ok=True)

try:
    df = pd.read_csv(CSV_PATH, encoding='utf-8', low_memory=False)
except UnicodeDecodeError:
    df = pd.read_csv(CSV_PATH, encoding='cp949', low_memory=False)

def clean_numeric(val):
    if pd.isna(val): return np.nan
    val = str(val).strip()
    if val in ['-', '미상', '']: return np.nan
    val = re.sub(r'[^\d.-]', '', val)
    try:
        return float(val)
    except:
        return np.nan

def clean_progress(val):
    if pd.isna(val): return np.nan
    val = str(val).strip()
    if '미만' in val:
        parts = re.findall(r'\d+', val)
        if parts: return float(parts[0]) / 2 # e.g. 10% 미만 -> 5.0
        return 5.0
    elif '이상' in val:
        parts = re.findall(r'\d+', val)
        if parts: return float(parts[0]) # e.g. 90% 이상 -> 90.0
        return 95.0
    elif '~' in val:
        parts = re.findall(r'\d+', val)
        if len(parts) >= 2:
            return (float(parts[0]) + float(parts[1])) / 2 # e.g. 10~19% -> 14.5
    return clean_numeric(val) # fallback

# Define our variables
for c in ['온도', '습도', '연면적']:
    if c in df.columns:
        df[c] = df[c].apply(clean_numeric)

if '공정율' in df.columns:
    df['공정율'] = df['공정율'].apply(clean_progress)

dependent_vars = ['피해금액_정규화(만원)', '작업중지일수(추정)', '사고위험도지수(Risk_Index)']
# Also count of accidents is a derived dependent var. We can ignore it for continuous regressions

indep_numeric = ['온도', '습도', '연면적', '공정율', '작업자수_정규화(명)', '최근10년_사고건수', '최근10년_사망사고건수', '안전관리비_투자비율(%)', '하도급비율(%)', '산업재해율(%)']
indep_numeric = [c for c in indep_numeric if c in df.columns]

categorical_vars = ['도', '공공민간구분', '공사종류', '대공종', '공사 분류', '시설물 분류', '사고위치 부위', '사고유형_분류(KOSHA)', '사고객체_분류(KOSHA)']

out = {
    'descriptive': {'numeric': [], 'categorical': []},
    'correlation': [],
    'regression': {'simple': [], 'multiple': []}
}

print("Running Descriptive Stats...")
# Descriptive stats: Numeric
for c in indep_numeric + dependent_vars:
    if c not in df.columns: continue
    s = df[c].dropna()
    if len(s) == 0: continue
    
    # Custom Binning Logic
    if c == '온도':
        bins = [-np.inf] + list(range(-20, 40, 5)) + [np.inf]
        labels = ['-20 미만'] + [f"{i}~{i+5}" for i in range(-20, 35, 5)] + ['35 이상']
        hist_counts, _ = np.histogram(s, bins=bins)
        chart_bins = [{'bin': label, 'count': int(count)} for label, count in zip(labels, hist_counts)]
    elif c == '습도':
        bins = [-np.inf] + list(range(0, 110, 10)) + [np.inf]
        labels = ['0 미만'] + [f"{i}~{i+10}" for i in range(0, 100, 10)] + ['100 이상']
        hist_counts, _ = np.histogram(s, bins=bins)
        chart_bins = [{'bin': label, 'count': int(count)} for label, count in zip(labels, hist_counts)]
    elif c == '공정율':
        bins = [-np.inf] + list(range(0, 110, 10)) + [np.inf]
        labels = ['0 미만'] + [f"{i}~{i+10}%" for i in range(0, 100, 10)] + ['100% 이상']
        hist_counts, _ = np.histogram(s, bins=bins)
        chart_bins = [{'bin': label, 'count': int(count)} for label, count in zip(labels, hist_counts)]
    elif c == '연면적':
        bins = [-np.inf, 5000, 10000, 30000, 50000, 100000, 300000, 500000, 1000000, 5000000, np.inf]
        labels = ['5천 미만', '5천~1만', '1만~3만', '3만~5만', '5만~10만', '10만~30만', '30만~50만', '50만~100만', '100만~500만', '500만 이상']
        hist_counts, _ = np.histogram(s, bins=bins)
        chart_bins = [{'bin': label, 'count': int(count)} for label, count in zip(labels, hist_counts)]
    elif c == '작업자수_정규화(명)':
        # The data already has discrete normalized midpoints: 0(<=19 & 기타), 35(20~49), 75(50~99), 200(100~299), 400(300~499), 500(>=500)
        bins = [-np.inf, 1, 40, 80, 250, 450, np.inf]
        labels = ['19인 이하 및 기타', '20~49인', '50~99인', '100~299인', '300~499인', '500인 이상']
        hist_counts, _ = np.histogram(s, bins=bins)
        chart_bins = [{'bin': label, 'count': int(count)} for label, count in zip(labels, hist_counts)]
    elif c == '최근10년_사고건수':
        bins = [-np.inf, 0.5, 5.5, 10.5, 15.5, 20.5, np.inf]
        labels = ['0건', '1~5건', '6~10건', '11~15건', '16~20건', '21건 이상']
        hist_counts, _ = np.histogram(s, bins=bins)
        chart_bins = [{'bin': label, 'count': int(count)} for label, count in zip(labels, hist_counts)]
    elif c == '최근10년_사망사고건수':
        bins = [-np.inf, 0.5, 1.5, 2.5, 3.5, np.inf]
        labels = ['0건', '1건', '2건', '3건', '4건 이상']
        hist_counts, _ = np.histogram(s, bins=bins)
        chart_bins = [{'bin': label, 'count': int(count)} for label, count in zip(labels, hist_counts)]
    elif c == '피해금액_정규화(만원)':
        # Use the raw '피해금액' categorical column because the normalized column was incorrectly binarized
        raw_counts = df['피해금액'].value_counts()
        labels = [
            '피해없음/기타', '1,000만원 미만', '1,000만원 이상 ~ 2,000만원 미만', 
            '2,000만원 이상 ~ 5,000만원 미만', '5,000만원 이상 ~ 1억원 미만', 
            '1억원 이상 ~ 2억원 미만', '2억원 이상 ~ 5억원 미만', '5억원 이상'
        ]
        chart_bins = []
        for lbl in labels:
            if lbl == '피해없음/기타':
                count = raw_counts.get('피해없음', 0) + raw_counts.get('기타', 0)
            else:
                count = raw_counts.get(lbl, 0)
            chart_bins.append({'bin': lbl.replace(' 이상 ~ ', '~').replace(' 미만', '').replace('원', ''), 'count': int(count)})
    elif c == '작업중지일수(추정)':
        bins = [-np.inf, 10, 50, 100, 300, 500, 1000, 2000, np.inf]
        labels = ['10일 미만', '10~50일', '51~100일', '101~300일', '301~500일', '501~1000일', '1000~2000일', '2000일 이상']
        hist_counts, _ = np.histogram(s, bins=bins)
        chart_bins = [{'bin': label, 'count': int(count)} for label, count in zip(labels, hist_counts)]
    elif c == '사고위험도지수(Risk_Index)':
        bins = [-np.inf, 1, 2, 3, 4, 5, 10, 20, np.inf]
        labels = ['1미만', '1~2', '2~3', '3~4', '4~5', '5~10', '10~20', '20 이상']
        hist_counts, _ = np.histogram(s, bins=bins)
        chart_bins = [{'bin': label, 'count': int(count)} for label, count in zip(labels, hist_counts)]
    elif c == '산업재해율(%)':
        bins = [-np.inf, 0.02, 0.04, 0.06, 0.08, 0.1, 0.15, 0.2, 0.3, np.inf]
        labels = ['0.02% 미만', '0.02~0.04%', '0.04~0.06%', '0.06~0.08%', '0.08~0.10%', '0.10~0.15%', '0.15~0.20%', '0.20~0.30%', '0.30% 이상']
        hist_counts, _ = np.histogram(s, bins=bins)
        chart_bins = [{'bin': label, 'count': int(count)} for label, count in zip(labels, hist_counts)]
    else:
        # For other numeric vars, we clean up the bin edges to nice numbers if possible
        hist_counts, bin_edges = np.histogram(s, bins=10)
        chart_bins = [{'bin': f"{round(bin_edges[i],1)}~{round(bin_edges[i+1],1)}", 'count': int(count)} for i, count in enumerate(hist_counts)]

    out['descriptive']['numeric'].append({
        'feature': c,
        'count': len(s),
        'mean': round(s.mean(), 2),
        'min': round(s.min(), 2),
        'max': round(s.max(), 2),
        'std': round(s.std(), 2),
        'histogram': chart_bins
    })

# Descriptive stats: Categorical
for c in categorical_vars:
    if c not in df.columns: continue
    counts = df[c].value_counts().head(15)
    out['descriptive']['categorical'].append({
        'feature': c,
        'counts': [{'label': str(k), 'count': int(v)} for k, v in counts.items()]
    })

print("Running Correlation...")
# Correlation Matrix (combining num and dep)
all_numeric = indep_numeric + dependent_vars
for i, c1 in enumerate(all_numeric):
    for j, c2 in enumerate(all_numeric):
        if i >= j: continue
        valid = df[[c1, c2]].dropna()
        if len(valid) > 10:
            r, p = pearsonr(valid[c1], valid[c2])
            if not np.isnan(r):
                out['correlation'].append({
                    'var1': c1, 'var2': c2,
                    'r': round(r, 4), 'p': round(p, 4)
                })

# Sort correlations descending by absolute r
sorted_corr = sorted([x for x in out['correlation'] if x['var1'] in indep_numeric and x['var2'] in dependent_vars], key=lambda x: abs(x['r']), reverse=True)

print("Running Simple Regression...")
# Simple Regression for top correlated individually
for corr in sorted_corr[:10]:
    x_col, y_col = corr['var1'], corr['var2']
    valid = df[[x_col, y_col]].dropna()
    X = sm.add_constant(valid[x_col])
    Y = valid[y_col]
    model = sm.OLS(Y, X).fit()
    
    # Subsample for chart
    sub = valid.sample(min(200, len(valid)), random_state=42)
    chart_data = [{'x': round(row[x_col],2), 'y': round(row[y_col],2)} for _, row in sub.iterrows()]
    
    out['regression']['simple'].append({
        'x': x_col, 'y': y_col,
        'r2': round(model.rsquared, 4),
        'coef': round(model.params[x_col], 4) if x_col in model.params else 0,
        'intercept': round(model.params['const'], 4) if 'const' in model.params else 0,
        'p_value': round(model.pvalues[x_col], 4) if x_col in model.pvalues else 0,
        'chart_data': chart_data
    })

print("Running Multiple Regression...")
# Multiple Regression using top 3 independent variables
top_indep = []
temp_sorted = sorted([x for x in out['correlation'] if x['var1'] in indep_numeric and x['var2'] in indep_numeric], key=lambda x: abs(x['r']))
# Just blindly pick top 3 unique features that correlate well with dependent vars
unique_indeps = []
for c in sorted_corr:
    if c['var1'] not in unique_indeps:
        unique_indeps.append(c['var1'])
    if len(unique_indeps) >= 3:
        break

if len(unique_indeps) >= 3:
    for y_col in dependent_vars:
        if y_col not in df.columns: continue
        valid = df[unique_indeps + [y_col]].dropna()
        if len(valid) > 10:
            X = sm.add_constant(valid[unique_indeps])
            Y = valid[y_col]
            model = sm.OLS(Y, X).fit()
            
            coefs = {col: round(model.params[col], 4) for col in unique_indeps if col in model.params}
            p_values = {col: round(model.pvalues[col], 4) for col in unique_indeps if col in model.pvalues}
            
            # Predict
            valid['pred'] = model.predict(X)
            sub = valid.sample(min(150, len(valid)), random_state=42)
            scatter = [{'actual': round(r[y_col],2), 'predicted': round(r['pred'],2)} for _, r in sub.iterrows()]

            out['regression']['multiple'].append({
                'y': y_col,
                'features': unique_indeps,
                'r2': round(model.rsquared, 4),
                'coefs': coefs,
                'p_values': p_values,
                'chart_data': scatter
            })

with open(JSON_OUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2, cls=NpEncoder)

print(f"Stats generation complete. Saved to {JSON_OUT_PATH}")
