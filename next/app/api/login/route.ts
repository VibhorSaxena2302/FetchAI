// pages/api/signup.ts
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers'

const prisma = new PrismaClient({});

export async function POST(
  req: Request,
) {
  if (req.method === 'POST') {
    const { username, password } = await new Response(req.body).json();
    try {
      // Check if email or username already exists
      const existingUser = await prisma.users.findFirst({
        where: {
          AND: [
            { username: username },
            { password: password }
          ],
        },
      });
      
      if (existingUser) {
        const oneDay = 24 * 60 * 60 * 1000
        cookies().set('username', username, { maxAge: oneDay, expires: Date.now() - oneDay, path:'/' })
        return NextResponse.json({ user: username }, {status: 201});
      }
      console.log(username, password);
      return NextResponse.json({ error: 'Username or Password is incorrect.' }, {status: 409});
    } catch (error) {
      return NextResponse.json({ error: error }, {status: 500});
    }
  } else {
    return NextResponse.json({ error: 'Method ${req.method} Not Allowed' }, {status: 405});
  }
}