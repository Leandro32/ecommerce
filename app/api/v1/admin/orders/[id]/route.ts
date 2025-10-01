
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { OrderStatus } from '@prisma/client';

const orderUpdateSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const order = await prisma.order.findUnique({
            where: { id: params.id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            return new NextResponse(JSON.stringify({ error: 'Not Found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return NextResponse.json({ data: order });
    } catch (error) {
        console.error('Error fetching order:', error);
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
    const validation = orderUpdateSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(
        JSON.stringify({ error: 'Bad Request', details: validation.error.errors }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: validation.data.status,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return new NextResponse(JSON.stringify({ data: updatedOrder }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating order:', error);
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
