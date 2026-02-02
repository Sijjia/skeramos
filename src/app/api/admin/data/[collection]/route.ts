import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { put, list, del } from '@vercel/blob';

const SESSION_SECRET = process.env.SESSION_SECRET || 'default-secret';
const COOKIE_NAME = 'admin_session';

// Доступные коллекции
const COLLECTIONS = [
  'masterclasses',
  'rooms',
  'reviews',
  'gallery',
  'packages',
  'masters',
  'services',
  'settings',
];

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

// Читаем данные из Vercel Blob
async function readData(collection: string): Promise<unknown> {
  try {
    // Проверяем есть ли BLOB_READ_WRITE_TOKEN
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN not set, returning empty data');
      return collection === 'settings' ? {} : [];
    }

    // Ищем файл в Blob storage
    const { blobs } = await list({ prefix: `data/${collection}.json` });

    if (blobs.length === 0) {
      return collection === 'settings' ? {} : [];
    }

    // Читаем данные из blob
    const response = await fetch(blobs[0].url);
    if (!response.ok) {
      return collection === 'settings' ? {} : [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error reading ${collection}:`, error);
    return collection === 'settings' ? {} : [];
  }
}

// Записываем данные в Vercel Blob
async function writeData(collection: string, data: unknown): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN not configured');
  }

  // Сначала удаляем старый файл если есть
  try {
    const { blobs } = await list({ prefix: `data/${collection}.json` });
    for (const blob of blobs) {
      await del(blob.url);
    }
  } catch {
    // Игнорируем ошибки удаления
  }

  // Записываем новый файл
  await put(`data/${collection}.json`, JSON.stringify(data, null, 2), {
    access: 'public',
    contentType: 'application/json',
  });
}

type RouteContext = {
  params: Promise<{ collection: string }>;
};

// GET - получить все данные коллекции
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const { collection } = await context.params;

  if (!COLLECTIONS.includes(collection)) {
    return NextResponse.json(
      { error: 'Коллекция не найдена' },
      { status: 404 }
    );
  }

  // Публичные данные доступны без авторизации
  const data = await readData(collection);
  return NextResponse.json(data);
}

// POST - добавить новый элемент
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const { collection } = await context.params;

  if (!COLLECTIONS.includes(collection)) {
    return NextResponse.json(
      { error: 'Коллекция не найдена' },
      { status: 404 }
    );
  }

  try {
    const newItem = await request.json();
    const data = await readData(collection);

    if (collection === 'settings') {
      // Settings - это объект, не массив
      await writeData(collection, { ...data as object, ...newItem });
      return NextResponse.json({ success: true });
    }

    // Генерируем ID для нового элемента
    const items = data as Array<{ id: string }>;
    const maxId = items.reduce((max, item) => {
      const id = parseInt(item.id) || 0;
      return id > max ? id : max;
    }, 0);

    const itemWithId = {
      ...newItem,
      id: (maxId + 1).toString(),
    };

    items.push(itemWithId);
    await writeData(collection, items);

    return NextResponse.json({ success: true, item: itemWithId });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Ошибка сохранения: ' + (error instanceof Error ? error.message : 'Unknown') },
      { status: 500 }
    );
  }
}

// PUT - обновить элемент
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const { collection } = await context.params;

  if (!COLLECTIONS.includes(collection)) {
    return NextResponse.json(
      { error: 'Коллекция не найдена' },
      { status: 404 }
    );
  }

  try {
    const updatedItem = await request.json();

    if (collection === 'settings') {
      const data = await readData(collection);
      await writeData(collection, { ...data as object, ...updatedItem });
      return NextResponse.json({ success: true });
    }

    const data = await readData(collection) as Array<{ id: string }>;
    const index = data.findIndex((item) => item.id === updatedItem.id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Элемент не найден' },
        { status: 404 }
      );
    }

    data[index] = { ...data[index], ...updatedItem };
    await writeData(collection, data);

    return NextResponse.json({ success: true, item: data[index] });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Ошибка обновления: ' + (error instanceof Error ? error.message : 'Unknown') },
      { status: 500 }
    );
  }
}

// DELETE - удалить элемент
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const { collection } = await context.params;

  if (!COLLECTIONS.includes(collection)) {
    return NextResponse.json(
      { error: 'Коллекция не найдена' },
      { status: 404 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID не указан' },
        { status: 400 }
      );
    }

    const data = await readData(collection) as Array<{ id: string }>;
    const filtered = data.filter((item) => item.id !== id);

    if (filtered.length === data.length) {
      return NextResponse.json(
        { error: 'Элемент не найден' },
        { status: 404 }
      );
    }

    await writeData(collection, filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Ошибка удаления: ' + (error instanceof Error ? error.message : 'Unknown') },
      { status: 500 }
    );
  }
}
