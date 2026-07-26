'use server';

import prisma from '@/lib/prisma';

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
        color1: colors[0],
        color2: colors[1],
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
