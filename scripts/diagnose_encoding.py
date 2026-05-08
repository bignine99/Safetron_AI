"""인코딩 진단 스크립트 v2"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

filepath = "implementation_and_modification_processes.md"
with open(filepath, 'rb') as f:
    data = f.read()

print(f"Size: {len(data)} bytes")
null_count = data.count(b'\x00')
print(f"NULL bytes: {null_count}")
print(f"BOM: {data[:3].hex()}")

# 라인 분할 (mixed endings 대응)
raw_lines = data.split(b'\n')
print(f"Total lines (split by LF): {len(raw_lines)}")

corrupted = []
for i, line in enumerate(raw_lines, 1):
    has_null = b'\x00' in line
    has_mojibake = False
    
    try:
        decoded = line.decode('utf-8')
        for ch in decoded:
            cp = ord(ch)
            # CJK 한자 범위 (한국어 문서에 한자가 섞여있으면 mojibake)
            if 0x4E00 <= cp <= 0x9FFF:
                has_mojibake = True
                break
            # 대체 문자
            if cp == 0xFFFD:
                has_mojibake = True
                break
    except:
        has_mojibake = True
    
    if has_null or has_mojibake:
        tag = "NULL" if has_null else "MOJIBAKE"
        # safe preview: hex for null, ascii-safe for mojibake
        if has_null:
            preview = line[:40].hex()
        else:
            preview = line[:80].decode('utf-8', errors='replace')[:80]
        corrupted.append((i, tag, preview))

print(f"\n=== Corrupted lines: {len(corrupted)} ===")
for ln, tag, preview in corrupted:
    print(f"  L{ln:3d} [{tag:8s}] {preview}")

# 영역 분석
if corrupted:
    print("\n=== Corrupted ranges ===")
    ranges = []
    start = corrupted[0][0]
    prev = start
    prev_tag = corrupted[0][1]
    for ln, tag, _ in corrupted[1:]:
        if ln - prev > 2 or tag != prev_tag:
            ranges.append((start, prev, prev_tag))
            start = ln
            prev_tag = tag
        prev = ln
    ranges.append((start, prev, prev_tag))
    for s, e, t in ranges:
        print(f"  Lines {s}-{e} ({e-s+1} lines) [{t}]")
