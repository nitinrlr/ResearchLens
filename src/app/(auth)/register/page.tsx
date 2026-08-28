"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-center">
          ResearchLens
        </h1>
        <p className="mt-1 text-zinc-400 text-center">
          Create your account
        </p>
        <form 
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
          >
          <div>
            <label className="mb-2 block text-sm">
              Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm">
              Email
            </label>
            <input
              type="email"
              placeholder="john@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-3 font-medium transition hover:bg-blue-500"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-400 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}