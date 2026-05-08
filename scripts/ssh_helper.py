# -*- coding: utf-8 -*-
"""
SSH 접속 공통 헬퍼 — 환경변수 기반.
모든 debug/deploy 스크립트는 이 모듈을 임포트하여 사용합니다.

사용법:
    from ssh_helper import create_ssh_client, run_cmd
    client = create_ssh_client()   # NCP_HOST / NCP_PASSWORD 등을 .env에서 읽음
    run_cmd(client, 'pm2 list')
    client.close()
"""
import os
import sys
import io
import paramiko
from pathlib import Path

# ── .env 로딩 (python-dotenv 없이 자체 파싱) ──────────────────
def _load_dotenv():
    """scripts/.env 파일을 읽어 os.environ에 주입 (미설정 키만)."""
    env_path = Path(__file__).parent / ".env"
    if not env_path.exists():
        return
    with open(env_path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip()
            if key and key not in os.environ:
                os.environ[key] = value

_load_dotenv()

# ── UTF-8 stdout 강제 ─────────────────────────────────────────
if hasattr(sys.stdout, "buffer"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

# ── SSH 클라이언트 팩토리 ──────────────────────────────────────
def create_ssh_client(
    host: str | None = None,
    port: int | None = None,
    username: str | None = None,
    key_filename: str | None = None,
    timeout: int = 15,
) -> paramiko.SSHClient:
    """환경변수로부터 접속 정보를 가져와 SSHClient를 반환합니다."""
    host = host or os.environ.get("AWS_HOST")
    port = port or int(os.environ.get("AWS_PORT", "22"))
    username = username or os.environ.get("AWS_USERNAME")
    key_filename = key_filename or os.environ.get("AWS_KEY_PATH")

    if not host or not username or not key_filename:
        print("[FAIL] SSH 환경변수(AWS_HOST, AWS_USERNAME, AWS_KEY_PATH)가 설정되지 않았습니다.")
        print("       scripts/.env 파일을 확인하세요.")
        sys.exit(1)

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, port=port, username=username, key_filename=key_filename, timeout=timeout)
    return client

# ── 원격 명령 실행 헬퍼 ────────────────────────────────────────
def run_cmd(
    client: paramiko.SSHClient,
    cmd: str,
    timeout: int = 60,
    show: bool = True,
    suppress_warn: bool = True,
) -> str:
    """원격 명령을 실행하고 stdout을 반환합니다."""
    _, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode("utf-8", errors="replace").strip()
    err = stderr.read().decode("utf-8", errors="replace").strip()
    if show and out:
        print(out)
    if show and err:
        if suppress_warn and "warn" in err.lower():
            pass
        else:
            print("[ERR]", err[:500])
    return out

# ── Gemini API 키 헬퍼 ────────────────────────────────────────
def get_gemini_key() -> str:
    """환경변수에서 Gemini API 키를 반환합니다."""
    key = os.environ.get("GEMINI_API_KEY", "")
    if not key:
        print("[FAIL] GEMINI_API_KEY 환경변수가 설정되지 않았습니다.")
        print("       scripts/.env 파일을 확인하세요.")
        sys.exit(1)
    return key
