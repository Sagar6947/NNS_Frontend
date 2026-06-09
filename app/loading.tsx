export default function Loading() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full animate-pulse">
      <div className="mb-8 border-b border-[#2d2e33] pb-4">
        <div className="h-8 bg-[#2d2e33] rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-[#2d2e33] rounded w-1/2 mb-8"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="h-32 bg-[#1a1b1e] rounded-xl border border-[#2d2e33]"></div>
        <div className="h-32 bg-[#1a1b1e] rounded-xl border border-[#2d2e33]"></div>
        <div className="h-32 bg-[#1a1b1e] rounded-xl border border-[#2d2e33]"></div>
      </div>
      <div className="h-96 bg-[#1a1b1e] rounded-xl border border-[#2d2e33]"></div>
    </div>
  );
}
