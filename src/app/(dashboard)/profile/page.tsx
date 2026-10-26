import { auth } from "@/auth";

export default async function ProfilePage() {
  const session = await auth();

  return (
    <main className="p-10 text-ink">
      <h1 className="text-4xl font-bold">
        Profile
      </h1>
      <p className="mt-2 text-ink-muted">
        Your account details.
      </p>
      <dl className="mt-10 max-w-md space-y-5 rounded-xl border border-line bg-canvas p-6">
        <div>
          <dt className="text-sm text-ink-faint">
            Name
          </dt>
          <dd className="mt-1">
            {session?.user?.name}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-ink-faint">
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
