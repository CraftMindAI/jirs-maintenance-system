import Icon from "@/components/ui/Icon";

export default function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 p-4 bg-[#171f33] text-[#dae2fd] rounded-2xl shadow-2xl flex items-center gap-3 animate-scale-in text-xs font-bold border border-[#c0c1ff]/30">
      <Icon name="check_circle" className="text-[#4edea3] text-xl" />
      {message}
    </div>
  );
}
