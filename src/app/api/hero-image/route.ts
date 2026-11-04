import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const publicDest = path.join(process.cwd(), 'public', 'hero-bg.jpg');

  try {
    if (fs.existsSync(publicDest)) {
      const buffer = fs.readFileSync(publicDest);
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  } catch (error) {
    console.error('Error serving hero image:', error);
  }

  return new NextResponse('Hero image not found', { status: 404 });
}

