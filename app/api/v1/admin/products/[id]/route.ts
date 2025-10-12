import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  brand: z.string().min(1, 'Brand is required'),
  sex: z.enum(['WOMAN', 'MAN', 'UNISEX']),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  discountPrice: z.number().min(0, 'Discount price must be a positive number').optional(),
  isDiscounted: z.boolean(),
  stock: z.number().min(0, 'Stock must be a positive number'),
  bottleSize: z.number().min(0, 'Bottle size must be a positive number'),
  bottleType: z.string().min(1, 'Bottle type is required'),
  packaging: z.string().min(1, 'Packaging is required'),
  averageRating: z.number().min(0).max(5).optional(),
  shippingWeight: z.number().min(0, 'Shipping weight must be a positive number').optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  imageUrls: z.array(z.string().url('Invalid URL')),
  fragranceNotes: z.object({
    topNotes: z.string(),
    middleNotes: z.string(),
    baseNotes: z.string(),
  }).optional(),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        fragranceNotes: true,
      },
    });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product data' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const validation = productSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 400 });
    }

    const { fragranceNotes, ...productData } = validation.data;

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...productData,
        fragranceNotes: {
          upsert: {
            create: fragranceNotes,
            update: fragranceNotes,
          },
        },
      },
      include: {
        fragranceNotes: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product data' }, { status: 500 });
  }
}