"use client";

export default function ComplaintDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-48 bg-[#171f33] rounded-xl border border-[#464554]/10" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-96 bg-[#171f33] rounded-3xl border border-[#464554]/10" />
        </div>
        <div className="space-y-6">
          <div className="h-48 bg-[#171f33] rounded-3xl border border-[#464554]/10" />
          <div className="h-64 bg-[#171f33] rounded-3xl border border-[#464554]/10" />
        </div>
      </div>
    </div>
  );
}
