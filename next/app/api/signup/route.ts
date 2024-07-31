// pages/api/signup.ts
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

export async function POST(
  req: Request,
) {
  if (req.method === 'POST') {
    const { username, email, password } = await new Response(req.body).json();
    try {
      // Check if email or username already exists
      const existingUser = await prisma.users.findFirst({
        where: {
          OR: [
            { username: username },
            { email: email }
          ],
        },
      });
      
      if (existingUser) {
        return NextResponse.json({ error: 'Username or Email already exists.' }, {status: 409});
      }
            
      // Proceed to create user if no existing user is found
      const newUser = await prisma.users.create({
        data: {
          username,
          email,
          password, // Ensure to hash the password before saving (use bcrypt or similar in production)
        },
      });

      return NextResponse.json({ user: newUser }, {status: 201});
    } catch (error) {
      return NextResponse.json({ error: error }, {status: 500});
    }
  } else {
    return NextResponse.json({ error: 'Method ${req.method} Not Allowed' }, {status: 405});
  }
}