# -*- coding: utf-8 -*-
import sys, os, time
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from ssh_helper import create_ssh_client, run_cmd

client = create_ssh_client()

# 1. 포트 3005 점유 프로세스 확인
print("=== Port 3005 process info ===")
run_cmd(client, "ps -p 1691268 -o pid,ppid,cmd --no-headers 2>/dev/null || echo 'PID not found'")
run_cmd(client, "ss -tlnp | grep 3005")

# 2. PM2 safety-dashboard 포트 확인
print("\n=== safety-dashboard port check ===")
run_cmd(client, "pm2 show safety-dashboard 2>/dev/null | grep -E 'script args|exec cwd|status'")

# 3. 전체 포트 점유 현황
print("\n=== All Next.js ports in use ===")
run_cmd(client, "ss -tlnp | grep next")

# 4. 포트 3005 프로세스 종료
print("\n=== Killing process on port 3005 ===")
run_cmd(client, "fuser -k 3005/tcp 2>/dev/null && echo 'Port 3005 freed' || echo 'fuser failed, trying kill'")
run_cmd(client, "kill -9 1691268 2>/dev/null && echo 'PID 1691268 killed' || echo 'PID already gone'")

time.sleep(3)

# 5. safetron-dashboard 재시작
print("\n=== Restarting safetron-dashboard ===")
run_cmd(client, "pm2 restart safetron-dashboard")

time.sleep(5)

# 6. 결과 확인
print("\n=== Final status ===")
run_cmd(client, "pm2 list")
run_cmd(client, "ss -tlnp | grep 3005")
print("\n=== Recent logs ===")
run_cmd(client, "pm2 logs safetron-dashboard --lines 10 --nostream 2>/dev/null")

client.close()
print("\n[DONE]")
