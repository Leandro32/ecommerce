import { NextResponse } from 'next/server';
import prisma from '@lib/prisma';

export async function GET() {
  try {
    const footerContent = await prisma.footerContent.findMany();
    return NextResponse.json(footerContent);
  } catch (error) {
    console.error('Error fetching footer content:', error);
    return NextResponse.json({ error: 'Failed to fetch footer content' }, { status: 500 });
  }
}
