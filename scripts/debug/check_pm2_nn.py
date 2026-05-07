# -*- coding: utf-8 -*-
import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('110.165.17.170', username='root', password='J9?GfqNT5FTq')
_, stdout, _ = client.exec_command('pm2 describe nn-backend')
print(stdout.read().decode('utf-8', errors='replace'))
client.close()
