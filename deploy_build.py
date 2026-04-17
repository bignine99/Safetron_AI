# -*- coding: utf-8 -*-
"""NCP Server Build + PM2 Restart (Step 5-7 only)"""
import paramiko
import sys
import io

HOST     = "110.165.17.170"
PORT     = 22
USERNAME = "root"
PASSWORD = "J9?GfqNT5FTq"
APP_ROOT = "/root/Safetron_AI"

# Force UTF-8 output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD, timeout=15)
print("[OK] SSH connected!")

def run(cmd, timeout=300):
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    exit_code = stdout.channel.recv_exit_status()
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out:
        print(out)
    if err and 'warn' not in err.lower() and 'npm warn' not in err.lower():
        print("[ERR] " + err[:800])
    return out, err, exit_code

print("\n[STEP 5] npm run build...")
out, err, code = run("cd " + APP_ROOT + "/dashboard && npm run build 2>&1 | tail -30", timeout=300)
print("Build exit code:", code)

print("\n[STEP 6] PM2 restart...")
run("pm2 restart safetron-dashboard && pm2 save")
print("[OK] PM2 restarted.")

print("\n[STEP 7] Status:")
run("pm2 list")

client.close()
print("\n[DONE] All steps complete! URL: http://www.ninetynine99.co.kr/safetron/")
