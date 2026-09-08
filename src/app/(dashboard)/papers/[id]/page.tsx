type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PaperPage({
  params,
}: Props) {
  const { id } = await params;

  return (
    <main className="p-10 text-white">
      <h1 className="text-3xl font-bold">
        Paper Details
      </h1>

      <p className="mt-4 text-zinc-400">
        {id}
      </p>
    </main>
  );
}