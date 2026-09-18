import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  DEFAULT_COLLECTION_DESCRIPTION,
  DEFAULT_COLLECTION_TITLE,
} from "@/services/collection.service";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
// bcrypt ignores anything past 72 bytes
const MAX_PASSWORD_BYTES = 72;

function badRequest(error: string) {
  return NextResponse.json(
    {
      error,
    },
    {
      status: 400,
    }
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid request body.");
  }

  const { name, email, password } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return badRequest("Name, email, and password are required.");
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  if (!trimmedName || trimmedName.length > 100) {
    return badRequest("Name must be between 1 and 100 characters.");
  }

  if (!EMAIL_PATTERN.test(trimmedEmail) || trimmedEmail.length > 254) {
    return badRequest("Please enter a valid email address.");
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return badRequest(
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    );
  }

  if (Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES) {
    return badRequest("Password is too long.");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: trimmedEmail,
    },
  });

  if (existingUser) {
    return badRequest("Email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    // A nested create runs in the same transaction as the user insert, so an
    // account can never exist without its default "Saved" collection.
    const user = await prisma.user.create({
      data: {
        name: trimmedName,
        email: trimmedEmail,
        passwordHash,

        collections: {
          create: {
            title: DEFAULT_COLLECTION_TITLE,
            description: DEFAULT_COLLECTION_DESCRIPTION,
            isDefault: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    // Two sign-ups with the same email can pass the check above at once
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return badRequest("Email already exists.");
    }

    throw error;
  }
}
