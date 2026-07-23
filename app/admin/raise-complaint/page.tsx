import PageHeader from "@/components/admin/raise-complaint/PageHeader";
import ComplaintForm from "@/components/admin/raise-complaint/ComplaintForm";

export default function AdminRaiseComplaint() {
  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <title>Raise Complaint | JMMS Admin</title>

      <PageHeader />

      <ComplaintForm />
    </div>
  );
}
