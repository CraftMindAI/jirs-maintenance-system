"use client";

import { use, useState, useRef, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { auth, db } from "@/lib/firebase";
import { addDoc, collection, Bytes, serverTimestamp } from "firebase/firestore";
import { showToast } from "@/lib/toast";
import { getNextTicketNumber } from "@/utils/ticketNumber";

export default function AddComplaint({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const basePath = `/profile/v1/${token}`;

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");

  // Image upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload an image file (JPG, PNG, or JPEG).");
      return;
    }
    setError(null);
    setImageFile(file);

    // Create reader preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const now = new Date();
    const hours = now.getHours() + now.getMinutes() / 60;
    if (hours < 9 || hours >= 18) {
      showToast.warning("We accept complaints from 9:00 AM to 6:00 PM only.");
      handleReset();
      router.push(`${basePath}/dashboard`);
      return;
    }

    if (!category) {
      setError("Please select a complaint category.");
      return;
    }
    if (!location.trim()) {
      setError("Please specify the complaint location.");
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
      const images = imageFile
        ? [
            {
              data: Bytes.fromUint8Array(new Uint8Array(await imageFile.arrayBuffer())),
              type: imageFile.type,
              name: imageFile.name,
            },
          ]
        : [];

      const ticketNumber = await getNextTicketNumber();

      await addDoc(collection(db, "complaints"), {
        userId: user.uid,
        ticketNumber,
        category,
        location,
        priority,
        description,
        status: "Pending",
        images,
        createdAt: serverTimestamp(),
      });

      setSubmitting(false);
      setSuccess(true);

      // Redirect back after success animation
      setTimeout(() => {
        router.push(`${basePath}/my-complaints`);
      }, 1500);
    } catch (err) {
      console.error("Error submitting complaint:", err);
      setSubmitting(false);
      setError("Failed to submit complaint. Please try again.");
    }
  };

  const handleReset = () => {
    setCategory("");
    setLocation("");
    setPriority("Medium");
    setDescription("");
    removeImage();
    setError(null);
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <title>Add Complaint | JFM</title>

      {/* Breadcrumb path back */}
      <div>
        <Link
          href={`${basePath}/my-complaints`}
          className="inline-flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold hover:text-primary transition-colors text-xs uppercase tracking-wider"
        >
          <Icon name="arrow_back" className="text-lg" />
          Back to list
        </Link>
        <h1 className="font-display text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-2">
          File Maintenance Complaint
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Specify location, department details, and attach images to log a new ticket.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 md:p-6 md:p-10 shadow-sm relative overflow-hidden">

        {/* Success Modal Overlay */}
        {success && (
          <div className="absolute inset-0 z-40 bg-white/95 dark:bg-slate-900/95 flex flex-col items-center justify-center space-y-4 animate-fade-in text-center p-6">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 shadow-inner">
              <Icon name="check_circle" className="text-5xl animate-bounce" />
            </div>
            <h3 className="font-display text-2xl font-black text-slate-800 dark:text-slate-100">Ticket Filed Successfully!</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 max-w-sm">
              Your maintenance complaint has been logged. Redirecting you to complaints status dashboard...
            </p>
          </div>
        )}

        {/* Submitting Loading Overlay */}
        {submitting && (
          <div className="absolute inset-0 z-40 bg-white/80 dark:bg-slate-900/80 flex flex-col items-center justify-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-800 border-t-primary rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Publishing complaint ticket...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm font-semibold flex items-center gap-3">
              <Icon name="error" />
              {error}
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Category selection */}
            <div className="space-y-2">
              <label htmlFor="category" className="block font-bold text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300">
                Complaint Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl px-4 py-3.5 font-body-md premium-input bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 cursor-pointer"
              >
                <option value="" disabled className="bg-white dark:bg-slate-900 text-slate-400">Choose category</option>
                <option value="Electrical" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Electrical</option>
                 <option value="Solar" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Solar</option>
                <option value="Plumbing" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Plumbing</option>
                <option value="Civil" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Civil</option>
                <option value="Carpentry" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Carpentry</option>
                <option value="HVAC" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">HVAC</option>
                <option value="Telephone" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Telephone</option>
                <option value="Others" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Others</option>
              </select>
            </div>

            {/* Priority selection */}
            <div className="space-y-2">
              <label htmlFor="priority" className="block font-bold text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300">
                Priority Urgency
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl px-4 py-3.5 font-body-md premium-input bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 cursor-pointer"
              >
                <option value="High" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">High Priority</option>
                <option value="Medium" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Medium Priority</option>
                <option value="Low" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Low Priority</option>
              </select>
            </div>

          </div>

          {/* Location field */}
          <div className="space-y-2">
            <label htmlFor="location" className="block font-bold text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300">
              Campus Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="e.g. Block B, Room 108 or Physics Lab 3"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl px-4 py-3.5 font-body-md premium-input bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          {/* Description field */}
          <div className="space-y-2">
            <label htmlFor="description" className="block font-bold text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300">
              Issue Description
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Provide a detailed description of the maintenance issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl p-4 font-body-md premium-input bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none"
            />
          </div>

          {/* Drag & drop Image upload mock */}
          <div className="space-y-2">
            <span className="block font-bold text-xs uppercase tracking-widest text-on-surface-variant dark:text-slate-300">
              Attach Reference Images (Optional)
            </span>

            {!imagePreview ? (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/jpg"
                  className="hidden"
                />
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center">
                  <Icon name="upload" className="text-2xl" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-700 dark:text-slate-300">Drag & drop files or click to upload</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Supported: JPG, PNG, JPEG. Max file size: 5MB.</p>
                </div>
              </div>
            ) : (
              <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-4 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden relative shrink-0 border border-slate-200 dark:border-slate-800">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                      {imageFile?.name || "attachment.jpg"}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {imageFile ? `${(imageFile.size / (1024 * 1024)).toFixed(2)} MB` : "Mock Size"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all cursor-pointer"
                >
                  <Icon name="delete" className="text-xl" />
                </button>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/40">
            <button
              type="submit"
              className="flex-1 py-4 bg-primary hover:bg-opacity-95 text-white rounded-xl font-bold shadow-lg shadow-primary/25 transition-all text-sm cursor-pointer scale-100 active:scale-95 flex items-center justify-center gap-2"
            >
              <Icon name="send" />
              Submit Complaint
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-4 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm cursor-pointer"
            >
              Reset
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
