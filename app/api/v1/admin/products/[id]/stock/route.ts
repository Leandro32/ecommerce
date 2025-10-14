import { NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { z } from 'zod';

const updateStockSchema = z.object({
  stock: z.number().int().min(0),
});

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const body = await request.json();
    const { stock } = updateStockSchema.parse(body);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { stock },
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    console.error(`Error updating stock for product with ID ${id}:`, error);
    return NextResponse.json({ error: error.message || 'Failed to update stock' }, { status: 500 });
  }
}
