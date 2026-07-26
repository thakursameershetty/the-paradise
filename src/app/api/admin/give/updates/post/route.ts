import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate body
    const { authorName, authorUsername, authorAvatar, content, image } = body;
    
    if (!authorName || !authorUsername || !content) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        authorName,
        authorUsername,
        authorAvatar: authorAvatar || '',
        content,
        image: image || null,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
