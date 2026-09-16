import { auth } from "@/auth";

export default async function ProfilePage() {
  const session = await auth();

  return (
    <main className="p-10 text-white">
      <h1 className="text-4xl font-bold">
        Profile
      </h1>
      <p className="mt-2 text-zinc-400">
        Your account details.
      </p>
      <dl className="mt-10 max-w-md space-y-5 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div>
          <dt className="text-sm text-zinc-500">
            Name
          </dt>
          <dd className="mt-1">
            {session?.user?.name}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-zinc-500">
            Email
          </dt>
          <dd className="mt-1">
            {session?.user?.email}
          </dd>
        </div>
      </dl>
    </main>
  );
}
