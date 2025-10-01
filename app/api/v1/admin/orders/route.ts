
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { OrderStatus } from '@prisma/client';

const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});

const orderSchema = z.object({
  customerName: z.string().min(1),
  items: z.array(orderItemSchema).min(1),
  status: z.nativeEnum(OrderStatus).optional(),
});

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
    return NextResponse.json({ data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
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
    const validation = orderSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(
        JSON.stringify({ error: 'Bad Request', details: validation.error.errors }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const { customerName, items, status } = validation.data;

    // TODO: Add logic to verify product existence and stock availability

    const newOrder = await prisma.order.create({
      data: {
        customerName,
        status: status || 'SOLICITUD_NUEVO',
        items: {
          create: items.map(item => ({
            quantity: item.quantity,
            product: { connect: { id: item.productId } },
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return new NextResponse(JSON.stringify({ data: newOrder }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
