import { AlertList, WatchlistTable } from "@/components";

export default function Page() {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <section className="grid grid-cols md:grid-cols-5 gap-8 w-full">
        {/* Left Column */}
        <div className="flex flex-col gap-6 col-span-3">
          <WatchlistTable />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6 col-span-2">
          <AlertList />
        </div>
      </section>
    </div>
  );
}
