import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');

  // Ensure the upload directory exists
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
    return NextResponse.json({ error: 'Failed to create upload directory' }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Basic file type validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, GIF, WEBP are allowed.' }, { status: 400 });
    }

    // Basic file size validation (e.g., 5MB)
    const maxFileSize = 5 * 1024 * 1024; 
    if (file.size > maxFileSize) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit.' }, { status: 400 });
    }

    const fileExtension = path.extname(file.name);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const imageUrl = `/uploads/products/${uniqueFilename}`;

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    console.error('Error processing image upload:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}