// pages/api/signup.ts
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers'
import { getUserIdByUsername } from "@/app/lib/database";

const prisma = new PrismaClient({});

export async function POST(
  req: Request,
) {
  const cookieStore = cookies()
  const cookieObject = cookieStore.get('username')
  const username = cookieObject ? cookieObject.value : 'undefined';

  if (req.method === 'POST' && username != 'undefined') {
    const { name, description } = await new Response(req.body).json();
    try {
      const existingChatbot = await prisma.chatbots.findFirst({
        where: {
            name: name
        },
      });
      
      if (existingChatbot) {
        return NextResponse.json({ error: 'Chatbot name already exists.' }, {status: 409});
      }
    
      const userid = await getUserIdByUsername(username)

      const newChatbot = await prisma.chatbots.create({
        data: {
          name,
          description,
          creator_id: userid
        },
      });
      return NextResponse.json({ chatbot: newChatbot }, {status: 201});
    } catch (error) {
      return NextResponse.json({ error: error }, {status: 500});
    }
  } else {
    return NextResponse.json({ error: 'Method ${req.method} Not Allowed' }, {status: 405});
  }
}