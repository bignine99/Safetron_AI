# -*- coding: utf-8 -*-
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from ssh_helper import create_ssh_client, run_cmd

client = create_ssh_client()

print("=== safetron-dashboard PM2 logs ===")
run_cmd(client, "pm2 logs safetron-dashboard --lines 30 --nostream 2>/dev/null", timeout=15)
print("\n=== safetron-dashboard show ===")
run_cmd(client, "pm2 show safetron-dashboard 2>/dev/null | grep -E 'status|restart|uptime|root|script|error'", timeout=10)
print("\n=== .next build check ===")
run_cmd(client, "ls -la /root/Safetron_AI/dashboard/.next/ 2>/dev/null | head -10", timeout=10)
print("\n=== Port 3005 check ===")
run_cmd(client, "ss -tlnp | grep 3005 || netstat -tlnp 2>/dev/null | grep 3005", timeout=10)
client.close()
