import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();

  const { name, email, password } = body;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return NextResponse.json(
      {
        error: "Email already exists.",
      },
      {
        status: 400,
      }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
}