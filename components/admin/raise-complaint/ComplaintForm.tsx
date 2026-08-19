"use client";

import { useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import Dropdown from "@/components/ui/Dropdown";
import { Complaint } from "@/types/complaint";
import { auth, db } from "@/lib/firebase";
import { addDoc, collection, doc, updateDoc, Bytes, serverTimestamp } from "firebase/firestore";

const MAX_IMAGES = 2;

const CATEGORY_OPTIONS = [
  { value: "Electrical", label: "Electrical" },
  { value: "Plumbing", label: "Plumbing" },
  { value: "Civil", label: "Civil" },
  { value: "Carpentry", label: "Carpentry" },
  { value: "HVAC", label: "HVAC" },
  { value: "Telephone", label: "Telephone" },
  { value: "Others", label: "Others" },
];

const PRIORITY_OPTIONS = [
  { value: "High", label: "High Priority" },
  { value: "Medium", label: "Medium Priority" },
  { value: "Low", label: "Low Priority" },
];

export type ExistingComplaintImage = {
  bytes: Bytes;
  type: string;
  name: string;
  preview: string;
};

export default function ComplaintForm({
  mode = "create",
  complaintId,
  initialData,
  initialImages,
  basePath,
}: {
  mode?: "create" | "edit";
  complaintId?: string;
  initialData?: {
    category: string;
    location: string;
    priority: string;
    description: string;
  };
  initialImages?: ExistingComplaintImage[];
  basePath?: string;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [category, setCategory] = useState(initialData?.category || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [priority, setPriority] = useState(initialData?.priority || "Medium");
  const [description, setDescription] = useState(initialData?.description || "");

  // Image upload states (up to MAX_IMAGES, counting existing + newly attached)
  const [existingImages, setExistingImages] = useState<ExistingComplaintImage[]>(initialImages || []);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (files: File[]) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    const remainingSlots = MAX_IMAGES - existingImages.length - imageFiles.length;

    if (remainingSlots <= 0) {
      setError(`You can attach up to ${MAX_IMAGES} images.`);
      return;
    }

    const incoming = files.slice(0, remainingSlots);
    const invalid = incoming.find((file) => !validTypes.includes(file.type));
    if (invalid) {
      setError("Please upload image files only (JPG, PNG, or JPEG).");
      return;
    }

    setError(null);
    setImageFiles((prev) => [...prev, ...incoming]);

    incoming.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const fileToImageRecord = async (file: File) => {
    const buffer = await file.arrayBuffer();
    return {
      data: Bytes.fromUint8Array(new Uint8Array(buffer)),
      type: file.type,
      name: file.name,
    };
  };

  const handleReset = () => {
    setCategory(initialData?.category || "");
    setLocation(initialData?.location || "");
    setPriority(initialData?.priority || "Medium");
    setDescription(initialData?.description || "");
    setExistingImages(initialImages || []);
    setImageFiles([]);
    setImagePreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!category) {
      setError("Please select a complaint category.");
      return;
    }
    if (!location.trim()) {
      setError("Please specify the campus location.");
      return;
    }
    if (!description.trim()) {
      setError("Please provide a description of the issue.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError("You must be signed in to submit a complaint.");
      return;
    }

    setSubmitting(true);

    try {
      const newImages = await Promise.all(imageFiles.map(fileToImageRecord));

      if (mode === "edit" && complaintId) {
        const keptImages = existingImages.map(({ bytes, type, name }) => ({ data: bytes, type, name }));

        await updateDoc(doc(db, "complaints", complaintId), {
          category,
          location,
          priority,
          description,
          images: [...keptImages, ...newImages],
        });

        setSubmitting(false);
        setSuccess(true);

        setTimeout(() => {
          router.push(basePath ? `${basePath}/view-complaints` : "/admin/view-complaints");
        }, 1500);
        return;
      }

      await addDoc(collection(db, "complaints"), {
        userId: user.uid,
        category,
        location,
        priority,
        description,
        status: "Pending",
        images: newImages,
        createdAt: serverTimestamp(),
      });

      const stored = localStorage.getItem("JFM_complaints");
      const list: Complaint[] = stored ? JSON.parse(stored) : [];

      const newId = `REQ-${Math.floor(8900 + Math.random() * 100)}`;
      const newComplaint: Complaint = {
        id: newId,
        category,
        location,
        priority: priority as "High" | "Medium" | "Low",
        status: "Pending",
        date: new Date().toISOString().split("T")[0],
        description,
      };

      localStorage.setItem("JFM_complaints", JSON.stringify([newComplaint, ...list]));

      setSubmitting(false);
      setSuccess(true);

      setTimeout(() => {
        router.push(basePath ? `${basePath}/view-complaints` : "/admin/view-complaints");
      }, 1500);
    } catch (err) {
      console.error("Error submitting complaint:", err);
      setSubmitting(false);
      setError(mode === "edit" ? "Failed to update complaint. Please try again." : "Failed to submit complaint. Please try again.");
    }
  };

  return (
    <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-6 md:p-6 md:p-10 shadow-sm relative overflow-hidden dark:vibrant-shadow">

      {success && (
        <div className="absolute inset-0 z-40 bg-white/95 dark:bg-[#171f33]/95 flex flex-col items-center justify-center space-y-4 animate-fade-in text-center p-6">
          <div className="w-16 h-16 bg-emerald-500/10 dark:bg-[#4edea3]/10 rounded-full flex items-center justify-center text-emerald-600 dark:text-[#4edea3]">
            <Icon name="check_circle" className="text-5xl animate-bounce" />
          </div>
          <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-[#dae2fd]">
            {mode === "edit" ? "Ticket Updated!" : "Ticket Published!"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#908fa0] max-w-sm">
            {mode === "edit"
              ? "Complaint updated successfully. Redirecting you to incidents view..."
              : "Complaint logged successfully. Redirecting you to incidents view..."}
          </p>
        </div>
      )}

      {submitting && (
        <div className="absolute inset-0 z-40 bg-white/80 dark:bg-[#171f33]/80 flex flex-col items-center justify-center space-y-4 animate-fade-in">
          <div className="w-10 h-10 border-4 border-slate-300 dark:border-[#464554]/30 border-t-primary dark:border-t-[#8083ff] rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-900 dark:text-[#dae2fd]">
            {mode === "edit" ? "Updating incident details..." : "Publishing incident details..."}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-bold flex items-center gap-3">
            <Icon name="error" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="category" className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0]">
              Complaint Category
            </label>
            <Dropdown
              id="category"
              options={CATEGORY_OPTIONS}
              value={category}
              onChange={setCategory}
              placeholder="Choose category"
              scroll={false}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="priority" className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0]">
              Priority Urgency
            </label>
            <Dropdown
              id="priority"
              options={PRIORITY_OPTIONS}
              value={priority}
              onChange={setPriority}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0]">
            Campus Location
          </label>
          <input
            id="location"
            type="text"
            placeholder="e.g. Block B, Room 302 or Physics Lab 3"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-xl px-4 py-3.5 text-xs bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-[#464554]/20 text-slate-800 dark:text-[#dae2fd] font-semibold outline-none focus:border-primary dark:focus:border-[#8083ff]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0]">
            Issue Description
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Provide a detailed description of the maintenance issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl p-4 text-xs bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-[#464554]/20 text-slate-800 dark:text-[#dae2fd] font-semibold outline-none focus:border-primary dark:focus:border-[#8083ff] resize-none"
          />
        </div>

        <div className="space-y-2">
          <span className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0]">
            Attach Reference Image (Optional, up to {MAX_IMAGES})
          </span>

          {(existingImages.length > 0 || imagePreviews.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {existingImages.map((image, index) => (
                <div
                  key={`existing-${index}`}
                  className="border border-slate-200 dark:border-[#464554]/20 rounded-3xl p-4 flex items-center justify-between gap-4 bg-slate-50 dark:bg-[#131b2e]"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden relative shrink-0 border border-slate-200 dark:border-[#464554]/20">
                      <img src={image.preview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-[#dae2fd] truncate">{image.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="text-red-500 p-2 hover:bg-red-500/10 rounded-xl cursor-pointer shrink-0"
                  >
                    <Icon name="delete" className="text-xl" />
                  </button>
                </div>
              ))}
              {imagePreviews.map((preview, index) => (
                <div
                  key={`new-${index}`}
                  className="border border-slate-200 dark:border-[#464554]/20 rounded-3xl p-4 flex items-center justify-between gap-4 bg-slate-50 dark:bg-[#131b2e]"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden relative shrink-0 border border-slate-200 dark:border-[#464554]/20">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-[#dae2fd] truncate">
                      {imageFiles[index]?.name || "attachment.jpg"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="text-red-500 p-2 hover:bg-red-500/10 rounded-xl cursor-pointer shrink-0"
                  >
                    <Icon name="delete" className="text-xl" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {existingImages.length + imagePreviews.length < MAX_IMAGES && (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                dragActive
                  ? "border-primary dark:border-[#8083ff] bg-primary/5 dark:bg-[#8083ff]/5"
                  : "border-slate-300 dark:border-[#464554]/30 hover:border-primary/50 dark:hover:border-[#8083ff]/50 hover:bg-slate-50 dark:hover:bg-[#131b2e]/40"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
              />
              <div className="w-12 h-12 bg-slate-100 dark:bg-[#131b2e] text-slate-400 dark:text-[#908fa0] rounded-2xl flex items-center justify-center">
                <Icon name="upload" className="text-2xl" />
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900 dark:text-[#dae2fd]">Drag & drop photo or click to upload</p>
                <p className="text-[10px] text-slate-500 dark:text-[#908fa0] mt-1">
                  Supported: JPG, PNG, JPEG · {MAX_IMAGES - existingImages.length - imagePreviews.length} slot(s) left
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-[#464554]/10">
          <button
            type="submit"
            className="flex-1 py-4 vibrant-gradient text-white rounded-xl font-bold shadow-lg shadow-primary/20 dark:shadow-[#8083ff]/20 text-xs cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <Icon name={mode === "edit" ? "save" : "send"} /> {mode === "edit" ? "Update Ticket" : "Submit Incident"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-4 border border-slate-200 dark:border-[#464554]/30 text-slate-600 dark:text-[#908fa0] font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-[#222a3d] text-xs cursor-pointer"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
