
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be a positive number'),
  stock: z.number().int().min(0, 'Stock must be a non-negative integer'),
  imageUrl: z.string().url('Image URL must be a valid URL'),
});

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json({ data: products });
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = productSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(
        JSON.stringify({ error: 'Bad Request', details: validation.error.errors }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const { name, description, price, stock, imageUrl } = validation.data;

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        imageUrl,
      },
    });

    return new NextResponse(JSON.stringify({ data: newProduct }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
