import { NextResponse } from 'next/server';
import prisma from '@lib/prisma';

// A simple slugify function
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-');      // Replace multiple - with single -
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const query = searchParams.get('query');
  const skip = (page - 1) * limit;

  const where: any = {};

  if (query) {
    where.name = { contains: query, mode: 'insensitive' };
  }

  try {
    const [fragranceNotes, total] = await prisma.$transaction([
      prisma.fragranceNote.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.fragranceNote.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ fragranceNotes, totalPages });
  } catch (error) {
    console.error('Error fetching fragrance notes:', error);
    return NextResponse.json({ error: 'Failed to fetch fragrance notes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, color, imageUrl } = body;

    if (!name || !color) {
      return NextResponse.json({ error: 'Name and color are required' }, { status: 400 });
    }

    const slug = slugify(name);

    const newFragranceNote = await prisma.fragranceNote.create({
      data: {
        name,
        slug,
        color,
        imageUrl,
      },
    });

    return NextResponse.json(newFragranceNote, { status: 201 });
  } catch (error: any) {
    console.error('Error creating fragrance note:', error);
    if (error.code === 'P2002') { // Unique constraint violation
      return NextResponse.json({ error: `A fragrance note with the name "${error.meta?.target?.includes('name') ? body.name : ''}" already exists.` }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create fragrance note' }, { status: 500 });
  }
}