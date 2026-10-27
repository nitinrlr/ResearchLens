"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, TextField } from "@radix-ui/themes";

export default function RegisterPage() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const response = await fetch("/api/register", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    setLoading(false);

    if (!response.ok) {
      setError(data.error);
      return;
    }
    router.push("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6 text-ink">
      <div className="w-full max-w-md rounded-2xl border border-line bg-canvas p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-center">
          ResearchLens
        </h1>
        <p className="mt-1 text-ink-muted text-center">
          Create your account
        </p>
        <form 
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
          >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium"
            >
              Name
            </label>
            <TextField.Root
              id="name"
              type="text"
              size="3"
              autoComplete="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
              placeholder="john@email.com"
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="mb-2 block text-sm font-medium"
            >
              Confirm Password
            </label>
            <TextField.Root
              id="confirm-password"
              type="password"
              size="3"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            Create Account
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-ink-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-accent-ink hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}