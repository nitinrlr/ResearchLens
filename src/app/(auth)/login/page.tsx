"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button, TextField } from "@radix-ui/themes";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/explore");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6 text-ink">
      <div className="w-full max-w-md rounded-2xl border border-line bg-canvas p-8 shadow-sm">
        <h1 className="text-3xl font-bold">
          ResearchLens
        </h1>
        <p className="mt-2 text-ink-muted">
          Sign in to your account
        </p>
        <form onSubmit={handleSubmit}
        className="mt-8 space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Email
            </label>
            <TextField.Root
              id="email"
              type="email"
              size="3"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>
            <TextField.Root
              id="password"
              type="password"
              size="3"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-sm text-danger">
              {error}
            </p>
          )}
          <Button
            type="submit"
            size="3"
            loading={loading}
            className="w-full"
          >
            Sign In
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-ink-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-accent-ink hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
