# -*- coding: utf-8 -*-
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from ssh_helper import create_ssh_client

import paramiko

host = os.environ.get("NCP_HOST")
port = int(os.environ.get("NCP_PORT", "22"))
user = os.environ.get("NCP_USERNAME")
password = os.environ.get("NCP_PASSWORD")
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
