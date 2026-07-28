import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');

  if (!postId) {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { postId, author, text, parentId } = await request.json();

    if (!postId || !author || !text) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const newComment = await prisma.comment.create({
      data: {
        postId,
        author,
        text,
        parentId: parentId || null,
      },
    });

    await prisma.post.update({
      where: { id: postId },
      data: { comments: { increment: 1 } },
    });

    return NextResponse.json(newComment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
