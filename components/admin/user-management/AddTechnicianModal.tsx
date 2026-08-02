"use client";

import { FormEvent, useState } from "react";
import Icon from "@/components/ui/Icon";

export default function AddTechnicianModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: (data: { name: string; email: string; phone: string }) => Promise<void>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value.trim();

    setSubmitting(true);
    try {
      await onConfirm({ name, email, phone });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create technician account.");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/20 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-[#8083ff]/10 text-primary dark:text-[#8083ff] flex items-center justify-center text-xl shrink-0">
            <Icon name="engineering" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Add Technician
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#908fa0]">
              Create a new technician account
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0] tracking-wider">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="John Doe"
              className="w-full rounded-xl px-4 py-3 text-xs bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-[#464554]/20 text-slate-800 dark:text-[#dae2fd] font-semibold outline-none focus:border-primary dark:focus:border-[#8083ff] focus:ring-2 focus:ring-primary/20 dark:focus:ring-[#8083ff]/20 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0] tracking-wider">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="technician@jirs.ac.in"
              className="w-full rounded-xl px-4 py-3 text-xs bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-[#464554]/20 text-slate-800 dark:text-[#dae2fd] font-semibold outline-none focus:border-primary dark:focus:border-[#8083ff] focus:ring-2 focus:ring-primary/20 dark:focus:ring-[#8083ff]/20 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0] tracking-wider">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="+91 9876543210"
              className="w-full rounded-xl px-4 py-3 text-xs bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-[#464554]/20 text-slate-800 dark:text-[#dae2fd] font-semibold outline-none focus:border-primary dark:focus:border-[#8083ff] focus:ring-2 focus:ring-primary/20 dark:focus:ring-[#8083ff]/20 transition-all"
            />
          </div>

          {error && <p className="text-xs font-semibold text-red-500">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-slate-600 dark:text-[#908fa0] hover:bg-slate-100 dark:hover:bg-[#131b2e] transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Icon name="person_add" className="text-sm" />
                  Create Technician
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
