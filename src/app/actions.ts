'use server';

import prisma from '@/lib/prisma';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';

export async function saveParticipant({
  nickname,
  animal,
  colors,
  fullName,
  email,
  phone,
  q1,
  q2,
  q3,
  q4
}: {
  nickname: string;
  animal: string;
  colors: string[];
  fullName: string;
  email: string;
  phone: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
}) {
  try {
    const participant = await prisma.participant.create({
      data: {
        nickname,
        animal,
        colors,
        fullName,
        email,
        phone,
        q1,
        q2,
        q3,
        q4
      },
    });

    return { success: true, participant };
  } catch (error: any) {
    console.error('Failed to save participant:', error);

    // Handle Prisma unique constraint error
    if (error.code === 'P2002') {
      return { success: false, error: 'Nickname is already taken. Please try another one.' };
    }

    return { success: false, error: 'Failed to save data. Please try again.' };
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, posts };
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return { success: false, error: error.message };
  }
}

export async function checkParticipantExists(email: string, phone: string) {
  try {
    const participant = await prisma.participant.findFirst({
      where: {
        OR: [
          { email: email },
          { phone: phone }
        ]
      }
    });
    return { success: true, participant };
  } catch (error: any) {
    console.error('Error checking participant:', error);
    return { success: false, error: error.message };
  }
}

export async function createAdminPost(formData: FormData) {
  try {
    const content = formData.get('content') as string;
    const mediaFile = formData.get('mediaFile') as File | null;

    if (!content) {
      return { success: false, error: 'Missing required fields' };
    }

    const authorName = 'The Paradise';
    const authorUsername = '@theparadise';
    const authorAvatarUrl = '/assets/paradise.svg'; // Or default-avatar.png if this doesn't exist, but paradise.svg exists as seen in page.tsx

    let imageUrl = null;
    if (mediaFile && mediaFile.size > 0) {
      if (mediaFile.size > 1024 * 1024) {
        return { success: false, error: 'Image size must be below 1MB.' };
      }
      
      const bytes = await mediaFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${mediaFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const uploadDir = join(process.cwd(), 'public/uploads');
      const filepath = join(uploadDir, filename);
      
      // Ensure the directory exists
      await mkdir(uploadDir, { recursive: true });
      await writeFile(filepath, buffer);
      
      imageUrl = `/uploads/${filename}`;
    }

    const post = await prisma.post.create({
      data: {
        authorName,
        authorUsername,
        authorAvatar: authorAvatarUrl,
        content,
        image: imageUrl,
      },
    });

    return { success: true, post };
  } catch (error: any) {
    console.error('Error creating post:', error);
    return { success: false, error: 'Failed to create post. Please try again.' };
  }
}

export async function deleteAdminPost(postId: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return { success: false, error: 'Post not found' };
    }

    if (post.image && post.image.startsWith('/uploads/')) {
      const filename = post.image.replace('/uploads/', '');
      const filepath = join(process.cwd(), 'public/uploads', filename);
      try {
        await unlink(filepath);
      } catch (e) {
        console.warn('Failed to delete media file:', e);
      }
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting post:', error);
    return { success: false, error: 'Failed to delete post. Please try again.' };
  }
}

export async function getParticipants() {
  try {
    const participants = await prisma.participant.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, participants };
  } catch (error: any) {
    console.error('Error fetching participants:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteParticipant(participantId: string) {
  try {
    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
    });

    if (!participant) {
      return { success: false, error: 'Participant not found' };
    }

    await prisma.participant.delete({
      where: { id: participantId },
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting participant:', error);
    return { success: false, error: 'Failed to delete participant. Please try again.' };
  }
}
