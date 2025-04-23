import { NextResponse } from 'next/server';

import { getQuote } from '@/services/sle';

export async function GET() {
    const quote = await getQuote();
    return NextResponse.json(quote);
}
