import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { isLiked, username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    if (isLiked) {
      // Upsert to ensure we only increment if they haven't liked it yet
      const existingLike = await (prisma as any).postLike.findUnique({
        where: { postId_username: { postId: id, username } }
      });
      if (!existingLike) {
        await prisma.$transaction([
          (prisma as any).postLike.create({ data: { postId: id, username } }),
          prisma.post.update({ where: { id }, data: { likes: { increment: 1 } } })
        ]);
      }
    } else {
      const existingLike = await (prisma as any).postLike.findUnique({
        where: { postId_username: { postId: id, username } }
      });
      if (existingLike) {
        await prisma.$transaction([
          (prisma as any).postLike.delete({ where: { postId_username: { postId: id, username } } }),
          prisma.post.update({ where: { id }, data: { likes: { decrement: 1 } } })
        ]);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update post like' }, { status: 500 });
  }
}
