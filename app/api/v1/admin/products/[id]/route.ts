
import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        fragranceNotes: {
          include: {
            fragranceNote: true,
          }
        },
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
    
    let slug;
    if (productData.name) {
      slug = slugify(productData.name);
    }

    const product = await prisma.$transaction(async (tx) => {
      await tx.productFragranceNote.deleteMany({
        where: { productId: params.id },
      });

      const updatedProduct = await tx.product.update({
        where: { id: params.id },
        data: {
          ...productData,
          slug,
          fragranceNotes: fragranceNotes ? {
            create: fragranceNotes.map(note => ({
              fragranceNoteId: note.fragranceNoteId,
              percentage: note.percentage,
            })),
          } : undefined,
        },
        include: {
          fragranceNotes: {
            include: {
              fragranceNote: true,
            },
          },
        },
      });

      return updatedProduct;
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error(`Error updating product ${params.id}:`, error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A product with this name already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update product data' }, { status: 500 });
  }
}
