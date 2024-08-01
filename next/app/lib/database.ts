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
                description: true,
                role: true
            },
        });
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

export async function deleteChatbotById(chatbotId: number): Promise<boolean> {
    try {
        // Start a transaction
        await prisma.$transaction(async (prisma) => {
            // Delete linked documents first
            await prisma.documents.deleteMany({
                where: {
                    chatbots: {
                        some: {
                            id: chatbotId,
                        },
                    },
                },
            });

            // Delete the chatbot
            await prisma.chatbots.delete({
                where: {
                    id: chatbotId,
                },
            });
        });

        console.log('Chatbot and linked documents deleted successfully');
        return true
    } catch (error) {
        console.error('Failed to delete chatbot:', error);
        return false
    }
}

type UpdateChatbotInput = {
    id: number;
    description?: string | null;
    role?: string | null;
};

export async function updateChatbotById({ id, description, role }: UpdateChatbotInput): Promise<boolean> {
    if (!id) {
        console.error('Chatbot ID is null.');
        return false
    }

    try {
        const updatedChatbot = await prisma.chatbots.update({
            where: { id: id },
            data: {
                description: description,
                role: role,
                updated_at: new Date(),  // Optional: Manually set the updated_at time
            },
        });

        console.log('Chatbot updated successfully:', updatedChatbot);
        return true
    } catch (error) {
        console.error('Error updating chatbot:', error);
        return false
    }
}