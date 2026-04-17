import paramiko
import os

host = '110.165.17.170'
port = 22
user = 'root'
password = 'J9?GfqNT5FTq'
local_path = 'dashboard/src/data/safety_graph.db'
remote_path = '/root/Safetron_AI/dashboard/src/data/safety_graph.db'

try:
    transport = paramiko.Transport((host, port))
    transport.connect(username=user, password=password)
    
    sftp = paramiko.SFTPClient.from_transport(transport)
    
    print(f"Uploading {local_path} to {remote_path}...")
    sftp.put(local_path, remote_path)
    print("Upload complete.")
    
    sftp.close()
    transport.close()
    print("SFTP closed successfully.")
    
except Exception as e:
    print("Error:", e)
