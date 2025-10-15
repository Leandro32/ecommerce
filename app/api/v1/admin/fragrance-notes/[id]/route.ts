
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

// GET a single fragrance note by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const fragranceNote = await prisma.fragranceNote.findUnique({
      where: { id: params.id },
    });

    if (!fragranceNote) {
      return NextResponse.json({ error: 'Fragrance note not found' }, { status: 404 });
    }

    return NextResponse.json(fragranceNote);
  } catch (error) {
    console.error(`Error fetching fragrance note ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch fragrance note' }, { status: 500 });
  }
}

// UPDATE a fragrance note
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, color, imageUrl } = body;

    let slug = undefined;
    if (name) {
      slug = slugify(name);
    }

    const updatedFragranceNote = await prisma.fragranceNote.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        color,
        imageUrl,
      },
    });

    return NextResponse.json(updatedFragranceNote);
  } catch (error: any) {
    console.error(`Error updating fragrance note ${params.id}:`, error);
    if (error.code === 'P2002') { // Unique constraint violation
      return NextResponse.json({ error: 'A fragrance note with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update fragrance note' }, { status: 500 });
  }
}

// DELETE a fragrance note
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.fragranceNote.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Fragrance note deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting fragrance note ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to delete fragrance note' }, { status: 500 });
  }
}
