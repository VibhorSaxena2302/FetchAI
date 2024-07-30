// pages/api/signup.ts
import type { NextApiRequest } from 'next';
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export async function POST(
  req: NextApiRequest,
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
      
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
      
      // Proceed to create user if no existing user is found
      const newUser = await prisma.users.create({
        data: {
          username,
          email,
          password: hashedPassword, // Ensure to hash the password before saving (use bcrypt or similar in production)
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