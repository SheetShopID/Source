import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs'; // ⬅️ PENTING (hindari edge)

export async function POST(request) {
  try {
    const body = await request.json();
    const { shopId, name, wa, sheetUrl } = body;

    if (!shopId || !name || !wa) {
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      );
    }

    const ref = db.ref(`shops/${shopId}`);

    const snapshot = await ref.get();
    if (snapshot.exists()) {
      return NextResponse.json(
        { error: 'Shop already exists' },
        { status: 409 }
      );
    }

    await ref.set({
      name,
      wa,
      sheetUrl: sheetUrl || '',
      theme: 'default',
      active: true,
      createdAt: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[REGISTER SHOP API]', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
/*tes*/
