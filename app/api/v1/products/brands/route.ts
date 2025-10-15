import { NextResponse, NextRequest } from 'next/server';
import prisma from '@lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sex = searchParams.get('sex')?.split(',');
    const bottleSize = searchParams.get('bottleSize')?.split(',');

    let where: Prisma.ProductWhereInput = {};

    if (sex && sex.length > 0) {
      where.sex = { in: sex as any };
    }

    if (bottleSize && bottleSize.length > 0) {
      where.variants = {
        some: {
          size: {
            in: bottleSize.map(Number),
          },
        },
      };
    }

    const brands = await prisma.product.findMany({
      where,
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
