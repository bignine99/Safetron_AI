# -*- coding: utf-8 -*-
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from ssh_helper import create_ssh_client, run_cmd

client = create_ssh_client()
run_cmd(client, 'cat /etc/nginx/sites-available/ninetynine')
client.close()
