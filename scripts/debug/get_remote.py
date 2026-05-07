import paramiko
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('110.165.17.170', username='root', password='J9?GfqNT5FTq')
stdin, stdout, stderr = client.exec_command('tail -n 20 /root/.pm2/logs/safetron-dashboard-error.log')
with open('remote_error.log', 'w', encoding='utf-8') as f:
    f.write(stdout.read().decode('utf-8', 'replace'))
print("Saved remote logs to remote_error.log")
