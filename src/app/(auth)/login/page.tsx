"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold">
          ResearchLens
        </h1>
        <p className="mt-2 text-zinc-400">
          Sign in to your account
        </p>
        <form className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-3 font-medium transition hover:bg-blue-500"
          >
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-400">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-blue-400 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}