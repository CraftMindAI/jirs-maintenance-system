import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function PageHeader() {
  return (
    <div>
      <Link
        href="/admin/view-complaints"
        className="inline-flex items-center gap-2 text-[#908fa0] font-bold hover:text-[#c0c1ff] transition-colors text-xs uppercase tracking-wider"
      >
        <Icon name="arrow_back" className="text-lg" />
        Back to overview
      </Link>
      <h1 className="font-display text-3xl font-extrabold text-[#dae2fd] tracking-tight mt-2">
        File Maintenance Incident
      </h1>
      <p className="text-xs text-[#c7c4d7] opacity-80 mt-1 font-semibold">
        Specify location, department details, and attach photos to log a new administrative ticket.
      </p>
    </div>
  );
}
