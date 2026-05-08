# -*- coding: utf-8 -*-
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from ssh_helper import create_ssh_client

client = create_ssh_client()
client.exec_command('pm2 restart safetron-dashboard')
client.close()
print("Restart complete.")
