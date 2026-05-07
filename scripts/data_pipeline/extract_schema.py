import pandas as pd
import json

try:
    df = pd.read_csv(r'c:\Users\cho\Desktop\Temp\05_1_code\260410_safety_dashboard\.raw_data\cleaned_safety_data_07.csv', encoding='utf-8', low_memory=False)
except UnicodeDecodeError:
    df = pd.read_csv(r'c:\Users\cho\Desktop\Temp\05_1_code\260410_safety_dashboard\.raw_data\cleaned_safety_data_07.csv', encoding='cp949', low_memory=False)

# Numeric columns
num_cols = df.select_dtypes(include=['number']).columns.tolist()

# Basic output
out = {
    "columns": df.columns.tolist(),
    "numeric_cols": num_cols,
    "dtypes": {col: str(df[col].dtype) for col in df.columns}
}

with open('cols.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)

print("Columns saved to cols.json")
