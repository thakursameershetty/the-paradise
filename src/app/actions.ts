'use server';

import prisma from '@/lib/prisma';

export async function saveParticipant({
  nickname,
  animal,
  color1,
  color2,
}: {
  nickname: string;
  animal: string;
  color1: string;
  color2: string;
}) {
  try {
    const participant = await prisma.participant.create({
      data: {
        nickname,
        animal,
        color1,
        color2,
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
