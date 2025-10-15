
import { NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { z } from 'zod';
import { Sex } from '@prisma/client';

const slugify = (text: string) => {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-');      // Replace multiple - with single -
};

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  brand: z.string().min(1, 'Brand is required'),
  sex: z.array(z.nativeEnum(Sex)).min(1, 'Sex is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be a positive number'),
  stock: z.number().int().min(0, 'Stock must be a non-negative integer'),
  bottleSize: z.number().int().positive('Bottle size must be a positive integer'),
  bottleType: z.string().min(1, 'Bottle type is required'),
  packaging: z.string().min(1, 'Packaging is required'),
  isDiscounted: z.boolean().optional(),
  discountPrice: z.number().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  imageUrls: z.array(z.string().url('Image URL must be a valid URL')).min(1, 'At least one image is required'),
  fragranceNotes: z.array(z.object({
    fragranceNoteId: z.string(),
    percentage: z.number(),
  })).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = productSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(
        JSON.stringify({ error: 'Bad Request', details: validation.error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { name, brand, sex, description, price, stock, bottleSize, bottleType, packaging, imageUrls, fragranceNotes, isDiscounted, discountPrice, seoTitle, seoDescription } = validation.data;
    const slug = slugify(name);

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        brand,
        sex,
        description,
        price,
        stock,
        bottleSize,
        bottleType,
        packaging,
        isDiscounted,
        discountPrice,
        seoTitle,
        seoDescription,
        imageUrls,
        fragranceNotes: fragranceNotes ? {
          create: fragranceNotes.map(note => ({
            fragranceNoteId: note.fragranceNoteId,
            percentage: note.percentage,
          })),
        } : undefined,
      },
    });

    return new NextResponse(JSON.stringify({ data: newProduct }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error.code === 'P2002') {
      return new NextResponse(
        JSON.stringify({ error: 'A product with this name already exists.' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// The GET function seems to be for a different purpose (public search) so I leave it as is.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const query = searchParams.get('query');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query) {
      where.name = { contains: query, mode: 'insensitive' };
    }

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ products, totalPages });

  } catch (error) {
    console.error('Error fetching products:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
