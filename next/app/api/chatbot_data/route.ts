// pages/api/signup.ts
import { NextResponse } from "next/server";
import { cookies } from 'next/headers'
import { deleteChatbotById, getChatbotById } from "@/app/lib/database";

export async function POST(
  req: Request,
) {
  const cookieStore = cookies()
  const cookieObject = cookieStore.get('username')
  const username = cookieObject ? cookieObject.value : 'undefined';

  if (req.method === 'POST' && username != 'undefined') {
    const {chatbotid} = await new Response(req.body).json();
    try {
      
      const chatbot = await getChatbotById(chatbotid)

      if (chatbot) {
        return NextResponse.json({ chatbot }, {status: 201});
      }
      return NextResponse.json({ error: 'chatbot doesnt exist' }, {status: 409});
    } catch (error) {
      return NextResponse.json({ error: error }, {status: 500});
    }
  } else {
    return NextResponse.json({ error: 'Method ${req.method} Not Allowed' }, {status: 405});
  }
}

export async function DELETE(req: Request) {
  const cookieStore = cookies()
  const cookieObject = cookieStore.get('username')
  const username = cookieObject ? cookieObject.value : 'undefined';

  if (req.method === 'DELETE' && username != 'undefined') {
    const {chatbotid} = await new Response(req.body).json();
    console.log(chatbotid)
    try {
      
      const res = await deleteChatbotById(chatbotid)

      if (res){
        return NextResponse.json({ 'deleted':true }, {status: 201});
      }
      return NextResponse.json({ error: 'Deletion error' }, {status: 409});
    } catch (error) {
      return NextResponse.json({ error: error }, {status: 500});
    }
  } else {
    return NextResponse.json({ error: 'Method ${req.method} Not Allowed' }, {status: 405});
  }
}
