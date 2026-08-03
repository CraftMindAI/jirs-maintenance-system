"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { UserItem } from "@/app/profile/v3/[token]/user-management/page";

export default function ResetPasswordModal({
  user,
  onCancel,
  onConfirm,
}: {
  user: UserItem;
  onCancel: () => void;
  onConfirm: (user: UserItem) => Promise<string>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm(user);
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password.");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/20 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl shrink-0">
            <Icon name="vpn_key" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Reset Account Password
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#908fa0]">
              User Account Governance
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            Are you sure you want to reset the password for <span className="text-primary dark:text-[#c0c1ff]">{user.name}</span>?
          </p>
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
            type="button"
            onClick={handleSend}
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Resetting...
              </>
            ) : (
              <>
                <Icon name="vpn_key" className="text-sm" />
                Reset Password
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
