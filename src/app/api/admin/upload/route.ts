import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { put } from '@vercel/blob';

// Увеличиваем лимит тела запроса до 10 МБ
export const runtime = 'nodejs';

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

// Допустимые типы изображений
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_SIZE = 4 * 1024 * 1024; // 4MB (Vercel serverless limit)

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'BLOB_READ_WRITE_TOKEN не настроен. Добавьте Vercel Blob Storage в проект.' },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Файл не выбран' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Допустимые форматы: JPEG, PNG, WebP, AVIF' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `Файл слишком большой (${(file.size / 1024 / 1024).toFixed(1)} МБ). Максимум: 4 МБ` },
        { status: 400 }
      );
    }

    // Генерируем уникальное имя файла
    const ext = file.name.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const randomId = crypto.randomBytes(4).toString('hex');
    const filename = `uploads/${timestamp}-${randomId}.${ext}`;

    // Конвертируем File в Buffer для надёжной передачи в Vercel Blob
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Загружаем в Vercel Blob
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: file.type,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Ошибка загрузки: ' + (error instanceof Error ? error.message : 'Unknown') },
      { status: 500 }
    );
  }
}
