import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
f = open('implementation_and_modification_processes.md', 'r', encoding='utf-8', errors='replace')
lines = f.readlines()
f.close()
for i, l in enumerate(lines[:197], 1):
    ascii_only = re.sub(r'[^\x20-\x7E]', '', l).strip()
    if ascii_only and len(ascii_only) > 3:
        print(f'{i}: {ascii_only[:140]}')
