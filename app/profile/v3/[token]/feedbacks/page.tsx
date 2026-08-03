"use client";

import { useState, useMemo, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import { useFeedbackFeed, FeedbackItem } from "@/hooks/useFeedbackFeed";
import { verifyFeedback, deleteFeedback } from "@/utils/feedback";
import { showToast } from "@/lib/toast";

export default function AdminFeedbacksPage() {
  const { feedback, loading } = useFeedbackFeed();
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "VERIFIED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewFeedback, setPreviewFeedback] = useState<FeedbackItem | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  // Filtered and Sorted dataset: Pending first, then Verified, then newest
  const filteredFeedbacks = useMemo(() => {
    const list = feedback.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.role.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterStatus === "PENDING") return !item.verified;
      if (filterStatus === "VERIFIED") return item.verified;
      return true;
    });

    return [...list].sort((a, b) => {
      if (a.verified === b.verified) return 0;
      return a.verified ? 1 : -1;
    });
  }, [feedback, searchQuery, filterStatus]);



  // Statistics
  const stats = useMemo(() => {
    const total = feedback.length;
    const pending = feedback.filter((f) => !f.verified).length;
    const verified = feedback.filter((f) => f.verified).length;
    return { total, pending, verified };
  }, [feedback]);

  const handleApprove = async (id: string) => {
    setActionId(id);
    try {
      await verifyFeedback(id);
      showToast.success("Feedback verified & published live!");
      if (previewFeedback?.id === id) {
        setPreviewFeedback((prev) => (prev ? { ...prev, verified: true } : null));
      }
    } catch (error) {
      console.error("Error verifying feedback:", error);
      showToast.error("Failed to verify feedback. Please try again.");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionId(id);
    try {
      await deleteFeedback(id);
      showToast.success("Feedback record permanently removed.");
      if (previewFeedback?.id === id) {
        setPreviewFeedback(null);
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
      showToast.error("Failed to delete feedback record.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-[1440px] mx-auto selection:bg-primary/20">
      <title>Community Feedback Hub | Admin | JMMS</title>

      {/* Hero Header Banner with Modern Gradient Glow */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-[#171f33] to-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-primary/20 text-[#c0c1ff] border border-primary/30">
              <Icon name="verified_user" className="text-sm" /> Community Moderation
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-black text-white tracking-tight">
              Feedback & Testimonials Hub
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl font-medium leading-relaxed">
              Review campus feedback, publish verified student & staff testimonials, and manage community suggestions.
            </p>
          </div>

          {/* Realtime KPI Pill Summary */}
          <div className="flex items-center gap-3 bg-white/10 dark:bg-slate-800/60 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <div className="px-4 py-2 text-center border-r border-white/10">
              <div className="text-2xl font-black text-white">{stats.total}</div>
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Total</div>
            </div>
            <div className="px-4 py-2 text-center border-r border-white/10">
              <div className="text-2xl font-black text-amber-400">{stats.pending}</div>
              <div className="text-[10px] font-mono font-bold uppercase text-amber-400/80">Pending</div>
            </div>
            <div className="px-4 py-2 text-center">
              <div className="text-2xl font-black text-emerald-400">{stats.verified}</div>
              <div className="text-[10px] font-mono font-bold uppercase text-emerald-400/80">Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Status Pill Filters */}
      <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Field */}
        <div className="relative w-full md:w-96">
          <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
          <input
            type="text"
            placeholder="Search feedback by author, message, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-[#464554]/20 text-xs font-semibold text-slate-800 dark:text-[#dae2fd] outline-none focus:border-primary dark:focus:border-[#8083ff] transition-all shadow-inner"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap md:flex-nowrap hide-scrollbar">
          {(["ALL", "PENDING", "VERIFIED"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                filterStatus === status
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-105"
                  : "bg-slate-100 dark:bg-[#131b2e] text-slate-600 dark:text-[#908fa0] hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {status === "ALL" && (
                <>
                  <Icon name="dashboard" className="text-sm" />
                  <span>All Logs ({stats.total})</span>
                </>
              )}
              {status === "PENDING" && (
                <>
                  <Icon name="pending" className="text-sm text-amber-500" />
                  <span>Needs Review ({stats.pending})</span>
                </>
              )}
              {status === "VERIFIED" && (
                <>
                  <Icon name="verified" className="text-sm text-emerald-500" />
                  <span>Approved Live ({stats.verified})</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Feedback Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-6 shadow-sm animate-pulse space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-2">
                  <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-100 dark:bg-[#131b2e] text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Icon name="rate_review" className="text-4xl text-slate-400" />
          </div>
          <h3 className="font-display text-xl font-bold text-slate-800 dark:text-[#dae2fd]">
            No Feedback Entries Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#908fa0] mt-1 max-w-sm mx-auto">
            No feedback entries match your active query or status filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeedbacks.map((item) => (
            <div
              key={item.id}
              className={`group bg-white dark:bg-[#171f33] border rounded-3xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                !item.verified
                  ? "border-amber-500/30 dark:border-amber-500/20 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent"
                  : "border-slate-200 dark:border-[#464554]/10 hover:border-primary/40 dark:hover:border-[#8083ff]/40"
              }`}
            >
              {/* Header Info */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    {/* User Avatar with Initials */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-[#222a3d] dark:to-[#171f33] text-white font-black text-sm flex items-center justify-center shrink-0 border border-slate-700 shadow-md">
                      {item.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-[#dae2fd] text-sm leading-tight group-hover:text-primary dark:group-hover:text-[#c0c1ff] transition-colors">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-[#908fa0] mt-1">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#131b2e] font-mono font-bold text-[10px]">
                          {item.role}
                        </span>
                        <span>•</span>
                        <span>{item.timeAgo}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  {item.verified ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                      <Icon name="check_circle" className="text-xs" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0 animate-pulse">
                      <Icon name="pending" className="text-xs" /> Pending
                    </span>
                  )}
                </div>

                {/* Feedback Content Card */}
                <div className="bg-slate-50/80 dark:bg-[#131b2e]/90 p-4 rounded-2xl border border-slate-100 dark:border-[#464554]/10 relative group-hover:border-slate-200 dark:group-hover:border-[#464554]/30 transition-colors">
                  <p className="text-xs text-slate-700 dark:text-[#dae2fd] leading-relaxed font-medium line-clamp-4 italic">
                    &ldquo;{item.message}&rdquo;
                  </p>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#464554]/10 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewFeedback(item)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#131b2e] text-slate-700 dark:text-[#dae2fd] hover:bg-slate-200 dark:hover:bg-[#222a3d] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Icon name="visibility" className="text-sm text-primary dark:text-[#8083ff]" />
                  <span>View Details</span>
                </button>

                <div className="flex items-center gap-2">
                  {!item.verified && (
                    <button
                      type="button"
                      disabled={actionId === item.id}
                      onClick={() => handleApprove(item.id)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {actionId === item.id ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Icon name="verified" className="text-sm" />
                      )}
                      <span>Approve</span>
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={actionId === item.id}
                    onClick={() => handleDelete(item.id)}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Delete Record"
                  >
                    <Icon name="delete" className="text-base" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern High-End Preview Modal */}
      {previewFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/30 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-[#222a3d] dark:to-[#171f33] text-white font-black text-xl flex items-center justify-center shadow-lg border border-slate-700 shrink-0">
                  {previewFeedback.initials}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-[#dae2fd]">
                    {previewFeedback.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#908fa0] mt-0.5">
                    <span className="font-semibold">{previewFeedback.role}</span>
                    <span>•</span>
                    <span>Submitted {previewFeedback.timeAgo}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewFeedback(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <Icon name="close" className="text-xl" />
              </button>
            </div>

            {/* Status Pill Card */}
            <div className="flex items-center justify-between bg-slate-50 dark:bg-[#131b2e] px-4 py-3 rounded-2xl border border-slate-200 dark:border-[#464554]/20">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                VERIFICATION STATUS
              </span>
              {previewFeedback.verified ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <Icon name="check_circle" className="text-sm" /> Approved & Live
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  <Icon name="pending" className="text-sm" /> Pending Moderation
                </span>
              )}
            </div>

            {/* Feedback Detail Text */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">
                User Feedback Message
              </label>
              <div className="bg-slate-50 dark:bg-[#131b2e] p-5 rounded-2xl border border-slate-200 dark:border-[#464554]/20 text-xs text-slate-800 dark:text-[#dae2fd] leading-relaxed font-medium whitespace-pre-wrap italic">
                &ldquo;{previewFeedback.message}&rdquo;
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#464554]/10">
              <button
                type="button"
                onClick={() => handleDelete(previewFeedback.id)}
                className="px-4 py-2.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Icon name="delete" className="text-base" />
                <span>Delete Entry</span>
              </button>

              <div className="flex items-center gap-3">
                {!previewFeedback.verified && (
                  <button
                    type="button"
                    disabled={actionId === previewFeedback.id}
                    onClick={() => handleApprove(previewFeedback.id)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Icon name="verified" className="text-base" />
                    <span>Approve & Verify</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPreviewFeedback(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
