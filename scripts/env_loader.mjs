/**
 * scripts/.env 파일에서 환경변수를 로딩하는 경량 헬퍼.
 * dotenv 패키지 없이 순수 Node.js로 동작합니다.
 *
 * 사용법 (ESM):
 *   import { loadEnv, getGeminiKey } from '../env_loader.mjs';
 *   loadEnv();
 *   const key = getGeminiKey();
 */
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function loadEnv() {
  const envPath = join(__dirname, '.env');
  let content;
  try {
    content = readFileSync(envPath, 'utf-8');
  } catch {
    console.warn('[WARN] scripts/.env 파일을 찾을 수 없습니다:', envPath);
    return;
  }
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}

export function getGeminiKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error('[FAIL] GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
    console.error('       scripts/.env 파일을 확인하세요.');
    process.exit(1);
  }
  return key;
}
