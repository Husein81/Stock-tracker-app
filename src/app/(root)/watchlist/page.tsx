import { WatchlistTable } from "@/components";

export default function Page() {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <section className="grid grid-cols md:grid-cols-2 gap-8 w-full">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <WatchlistTable />
        </div>
      </section>
    </div>
  );
}
