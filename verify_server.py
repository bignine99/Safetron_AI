# -*- coding: utf-8 -*-
import paramiko, sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST="110.165.17.170"; PORT=22; USERNAME="root"; PASSWORD="J9?GfqNT5FTq"
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD, timeout=15)

def run(cmd, timeout=30):
    _, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out)
    return out

# 10초 대기 후 상태 점검
print("Waiting 10 seconds for server stabilization...")
time.sleep(10)

print("\n=== PM2 live status ===")
run("pm2 list")

print("\n=== Port 3005 current listener ===")
run("ss -tlnp | grep 3005")

print("\n=== HTTP test (localhost:3005) ===")
run("curl -s -o /dev/null -w '%{http_code} %{time_total}s' http://localhost:3005/safetron/ 2>/dev/null || curl -s -o /dev/null -w '%{http_code} %{time_total}s' http://localhost:3005/ 2>/dev/null")

print("\n=== HTTP test (public URL) ===")
run("curl -s -o /dev/null -w '%{http_code} %{url_effective}' -L http://www.ninetynine99.co.kr/safetron/ 2>/dev/null | head -1")

print("\n=== safetron-dashboard uptime + restart count ===")
run("pm2 show safetron-dashboard 2>/dev/null | grep -E 'status|restart|uptime'")

print("\n=== Latest out log (last 5 lines) ===")
run("tail -5 /root/.pm2/logs/safetron-dashboard-out.log 2>/dev/null")

print("\n=== Latest error log (last 5 lines) ===")
run("tail -5 /root/.pm2/logs/safetron-dashboard-error.log 2>/dev/null")

client.close()
print("\n[CHECK DONE]")
