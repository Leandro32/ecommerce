import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const hero = await prisma.hero.findFirst({
      where: {
        // You might want to add a filter here, e.g., if you add an `isActive` field
      },
      include: {
        buttons: true,
      },
    });
    return NextResponse.json(hero);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hero data' }, { status: 500 });
  }
}
