"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import ComplaintForm, { ExistingComplaintImage } from "@/components/admin/raise-complaint/ComplaintForm";
import { db } from "@/lib/firebase";
import { doc, getDoc, Bytes } from "firebase/firestore";

type ComplaintInitialData = {
  category: string;
  location: string;
  priority: string;
  description: string;
};

export default function EditComplaintPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [initialData, setInitialData] = useState<ComplaintInitialData | null>(null);
  const [initialImages, setInitialImages] = useState<ExistingComplaintImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const docSnap = await getDoc(doc(db, "complaints", id));
        if (!docSnap.exists()) {
          setNotFound(true);
          return;
        }
        const data = docSnap.data();
        setInitialData({
          category: data.category || "",
          location: data.location || "",
          priority: data.priority || "Medium",
          description: data.description || "",
        });

        const rawImages: unknown[] = data.images || [];
        setInitialImages(
          rawImages.map((img, index) => {
            const isLegacy = img instanceof Bytes;
            const bytes: Bytes = isLegacy ? img : (img as { data: Bytes }).data;
            const type = isLegacy ? "image/jpeg" : (img as { type?: string }).type || "image/jpeg";
            const name = isLegacy
              ? `attachment-${index + 1}.jpg`
              : (img as { name?: string }).name || `attachment-${index + 1}.jpg`;
            return {
              bytes,
              type,
              name,
              preview: `data:${type};base64,${bytes.toBase64()}`,
            };
          }),
        );
      } catch (error) {
        console.error("Error fetching complaint:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#464554]/30 border-t-[#8083ff] rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !initialData) {
    return (
      <div className="space-y-8 pb-12 max-w-4xl mx-auto">
        <title>Edit Complaint | JMMS Admin</title>
        <div className="bg-[#171f33] border border-[#464554]/10 rounded-3xl p-16 text-center shadow-sm">
          <Icon name="search_off" className="text-4xl text-[#908fa0] mb-3 block mx-auto" />
          <h3 className="font-display text-xl font-bold text-[#dae2fd]">Ticket Not Found</h3>
          <p className="text-xs text-[#908fa0] mt-1">This complaint may have been removed.</p>
          <button
            onClick={() => router.push("/admin/view-complaints")}
            className="mt-6 px-6 py-3 vibrant-gradient text-white rounded-xl font-bold text-xs cursor-pointer"
          >
            Back to Overview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <title>Edit Complaint | JMMS Admin</title>

      <div>
        <Link
          href="/admin/view-complaints"
          className="inline-flex items-center gap-2 text-[#908fa0] font-bold hover:text-[#c0c1ff] transition-colors text-xs uppercase tracking-wider"
        >
          <Icon name="arrow_back" className="text-lg" />
          Back to overview
        </Link>
        <h1 className="font-display text-3xl font-extrabold text-[#dae2fd] tracking-tight mt-2">
          Edit Maintenance Incident
        </h1>
        <p className="text-xs text-[#c7c4d7] opacity-80 mt-1 font-semibold">
          Update the details of ticket <span className="font-bold text-[#c0c1ff]">{id}</span>.
        </p>
      </div>

      <ComplaintForm mode="edit" complaintId={id} initialData={initialData} initialImages={initialImages} />
    </div>
  );
}
