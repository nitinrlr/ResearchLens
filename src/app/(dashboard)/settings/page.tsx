export default function SettingsPage() {
  return (
    <main className="p-10 text-white">
      <h1 className="text-4xl font-bold">
        Settings
      </h1>
      <p className="mt-2 text-zinc-400">
        Manage your account preferences.
      </p>

      <div className="mt-12 rounded-xl border border-dashed border-zinc-700 p-12 text-center">
        <h2 className="text-xl font-semibold">
          Nothing to configure yet
        </h2>
        <p className="mt-2 text-zinc-500">
          Experience level and reading preferences are coming soon.
        </p>
      </div>
    </main>
  );
}
