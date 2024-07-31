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

  type Chatbot = {
    name: string;
    description: string | null;
  };
  
export async function getChatbotById(chatbotId: number): Promise<Chatbot | null> {
    try {
        if (!chatbotId){
            console.log('Chatbotid is null.');
            return null
        }
        const chatbot = await prisma.chatbots.findFirst({
            where: {
                id: chatbotId,
            },
            select: {
                name: true, 
                description: true
            },
        });
        console.log(chatbot)
        if (chatbot) {
            return chatbot;
        } else {
            console.log('Chatbot not found.');
            return null;
        }
    } catch (error) {
        console.error('Error checking chatbot existence:', error);
        return null;
    }
}