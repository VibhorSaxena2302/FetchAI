import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getUserIdByUsername(username: string): Promise<number | null> {
    try {
        const user = await prisma.users.findFirst({
            where: {
                username: username,
            },
            select: {
                id: true,  // Only fetch the ID
            },
        });
        console.log(user)
        if (user) {
            return user.id;
        } else {
            console.log('User not found.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

export async function getChatbotsByUserId(userId: number) {
    const chatbots = await prisma.chatbots.findMany({
      where: {
        creator_id: userId
      }
    });
    return chatbots;
  }

  export async function getChatbotsByUsername(username: string) {
    const userId = await getUserIdByUsername(username)
    if (!userId){
        return null;
    }
    const chatbots = await getChatbotsByUserId(userId)
    return chatbots;
  }