import { NextRequest, NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebase-admin';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs'; // Ensure this runs on the server

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    // Use a more specific type for the file object
    const fileObj = file as Blob & { name?: string; type?: string };
    const originalName = fileObj.name || 'upload.bin';
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${uuidv4()}-${safeName}`;

    // Read file buffer
    const arrayBuffer = await fileObj.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const bucket = adminStorage.bucket();
    const storageFile = bucket.file(`uploads/${fileName}`);
    await storageFile.save(buffer, { contentType: fileObj.type || 'application/octet-stream' });
    // Make the file public (optional, for demo)
    await storageFile.makePublic();
    const publicUrl = storageFile.publicUrl();

    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
} 