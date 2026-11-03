import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const sourcePath = 'C:/Users/lkhai/.gemini/antigravity/brain/28abced2-8eda-4f23-9b9d-0d5b1be5ed18/.user_uploaded/media_1793727426125_104d5580.jpg';
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

    if (fs.existsSync(sourcePath)) {
      const buffer = fs.readFileSync(sourcePath);
      try {
        fs.writeFileSync(publicDest, buffer);
      } catch {
        // Ignored if public folder write is restricted
      }
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

