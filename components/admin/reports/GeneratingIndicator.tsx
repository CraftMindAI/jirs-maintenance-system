export default function GeneratingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center p-20 space-y-3">
      <div className="w-10 h-10 border-4 border-[#464554]/30 border-t-[#8083ff] rounded-full animate-spin" />
      <p className="text-xs font-bold text-[#908fa0]">Formulating Lumina Prism reports...</p>
    </div>
  );
}
