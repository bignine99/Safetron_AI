"""Mojibake 패턴 역디코딩 테스트
현재 파일의 깨진 라인들을 UTF-8 → CP949 → UTF-8로 변환 시도"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

filepath = "implementation_and_modification_processes.md"
with open(filepath, 'rb') as f:
    raw = f.read()

lines = raw.split(b'\n')

# 테스트: 몇 가지 깨진 라인을 다양한 방식으로 디코딩
test_lines = [3, 8, 10, 11, 67, 82, 112, 139]

for ln in test_lines:
    if ln > len(lines): continue
    line = lines[ln-1]
    print(f"\n=== Line {ln} ({len(line)} bytes) ===")
    print(f"  HEX(first 40): {line[:40].hex()}")
    
    # 방법 1: UTF-8 디코딩 후 Latin-1 인코딩 후 EUC-KR 디코딩
    try:
        text_utf8 = line.decode('utf-8')
        as_latin1 = text_utf8.encode('latin-1')
        decoded_euckr = as_latin1.decode('euc-kr', errors='replace')
        print(f"  UTF8→Latin1→EUC-KR: {decoded_euckr[:100]}")
    except Exception as e:
        print(f"  UTF8→Latin1→EUC-KR: FAIL ({e})")
    
    # 방법 2: UTF-8 디코딩 후 Latin-1 인코딩 후 CP949 디코딩
    try:
        text_utf8 = line.decode('utf-8')
        as_latin1 = text_utf8.encode('latin-1')
        decoded_cp949 = as_latin1.decode('cp949', errors='replace')
        print(f"  UTF8→Latin1→CP949:  {decoded_cp949[:100]}")
    except Exception as e:
        print(f"  UTF8→Latin1→CP949:  FAIL ({e})")
    
    # 방법 3: 직접 EUC-KR 디코딩
    try:
        decoded = line.decode('euc-kr', errors='replace')
        print(f"  Direct EUC-KR:      {decoded[:100]}")
    except Exception as e:
        print(f"  Direct EUC-KR:      FAIL ({e})")

    # 방법 4: 직접 CP949 디코딩
    try:
        decoded = line.decode('cp949', errors='replace')
        print(f"  Direct CP949:       {decoded[:100]}")
    except Exception as e:
        print(f"  Direct CP949:       FAIL ({e})")
    
    # 방법 5: NULL-byte 라인의 경우 UTF-16LE 시도
    if b'\x00' in line:
        try:
            decoded = line.decode('utf-16-le', errors='replace')
            print(f"  UTF-16LE:           {decoded[:100]}")
        except Exception as e:
            print(f"  UTF-16LE:           FAIL ({e})")
