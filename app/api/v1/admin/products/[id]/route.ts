
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const productUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  price: z.number().positive('Price must be a positive number').optional(),
  stock: z.number().int().min(0, 'Stock must be a non-negative integer').optional(),
  imageUrl: z.string().url('Image URL must be a valid URL').optional(),
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const product = await prisma.product.findUnique({
            where: { id: params.id },
        });

        if (!product) {
            return new NextResponse(JSON.stringify({ error: 'Not Found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return NextResponse.json({ data: product });
    } catch (error) {
        console.error('Error fetching product:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Internal Server Error' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const validation = productUpdateSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(
        JSON.stringify({ error: 'Bad Request', details: validation.error.errors }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: validation.data,
    });

    return new NextResponse(JSON.stringify({ data: updatedProduct }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating product:', error);
    if ((error as any).code === 'P2025') { // Prisma error code for record not found
        return new NextResponse(JSON.stringify({ error: 'Not Found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.product.delete({
            where: { id: params.id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting product:', error);
        if ((error as any).code === 'P2025') { // Prisma error code for record not found
            return new NextResponse(JSON.stringify({ error: 'Not Found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return new NextResponse(
            JSON.stringify({ error: 'Internal Server Error' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
