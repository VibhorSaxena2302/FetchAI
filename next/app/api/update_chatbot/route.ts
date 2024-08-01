import { NextResponse } from "next/server";
import { cookies } from 'next/headers'
import { updateChatbotById } from "@/app/lib/database";

export async function POST(req: Request) {
    const cookieStore = cookies()
    const cookieObject = cookieStore.get('username')
    const username = cookieObject ? cookieObject.value : 'undefined';
  
    if (req.method === 'POST' && username != 'undefined') {
      const {id, description, role, document_name, document_url} = await new Response(req.body).json();
      if (document_name==null && document_url==null){
        const result = await updateChatbotById({id, description, role})

        if (result == true){
            return NextResponse.json({ result }, {status: 201});
        }
        return NextResponse.json({ error: 'Failed to update chatbot' }, {status: 409});
      }
    } else {
      return NextResponse.json({ error: 'Method ${req.method} Not Allowed' }, {status: 405});
    }
  }