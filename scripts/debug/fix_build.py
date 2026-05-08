# -*- coding: utf-8 -*-
import sys, os, time
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from ssh_helper import create_ssh_client, run_cmd

APP_ROOT = "/root/Safetron_AI/dashboard"
client = create_ssh_client()

# 1. safety-dashboard vs safetron-dashboard 포트 확인
print("=== safety-dashboard (ID 2) port info ===")
run_cmd(client, "pm2 show safety-dashboard 2>/dev/null | grep -E 'script args|exec cwd|status|script path'")

print("\n=== All ports in use ===")
run_cmd(client, "ss -tlnp | grep -E 'next|node' | head -10")

# 2. .next 빌드 확인
print("\n=== .next build-manifest check ===")
run_cmd(client, "ls -la " + APP_ROOT + "/.next/BUILD_ID 2>/dev/null || echo 'BUILD_ID missing'")
run_cmd(client, "cat " + APP_ROOT + "/.next/BUILD_ID 2>/dev/null || echo 'no BUILD_ID'")

# 3. safetron-dashboard 정지 → 빌드 → 재시작
print("\n=== safetron-dashboard 정지 → 빌드 → 재시작 ===")

# safetron-dashboard 임시 정지
run_cmd(client, "pm2 stop safetron-dashboard")
time.sleep(2)

# Kill anything on 3005
run_cmd(client, "fuser -k 3005/tcp 2>/dev/null; pkill -f 'next start -p 3005' 2>/dev/null; echo 'port cleared'")
time.sleep(2)

# npm build 실행 (시간 소요)
print("\n=== npm run build (2-3 min) ===")
_, bstdout, bstderr = client.exec_command(
    "cd " + APP_ROOT + " && npm run build 2>&1 | grep -E 'error|warn|compiled|failed|ready|Route|pages' | tail -30",
    timeout=300
)
bout = bstdout.read().decode('utf-8', errors='replace').strip()
berr = bstderr.read().decode('utf-8', errors='replace').strip()
if bout: print(bout)
if berr: print("[ERR]", berr[:500])

# BUILD_ID 확인
print("\n=== Post-build check ===")
run_cmd(client, "ls -la " + APP_ROOT + "/.next/ | head -5")
run_cmd(client, "cat " + APP_ROOT + "/.next/BUILD_ID 2>/dev/null || echo 'BUILD_ID still missing - build failed'")

# PM2 재시작
print("\n=== PM2 restart ===")
run_cmd(client, "pm2 start safetron-dashboard")
time.sleep(6)
run_cmd(client, "pm2 list")
run_cmd(client, "ss -tlnp | grep 3005")

print("\n=== Final logs ===")
run_cmd(client, "pm2 logs safetron-dashboard --lines 8 --nostream 2>/dev/null")

client.close()
print("\n[DONE]")
