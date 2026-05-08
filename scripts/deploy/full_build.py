# -*- coding: utf-8 -*-
import sys, os, time
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from ssh_helper import create_ssh_client, run_cmd

APP_DIR = "/root/Safetron_AI/dashboard"
client = create_ssh_client()

# 1. PM2 정지
print("=== [1] Stop safetron-dashboard ===")
run_cmd(client, "pm2 stop safetron-dashboard")
run_cmd(client, "fuser -k 3005/tcp 2>/dev/null; echo 'port cleared'")
time.sleep(2)

# 2. BUILD_ID 존재 여부 확인
print("\n=== [2] Check BUILD_ID ===")
run_cmd(client, "ls /root/Safetron_AI/dashboard/.next/ 2>/dev/null")
run_cmd(client, "cat /root/Safetron_AI/dashboard/.next/BUILD_ID 2>/dev/null || echo 'BUILD_ID: NOT FOUND'")

# 3. 전체 빌드 실행 (에러 전체 캡처)
print("\n=== [3] npm run build (full output) ===")
_, bstdout, bstderr = client.exec_command(
    "cd " + APP_DIR + " && npm run build 2>&1",
    timeout=300
)
bout = bstdout.read().decode('utf-8', errors='replace')
# 에러 라인만 추출
lines = bout.splitlines()
errors = [l for l in lines if any(k in l.lower() for k in ['error', 'failed', 'type', 'cannot'])]
success = [l for l in lines if any(k in l.lower() for k in ['compiled', 'ready', 'success', 'build'])]

print("--- SUCCESS lines ---")
for l in success[-10:]:
    print(l)
print("--- ERROR lines ---")
for l in errors[:30]:
    print(l)
print("--- LAST 20 lines ---")
for l in lines[-20:]:
    print(l)

# 4. BUILD_ID 재확인
print("\n=== [4] BUILD_ID after build ===")
out2 = run_cmd(client, "cat /root/Safetron_AI/dashboard/.next/BUILD_ID 2>/dev/null || echo 'BUILD_ID: STILL NOT FOUND'")

# 5. 빌드 성공 시 PM2 재시작
if 'NOT FOUND' not in out2 and out2.strip():
    print("\n=== [5] Build OK! Starting PM2 ===")
    run_cmd(client, "pm2 start safetron-dashboard")
    time.sleep(6)
    run_cmd(client, "pm2 list")
    run_cmd(client, "ss -tlnp | grep 3005")
    run_cmd(client, "curl -s -o /dev/null -w 'HTTP %{http_code}' http://localhost:3005/ 2>/dev/null")
else:
    print("\n=== [5] Build FAILED - Check errors above ===")
    run_cmd(client, "pm2 list")

client.close()
print("\n[DONE]")
