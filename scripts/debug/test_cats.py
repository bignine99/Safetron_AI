import json

d = json.load(open('dashboard/public/data/statistical_report.json', encoding='utf-8'))
c = [x for x in d['descriptive']['categorical'] if x['feature'] == '공사종류'][0]['counts']
p = [x for x in d['descriptive']['categorical'] if x['feature'] == '대공종'][0]['counts']

print("Cats:")
for x in c:
    print(f"- {x['label']} ({x['count']})")
print("Procs:")
for x in p:
    print(f"- {x['label']} ({x['count']})")
