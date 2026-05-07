# -*- coding: utf-8 -*-
import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('110.165.17.170', username='root', password='J9?GfqNT5FTq')
_, out, _ = client.exec_command('grep -C 2 "검색" /root/Safetron_AI/dashboard/src/app/accidents/page.tsx || echo "NO_SEARCH_BUTTON"')
print(out.read().decode('utf-8', errors='replace'))
client.close()
