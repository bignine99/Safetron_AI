# -*- coding: utf-8 -*-
import sys, os, time
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from ssh_helper import create_ssh_client, run_cmd

client = create_ssh_client()

# 10초 대기 후 상태 점검
print("Waiting 10 seconds for server stabilization...")
time.sleep(10)

print("\n=== PM2 live status ===")
run_cmd(client, "pm2 list")

print("\n=== Port 3005 current listener ===")
run_cmd(client, "ss -tlnp | grep 3005")

print("\n=== HTTP test (localhost:3005) ===")
run_cmd(client, "curl -s -o /dev/null -w '%{http_code} %{time_total}s' http://localhost:3005/safetron/ 2>/dev/null || curl -s -o /dev/null -w '%{http_code} %{time_total}s' http://localhost:3005/ 2>/dev/null")

print("\n=== HTTP test (public URL) ===")
run_cmd(client, "curl -s -o /dev/null -w '%{http_code} %{url_effective}' -L http://www.ninetynine99.co.kr/safetron/ 2>/dev/null | head -1")

print("\n=== safetron-dashboard uptime + restart count ===")
run_cmd(client, "pm2 show safetron-dashboard 2>/dev/null | grep -E 'status|restart|uptime'")

print("\n=== Latest out log (last 5 lines) ===")
run_cmd(client, "tail -5 /root/.pm2/logs/safetron-dashboard-out.log 2>/dev/null")

print("\n=== Latest error log (last 5 lines) ===")
run_cmd(client, "tail -5 /root/.pm2/logs/safetron-dashboard-error.log 2>/dev/null")

client.close()
print("\n[CHECK DONE]")
