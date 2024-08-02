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
    role: string | null;
    document_name: string | null
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
                role: true,
                document_id: true
            },
        });
        let document = null
        if (chatbot.document_id){
            document = await prisma.documents.findFirst({
                where: {
                    id: chatbot.document_id,
                },
                select: {
                    name: true
                },
            });
        }
        if (chatbot) {
            if (document!=null){
                return {'name':chatbot.name, 'description':chatbot.description, 'role':chatbot.role, 'document_name':document.name}
            }
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
            // Retrieve the chatbot including its linked document ID
            const chatbot = await prisma.chatbots.findUnique({
                where: { id: chatbotId },
                select: { document_id: true }  // Only fetch the document_id
            });

            // If a document is linked, delete it
            if (chatbot && chatbot.document_id) {
                await prisma.documents.delete({
                    where: { id: chatbot.document_id }
                });
            }

            // Delete the chatbot
            await prisma.chatbots.delete({
                where: { id: chatbotId }
            });
        });

        console.log('Chatbot and linked document deleted successfully');
        return true;
    } catch (error) {
        console.error('Failed to delete chatbot:', error);
        return false;
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

type UpdateChatbotWithDocumentInput = {
    id: number;
    description?: string | null;
    role?: string | null;
    document_name: string;
    document_url: string;
};

export async function updateChatbotWithDocument({ id, description, role, document_name, document_url }: UpdateChatbotWithDocumentInput): Promise<boolean> {
    if (!id) {
        console.error('Chatbot ID is null.');
        return false;
    }

    try {
        // Start a transaction
        await prisma.$transaction(async (prisma) => {
            // Retrieve the chatbot including its linked document ID
            const chatbot = await prisma.chatbots.findUnique({
                where: { id: id },
                select: { document_id: true }  // Only fetch the document_id
            });

            // If a document is linked, delete it
            if (chatbot && chatbot.document_id) {
                await prisma.documents.delete({
                    where: { id: chatbot.document_id }
                });
            }
        });

        // Start a transaction to ensure both operations are executed together
        const result = await prisma.$transaction(async (prisma) => {
            // Step 1: Add a new document to the documents table
            const newDocument = await prisma.documents.create({
                data: {
                    name: document_name,
                    url: document_url,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });

            // Step 2: Update the chatbot with the new document_id
            const updatedChatbot = await prisma.chatbots.update({
                where: { id: id },
                data: {
                    description: description,
                    role: role,
                    document_id: newDocument.id,  // Link the new document
                    updated_at: new Date(),
                },
            });

            return updatedChatbot;  // Return the updated chatbot details
        });

        console.log('Chatbot updated successfully with new document:', result);
        return true;
    } catch (error) {
        console.error('Error updating chatbot with document:', error);
        return false;
    }
}