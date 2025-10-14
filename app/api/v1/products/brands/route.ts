import { NextResponse } from 'next/server';
import prisma from '@lib/prisma';

export async function GET() {
  try {
    const brands = await prisma.product.findMany({
      select: {
        brand: true,
      },
      distinct: ['brand'],
    });
    
    const brandNames = brands.map(p => p.brand);

    return NextResponse.json(brandNames);
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}
