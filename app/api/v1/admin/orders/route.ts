import { NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { z } from 'zod';
import { OrderStatus } from '@/types/order';

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1),
});

const createOrderSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  items: z.array(orderItemSchema).min(1, 'Order must contain at least one item'),
});

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    const { customerName, items } = validatedData;

    // Start a transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Validate stock for each product
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found.`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
        }
      }

      // 2. Create the order
      const newOrder = await tx.order.create({
        data: {
          customerName,
          status: OrderStatus.SOLICITUD_NUEVO, // Default status for new orders
          items: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
        include: { items: true },
      });

      // 3. Decrement stock for purchased products
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    console.error('Error creating order:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 400 });
  }
}