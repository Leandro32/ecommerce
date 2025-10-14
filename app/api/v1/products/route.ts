import { NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { Sex } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brands = searchParams.get('brands')?.split(',');
  const sex = searchParams.get('sex')?.split(',') as Sex[];
  const bottleSizeStr = searchParams.get('bottleSize')?.split(',');
  const bottleSize = bottleSizeStr ? bottleSizeStr.map(Number) : undefined;
  const query = searchParams.get('query');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  const where: any = {};

  if (brands && brands.length > 0) {
    where.brand = { in: brands };
  }

  if (sex && sex.length > 0) {
    where.sex = { hasSome: sex };
  }

  if (bottleSize && bottleSize.length > 0) {
    where.bottleSize = { in: bottleSize };
  }

  if (query) {
    where.name = { contains: query, mode: 'insensitive' };
  }

  try {
    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          fragranceNotes: {
            include: {
              fragranceNote: true,
            },
          },
          reviews: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ products, totalPages });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
