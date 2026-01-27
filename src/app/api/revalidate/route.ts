import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get('secret');

    // Verify the secret token
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    const body = await request.json();
    const { _type } = body;

    // Revalidate based on document type
    switch (_type) {
      case 'masterclass':
      case 'course':
      case 'event':
        revalidatePath('/ru/creativity');
        revalidatePath('/kg/creativity');
        revalidatePath('/en/creativity');
        break;
      case 'room':
      case 'package':
        revalidatePath('/ru/hotel');
        revalidatePath('/kg/hotel');
        revalidatePath('/en/hotel');
        break;
      case 'faq':
        revalidatePath('/ru/creativity');
        revalidatePath('/kg/creativity');
        revalidatePath('/en/creativity');
        revalidatePath('/ru/hotel');
        revalidatePath('/kg/hotel');
        revalidatePath('/en/hotel');
        break;
      case 'siteSettings':
      case 'promoBanner':
      default:
        // Revalidate everything
        revalidatePath('/', 'layout');
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating', error: String(error) },
      { status: 500 }
    );
  }
}
