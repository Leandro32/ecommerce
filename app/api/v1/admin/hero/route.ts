import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const heroSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  paragraph: z.string().min(1, 'Paragraph is required'),
  heroImageUrl: z.string().url('Invalid URL'),
  buttonLayout: z.enum(['none', 'oneButton', 'twoButtons']),
  buttons: z
    .array(
      z.object({
        buttonText: z.string().min(1, 'Button text is required'),
        buttonLink: z.string().min(1, 'Button link is required'),
        isExternal: z.boolean(),
        variant: z.enum(['primary', 'secondary']),
      })
    )
    .optional(),
});

export async function GET() {
  try {
    const hero = await prisma.hero.findFirst({
      include: {
        buttons: true,
      },
    });
    return NextResponse.json(hero);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hero data' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = heroSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 400 });
    }

    const { buttons = [], ...heroData } = validation.data;

    const existingHero = await prisma.hero.findFirst();

    const hero = await prisma.hero.upsert({
      where: { id: existingHero?.id || 'some-static-id' },
      update: {
        ...heroData,
        buttons: {
          deleteMany: {},
          create: buttons.map((button) => ({
            ...button,
          })),
        },
      },
      create: {
        ...heroData,
        buttons: {
          create: buttons.map((button) => ({
            ...button,
          })),
        },
      },
      include: {
        buttons: true,
      },
    });

    return NextResponse.json(hero);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update hero data' }, { status: 500 });
  }
}
