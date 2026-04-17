import paramiko
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('110.165.17.170', username='root', password='J9?GfqNT5FTq')
client.exec_command('pm2 restart safetron-dashboard')
client.close()
print("Restart complete.")
