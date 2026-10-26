export default function SettingsPage() {
  return (
    <main className="p-10 text-ink">
      <h1 className="text-4xl font-bold">
        Settings
      </h1>
      <p className="mt-2 text-ink-muted">
        Manage your account preferences.
      </p>

      <div className="mt-12 rounded-xl border border-dashed border-line-strong p-12 text-center">
        <h2 className="text-xl font-semibold">
          Nothing to configure yet
        </h2>
        <p className="mt-2 text-ink-faint">
          Experience level and reading preferences are coming soon.
        </p>
      </div>
    </main>
  );
}
