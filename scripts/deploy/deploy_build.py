# -*- coding: utf-8 -*-
"""NCP Server Build + PM2 Restart (Step 5-7 only)"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from ssh_helper import create_ssh_client, run_cmd

APP_ROOT = "/root/Safetron_AI"

client = create_ssh_client()
print("[OK] SSH connected!")

print("\n[STEP 5] npm run build...")
_, stdout, stderr = client.exec_command("cd " + APP_ROOT + "/dashboard && npm run build 2>&1 | tail -30", timeout=300)
exit_code = stdout.channel.recv_exit_status()
out = stdout.read().decode('utf-8', errors='replace').strip()
err = stderr.read().decode('utf-8', errors='replace').strip()
if out: print(out)
if err and 'warn' not in err.lower() and 'npm warn' not in err.lower():
    print("[ERR] " + err[:800])
print("Build exit code:", exit_code)

print("\n[STEP 6] PM2 restart...")
run_cmd(client, "pm2 restart safetron-dashboard && pm2 save")
print("[OK] PM2 restarted.")

print("\n[STEP 7] Status:")
run_cmd(client, "pm2 list")

client.close()
print("\n[DONE] All steps complete! URL: http://www.ninetynine99.co.kr/safetron/")
