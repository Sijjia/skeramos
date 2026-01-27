import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'default-secret';
const COOKIE_NAME = 'admin_session';
const DATA_DIR = path.join(process.cwd(), 'data');

// Доступные коллекции
const COLLECTIONS = [
  'masterclasses',
  'rooms',
  'reviews',
  'gallery',
  'packages',
  'masters',
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

async function readData(collection: string): Promise<unknown> {
  const filePath = path.join(DATA_DIR, `${collection}.json`);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return collection === 'settings' ? {} : [];
  }
}

async function writeData(collection: string, data: unknown): Promise<void> {
  const filePath = path.join(DATA_DIR, `${collection}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
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
    return NextResponse.json(
      { error: 'Ошибка сохранения' },
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
    return NextResponse.json(
      { error: 'Ошибка обновления' },
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
    return NextResponse.json(
      { error: 'Ошибка удаления' },
      { status: 500 }
    );
  }
}
