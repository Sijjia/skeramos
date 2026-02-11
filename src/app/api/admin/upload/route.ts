import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
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
        { error: `Файл слишком большой (${(file.size / 1024 / 1024).toFixed(1)} МБ). Максимум: 10 МБ` },
        { status: 400 }
      );
    }

    // Генерируем уникальное имя файла
    const ext = file.name.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const randomId = crypto.randomBytes(4).toString('hex');
    const filename = `${timestamp}-${randomId}.${ext}`;

    // Путь к папке uploads в public
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    // Создаём папку если не существует
    await mkdir(uploadsDir, { recursive: true });

    // Конвертируем File в Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Сохраняем файл
    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    // Возвращаем публичный URL
    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Ошибка загрузки: ' + (error instanceof Error ? error.message : 'Unknown') },
      { status: 500 }
    );
  }
}
