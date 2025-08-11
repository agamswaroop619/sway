import { NextRequest, NextResponse } from 'next/server';


export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { adminStorage } = await import('@/lib/firebase-admin'); // lazy import
  const { v4: uuidv4 } = await import('uuid');

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string' || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Use Blob properties safely
    const fileObj = file as Blob & { name?: string; type?: string };
    const originalName = typeof fileObj.name === 'string' ? fileObj.name : 'upload.bin';
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${uuidv4()}-${safeName}`;

    // Read file buffer from Blob
    const arrayBuffer = await fileObj.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const bucket = adminStorage.bucket();
    const storageFile = bucket.file(`uploads/${fileName}`);
    await storageFile.save(buffer, { contentType: fileObj.type || 'application/octet-stream' });
    await storageFile.makePublic();
    const publicUrl = storageFile.publicUrl();

    // For now, just return the image URL. In the future, you can accept more fields and return a product object.
    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file', details: String(error) }, { status: 500 });
  }
} 