# -*- coding: utf-8 -*-
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from ssh_helper import create_ssh_client

client = create_ssh_client()
stdin, stdout, stderr = client.exec_command('tail -n 20 /root/.pm2/logs/safetron-dashboard-error.log')
with open('remote_error.log', 'w', encoding='utf-8') as f:
    f.write(stdout.read().decode('utf-8', 'replace'))
print("Saved remote logs to remote_error.log")
