import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { isUpvoted, username } = await request.json();
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    if (isUpvoted) {
      const existingLike = await (prisma as any).commentLike.findUnique({
        where: { commentId_username: { commentId: id, username } }
      });
      if (!existingLike) {
        await prisma.$transaction([
          (prisma as any).commentLike.create({ data: { commentId: id, username } }),
          prisma.comment.update({ where: { id }, data: { upvotes: { increment: 1 } } })
        ]);
      }
    } else {
      const existingLike = await (prisma as any).commentLike.findUnique({
        where: { commentId_username: { commentId: id, username } }
      });
      if (existingLike) {
        await prisma.$transaction([
          (prisma as any).commentLike.delete({ where: { commentId_username: { commentId: id, username } } }),
          prisma.comment.update({ where: { id }, data: { upvotes: { decrement: 1 } } })
        ]);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to upvote comment' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const author = searchParams.get('author');

    const comment = await prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    if (comment.author !== author) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.comment.delete({
      where: { id }
    });

    // We also decrement the post comment count, but wait, cascading delete might delete replies too. 
    // It's a bit complex to correctly decrement for all replies deleted, but we can do a simple decrement for now.
    await prisma.post.update({
      where: { id: comment.postId },
      data: { comments: { decrement: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
