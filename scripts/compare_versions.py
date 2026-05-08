"""Git 버전별 파일 상태 비교"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

files = {
    '0fe44a1': 'scripts/git_version_0fe44a1.md',
    '960d606': 'scripts/git_version_960d606.md',
    'current': 'implementation_and_modification_processes.md',
}

for tag, path in files.items():
    with open(path, 'rb') as f:
        data = f.read()
    nulls = data.count(b'\x00')
    lines = data.split(b'\n')
    mojibake = 0
    for line in lines:
        try:
            d = line.decode('utf-8')
            for ch in d:
                if 0x4E00 <= ord(ch) <= 0x9FFF:
                    mojibake += 1
                    break
        except:
            mojibake += 1
    print(f"{tag}: {len(data):,} bytes | lines={len(lines)} | nulls={nulls} | mojibake_lines={mojibake}")
