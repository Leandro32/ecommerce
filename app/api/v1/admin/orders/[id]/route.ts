import { NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { OrderStatus } from '@/src/types/order';
import { z } from 'zod';

const updateOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  // Add other fields that can be updated if necessary
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const body = await request.json();
    const validatedData = updateOrderSchema.parse(body);

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: validatedData,
      include: { items: { include: { product: true } } },
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    console.error(`Error updating order with ID ${id}:`, error);
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 });
  }
}
