import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { z } from 'zod';

const stockSchema = z.object({
  stock: z.number().int().min(0, 'Stock must be a non-negative integer'),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const validation = stockSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 400 });
    }

    const { stock } = validation.data;

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: { stock },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(`Error updating stock for product ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
  }
}