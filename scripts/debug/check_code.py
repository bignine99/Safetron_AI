# -*- coding: utf-8 -*-
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from ssh_helper import create_ssh_client, run_cmd

client = create_ssh_client()
run_cmd(client, 'grep -C 2 "검색" /root/Safetron_AI/dashboard/src/app/accidents/page.tsx || echo "NO_SEARCH_BUTTON"')
client.close()
