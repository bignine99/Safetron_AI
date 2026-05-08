# -*- coding: utf-8 -*-
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from ssh_helper import create_ssh_client

client = create_ssh_client()
# Find the Process ID holding 3005 and kill it
cmd = "fuser -k 3005/tcp || true; pm2 restart safetron-dashboard; sleep 3; pm2 list"
stdin, stdout, stderr = client.exec_command(cmd, timeout=30)
print(stdout.read().decode('utf-8', errors='replace'))
client.close()
