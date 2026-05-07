import paramiko
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('110.165.17.170', username='root', password='J9?GfqNT5FTq')
stdin, stdout, stderr = client.exec_command('pm2 logs safetron-dashboard --lines 15 --nostream')
with open('pm2.log', 'w', encoding='utf-8') as f:
    f.write(stdout.read().decode('utf-8', 'replace'))
print("Saved pm2 logs")
