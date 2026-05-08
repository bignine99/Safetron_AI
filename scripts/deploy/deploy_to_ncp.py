# -*- coding: utf-8 -*-
"""NCP Server Deploy Script: DB transfer + git pull + PM2 restart"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from ssh_helper import create_ssh_client, run_cmd

# Local file path
LOCAL_DB = os.path.join(os.path.dirname(__file__), "..", "..", "dashboard", "src", "data", "safety_graph.db")

print("=" * 60)
host = os.environ.get("NCP_HOST", "unknown")
print("[STEP 1] Connecting to NCP server: " + host)
print("=" * 60)

client = create_ssh_client()
print("[OK] SSH connected!")

# Step 2: Find app root path
print("\n[STEP 2] Finding app root path on server...")
out = run_cmd(client, "pm2 show safetron-dashboard 2>/dev/null | grep 'root path'", show=False)
app_root = None

if out:
    for line in out.splitlines():
        if 'root path' in line:
            parts = line.split('|')
            if len(parts) >= 2:
                app_root = parts[-1].strip()
                break

if not app_root:
    out2 = run_cmd(client,
        "find /root /srv /home -name 'package.json' -path '*/dashboard/package.json' 2>/dev/null | head -3",
        show=False
    )
    if out2:
        first = out2.splitlines()[0]
        app_root = first.replace('/dashboard/package.json', '')
        print("  Found by search: " + app_root)

if not app_root:
    print("\n[WARN] Could not auto-detect path. Showing PM2 info:")
    run_cmd(client, "pm2 list")
    run_cmd(client, "pm2 show safetron-dashboard 2>/dev/null | head -30")
    print("\nShowing /root directory:")
    run_cmd(client, "ls -la /root/")
    app_root = "/root/260410_safety_dashboard"
    print("  Using default path: " + app_root)

print("[OK] App root: " + app_root)
DB_REMOTE = app_root + "/dashboard/src/data/safety_graph.db"

# Step 3: SFTP upload DB
if os.path.exists(LOCAL_DB):
    db_size_mb = round(os.path.getsize(LOCAL_DB) / 1024 / 1024, 1)
    print("\n[STEP 3] Uploading DB file (" + str(db_size_mb) + " MB)...")

    sftp = client.open_sftp()
    try:
        run_cmd(client, "mkdir -p " + app_root + "/dashboard/src/data", show=False)

        def progress(sent, total):
            pct = round(sent / total * 100, 1)
            sys.stdout.write("\r  Uploading: " + str(pct) + "%   ")
            sys.stdout.flush()

        sftp.put(LOCAL_DB, DB_REMOTE, callback=progress)
        print("\n[OK] DB uploaded: " + DB_REMOTE)
    except Exception as e:
        print("\n[FAIL] DB upload error: " + str(e))
    finally:
        sftp.close()
else:
    print("\n[STEP 3] SKIP — Local DB not found: " + LOCAL_DB)

# Step 4: git pull
print("\n[STEP 4] git pull origin main...")
run_cmd(client, "cd " + app_root + " && git pull origin main 2>&1")

# Step 5: npm build
print("\n[STEP 5] npm run build (this may take 2-3 minutes)...")
out = run_cmd(client, "cd " + app_root + "/dashboard && npm run build 2>&1 | tail -25")
if out and ('error' in out.lower() or 'failed' in out.lower()):
    print("[WARN] Build may have errors. Check output above.")
else:
    print("[OK] Build complete.")

# Step 6: PM2 restart
print("\n[STEP 6] PM2 restart...")
run_cmd(client, "pm2 restart safetron-dashboard && pm2 save")
print("[OK] PM2 restarted.")

# Step 7: Status check
print("\n[STEP 7] Final status check:")
run_cmd(client, "pm2 list")
print("\nRecent logs:")
run_cmd(client, "pm2 logs safetron-dashboard --lines 15 --nostream 2>/dev/null || pm2 logs --lines 15 --nostream 2>/dev/null | tail -20")

client.close()
print("\n" + "=" * 60)
print("[DONE] Deployment complete!")
print("URL: http://www.ninetynine99.co.kr/safetron/")
print("=" * 60)
