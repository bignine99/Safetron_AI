# -*- coding: utf-8 -*-
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from ssh_helper import create_ssh_client

client = create_ssh_client()
try:
    print("Connected. Executing deployment...")
    cmd = '''
    cd /home/ubuntu/Safetron_AI && \\
    git fetch origin && \\
    git reset --hard origin/main && \\
    cd dashboard && \\
    rm -rf .next && \\
    npm run build && \\
    fuser -k 3005/tcp || true && \\
    pm2 restart safetron-dashboard && \\
    echo "DEPLOY_SUCCESSFUL"
    '''
    stdin, stdout, stderr = client.exec_command(cmd, timeout=300)

    # Wait for the command to finish
    exit_status = stdout.channel.recv_exit_status()

    out = stdout.read().decode('utf-8', 'replace')
    err = stderr.read().decode('utf-8', 'replace')

    # Safe print logic for windows cp949 console
    for line in out.splitlines():
        print(line.encode(sys.stdout.encoding, errors='replace').decode(sys.stdout.encoding))
    for line in err.splitlines():
        print("ERR: " + line.encode(sys.stdout.encoding, errors='replace').decode(sys.stdout.encoding))

except Exception as e:
    print(str(e))
finally:
    client.close()
