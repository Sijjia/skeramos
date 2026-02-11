import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const SESSION_SECRET = process.env.SESSION_SECRET || 'default-secret';
const COOKIE_NAME = 'admin_session';

function verifyToken(token: string): boolean {
  const [timestamp, hash] = token.split('.');
  if (!timestamp || !hash) return false;

  const expectedHash = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(timestamp)
    .digest('hex');

  if (hash !== expectedHash) return false;

  const tokenTime = parseInt(timestamp);
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000;

  return now - tokenTime < maxAge;
}

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return token ? verifyToken(token) : false;
}

const MESSAGES_DIR = path.join(process.cwd(), 'src', 'messages');
const LANGUAGES = ['ru', 'kg', 'en'] as const;

// GET - получить все переводы
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const translations: Record<string, Record<string, unknown>> = {};

    for (const lang of LANGUAGES) {
      const filePath = path.join(MESSAGES_DIR, `${lang}.json`);
      const content = await readFile(filePath, 'utf-8');
      translations[lang] = JSON.parse(content);
    }

    return NextResponse.json(translations);
  } catch (error) {
    console.error('Error reading translations:', error);
    return NextResponse.json(
      { error: 'Ошибка чтения переводов' },
      { status: 500 }
    );
  }
}

// PUT - обновить переводы
export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const data = await request.json();

    for (const lang of LANGUAGES) {
      if (data[lang]) {
        const filePath = path.join(MESSAGES_DIR, `${lang}.json`);
        await writeFile(filePath, JSON.stringify(data[lang], null, 2) + '\n', 'utf-8');
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving translations:', error);
    return NextResponse.json(
      { error: 'Ошибка сохранения переводов' },
      { status: 500 }
    );
  }
}
