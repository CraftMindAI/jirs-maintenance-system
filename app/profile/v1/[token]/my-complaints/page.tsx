"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, Bytes } from "firebase/firestore";
import { useComplaintsFeed } from "@/hooks/useComplaintsFeed";
import { useComplaintDetail } from "@/hooks/useComplaintDetail";
import { deleteComplaint, editComplaint } from "@/utils/admin/complaints";
import { Complaint } from "@/types/complaint";

const ADMIN_ROLES = ["admin"];

export default function MyComplaints({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const basePath = `/profile/v1/${token}`;

  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [userProfile, setUserProfile] = useState<{
    name: string;
    role: string;
    email: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  // Edit modal (only ever opened for Pending tickets)
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(
    null,
  );
  const [edCategory, setEdCategory] = useState("");
  const [edLocation, setEdLocation] = useState("");
  const [edPriority, setEdPriority] = useState("Medium");
  const [edDescription, setEdDescription] = useState("");
  const [edSaving, setEdSaving] = useState(false);
  const [edError, setEdError] = useState<string | null>(null);
  const [edSerial, setEdSerial] = useState(0);

  // Edit modal: image attachment state
  const [edImageFile, setEdImageFile] = useState<File | null>(null);
  const [edImagePreview, setEdImagePreview] = useState<string | null>(null);
  const [edImageRemoved, setEdImageRemoved] = useState(false);
  const [edDragActive, setEdDragActive] = useState(false);
  const edFileInputRef = useRef<HTMLInputElement>(null);

  // Fetches the existing attachment (if any) for whichever ticket is open in the edit modal
  const { images: edExistingImages } = useComplaintDetail(editingComplaint?.id ?? "");

  useEffect(() => {
    if (!editingComplaint) return;
    setEdImageFile(null);
    setEdImageRemoved(false);
    setEdImagePreview(edExistingImages[0] || null);
    // Only re-run when the open ticket changes — edExistingImages arrives asynchronously
    // after openEdit() and shouldn't retrigger this on every fetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingComplaint?.id]);

  useEffect(() => {
    if (!editingComplaint || edImageFile || edImageRemoved) return;
    setEdImagePreview(edExistingImages[0] || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edExistingImages]);

  const openEdit = (item: Complaint, serial: number) => {
    setEditingComplaint(item);
    setEdSerial(serial);
    setEdCategory(item.category);
    setEdLocation(item.location);
    setEdPriority(item.priority);
    setEdDescription(item.description);
    setEdError(null);
  };

  const closeEdit = () => {
    setEditingComplaint(null);
    setEdError(null);
  };

  const processEdImageFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setEdError("Please upload an image file (JPG, PNG, or JPEG).");
      return;
    }
    setEdError(null);
    setEdImageFile(file);
    setEdImageRemoved(false);

    const reader = new FileReader();
    reader.onloadend = () => {
      setEdImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleEdDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setEdDragActive(true);
    } else if (e.type === "dragleave") {
      setEdDragActive(false);
    }
  };

  const handleEdDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEdDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processEdImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleEdFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processEdImageFile(e.target.files[0]);
    }
  };

  const removeEdImage = () => {
    setEdImageFile(null);
    setEdImagePreview(null);
    setEdImageRemoved(true);
    if (edFileInputRef.current) edFileInputRef.current.value = "";
  };

  const handleEditSave = async () => {
    if (!editingComplaint) return;
    if (!edCategory) {
      setEdError("Please select a complaint category.");
      return;
    }
    if (!edLocation.trim()) {
      setEdError("Please specify the complaint location.");
      return;
    }
    if (!edDescription.trim()) {
      setEdError("Please provide a description of the issue.");
      return;
    }

    setEdSaving(true);
    setEdError(null);
    try {
      let images:
        | { data: Bytes; type: string; name: string }[]
        | undefined;
      if (edImageFile) {
        images = [
          {
            data: Bytes.fromUint8Array(new Uint8Array(await edImageFile.arrayBuffer())),
            type: edImageFile.type,
            name: edImageFile.name,
          },
        ];
      } else if (edImageRemoved) {
        images = [];
      }

      await editComplaint(editingComplaint.id, {
        category: edCategory,
        location: edLocation.trim(),
        priority: edPriority,
        description: edDescription.trim(),
        ...(images !== undefined ? { images } : {}),
      });
      setEditingComplaint(null);
    } catch (error) {
      console.error("Error updating complaint:", error);
      setEdError("Failed to update complaint. Please try again.");
    } finally {
      setEdSaving(false);
    }
  };

  // Sync auth state (role decides which complaints this user may see)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docSnap = await getDoc(doc(db, "users", user.uid));
          const data = docSnap.exists() ? docSnap.data() : null;
          setUserProfile({
            name: data?.name || user.displayName || "User",
            role: data?.role || "Student",
            email: user.email || "",
          });
          setUserId(user.uid);
        } catch (error) {
          console.error("Error fetching user doc:", error);
          setUserProfile({
            name: "Siddharth Roy",
            role: "Student",
            email: "siddharth.r@jirs.ac.in",
          });
          setUserId(user.uid);
        }
      } else {
        // Mock fallback for presentation
        setUserProfile({
          name: "Siddharth Roy",
          role: "Student",
          email: "siddharth.r@jirs.ac.in",
        });
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const isAdmin =
    !!userProfile && ADMIN_ROLES.includes(userProfile.role.toLowerCase());

  // Guests (no real uid) never fetch real data; signed-in admins see every
  // complaint, signed-in residents see only their own.
  const { complaints: visibleComplaints } = useComplaintsFeed(
    userId ? (isAdmin ? null : userId) : undefined,
  );

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await deleteComplaint(id);
    } catch (error) {
      console.error("Error deleting complaint:", error);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(null);
    }
  };

  // Filter complaints based on status severity sorting:
  // Pending -> Assigned -> In Progress -> Completed -> Verified
  const getSeverityScore = (status: string) => {
    switch (status) {
      case "Pending":
        return 1;
      case "Assigned":
        return 2;
      case "In Progress":
        return 3;
      case "Completed":
        return 4;
      case "Verified":
        return 5;
      default:
        return 6;
    }
  };

  const filteredComplaints = visibleComplaints
    .filter((c) => {
      const matchQuery =
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.location &&
          c.location.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      const matchPriority =
        priorityFilter === "all" || c.priority === priorityFilter;
      return matchQuery && matchStatus && matchPriority;
    })
    .sort((a, b) => getSeverityScore(a.status) - getSeverityScore(b.status));

  const deleteTarget = visibleComplaints.find((c) => c.id === showDeleteConfirm) || null;

  return (
    <div className="space-y-8 pb-12">
      <title>My Complaints | JMMS</title>

      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            {isAdmin ? "All Maintenance Tickets" : "My Maintenance Tickets"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isAdmin
              ? "Manage, filter, and track status logs for every complaint raised campus-wide."
              : "Manage, filter, and track status logs for the complaints you've raised."}
          </p>
        </div>
        <Link
          href={`${basePath}/add-complaint`}
          className="bg-primary hover:bg-opacity-90 text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-all text-sm scale-100 active:scale-95"
        >
          <Icon name="add" className="text-xl" />
          Add Complaint
        </Link>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full lg:flex-1">
          <Icon
            name="search"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by ticket ID, category, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-body-md text-sm outline-none focus:border-primary dark:focus:border-primary transition-all"
          />
        </div>
        {/* Status Filter */}
        <div className="w-full lg:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-body-md text-sm outline-none focus:border-primary dark:focus:border-primary transition-all cursor-pointer appearance-none bg-no-repeat"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Verified">Verified</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        {/* Priority Filter */}
        <div className="w-full lg:w-48">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-body-md text-sm outline-none focus:border-primary dark:focus:border-primary transition-all cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Main complaints Grid */}
      {filteredComplaints.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          {/* Desktop Table view */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-black uppercase text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="py-4 px-6">S.No</th>
                  <th className="py-4 px-6">Complaint Category</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Priority</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Submitted Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-sm">
                {filteredComplaints.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-4 px-6 text-slate-800 dark:text-slate-100 font-bold">
                      {idx + 1}
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                      {item.category}
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs truncate max-w-[150px]">
                      {item.location}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          item.priority === "High"
                            ? "bg-red-500/10 text-red-500 border border-red-500/20"
                            : item.priority === "Medium"
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          item.status === "Rejected"
                            ? "bg-red-500/15 text-red-500 border border-red-500/30"
                            : item.status === "Pending"
                              ? "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                              : item.status === "Assigned"
                                ? "bg-indigo-500/15 text-indigo-500 border border-indigo-500/30"
                                : item.status === "In Progress"
                                  ? "bg-sky-500/15 text-sky-500 border border-sky-500/30"
                                  : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400 dark:text-slate-500 text-xs">
                      {item.date}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-3 text-slate-400 dark:text-slate-500">
                        {item.status === "Pending" && (
                          <button
                            onClick={() => openEdit(item, idx + 1)}
                            title="Edit Ticket"
                            className="hover:text-primary dark:hover:text-white transition-colors cursor-pointer"
                          >
                            <Icon name="edit" className="text-xl" />
                          </button>
                        )}
                        <Link
                          href={`${basePath}/track-complaint?ticket=${item.id}`}
                          title="View Progress"
                          className="hover:text-primary dark:hover:text-white transition-colors"
                        >
                          <Icon name="visibility" className="text-xl" />
                        </Link>
                        {(item.status === "Pending" || item.status === "Rejected") && (
                          <button
                            onClick={() => setShowDeleteConfirm(item.id)}
                            title="Delete Ticket"
                            className="hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <Icon name="delete" className="text-xl" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filteredComplaints.map((item, idx) => (
              <div
                key={item.id}
                className="p-6 space-y-4 hover:bg-slate-50/20 dark:hover:bg-slate-800/20 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {idx + 1}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      item.status === "Rejected"
                        ? "bg-red-500/15 text-red-500 border border-red-500/30"
                        : item.status === "Pending"
                          ? "bg-amber-500/15 text-amber-500 border border-amber-500/20"
                          : item.status === "Assigned"
                            ? "bg-indigo-500/15 text-indigo-500 border border-indigo-500/20"
                            : item.status === "In Progress"
                              ? "bg-sky-500/15 text-sky-500 border border-sky-500/20"
                              : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="font-bold text-slate-700 dark:text-slate-300">
                    {item.category}
                  </div>
                  <div className="text-slate-400 dark:text-slate-500">
                    {item.location}
                  </div>
                  <p className="line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800/40">
                  <div className="flex gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.priority === "High"
                          ? "bg-red-500/10 text-red-500"
                          : item.priority === "Medium"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-slate-500/10 text-slate-500"
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center">
                      {item.date}
                    </span>
                  </div>
                  <div className="flex gap-4 text-slate-400">
                    {item.status === "Pending" && (
                      <button
                        onClick={() => openEdit(item, idx + 1)}
                        className="hover:text-primary transition-colors cursor-pointer"
                      >
                        <Icon name="edit" className="text-lg" />
                      </button>
                    )}
                    <Link
                      href={`${basePath}/track-complaint?ticket=${item.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      <Icon name="visibility" className="text-lg" />
                    </Link>

                    {(item.status === "Pending" || item.status === "Rejected") && (
                      <button
                        onClick={() => setShowDeleteConfirm(item.id)}
                        className="hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Icon name="delete" className="text-lg" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-400 mb-6">
            <Icon name="assignment_late" className="text-3xl" />
          </div>
          <h3 className="font-display text-xl font-bold text-slate-800 dark:text-slate-100">
            No Tickets Found
          </h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
            There are no complaints matching your current filters. Try resetting
            search fields or raise a new request.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal Overlay */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 animate-scale-in">
            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
              <Icon name="warning" className="text-3xl" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Confirm Deletion
              </h4>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 leading-relaxed">
                Are you sure you want to delete the maintenance ticket for{" "}
                <strong className="text-slate-600 dark:text-slate-300">
                  {deleteTarget?.category}
                  {deleteTarget?.description ? ` — ${deleteTarget.description}` : ""}
                </strong>
                ? This action cannot be undone and will remove it from the
                tracking feed.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={deleting}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 transition-all text-sm cursor-pointer disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete Ticket"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Complaint Modal Overlay — only ever opened for Pending tickets */}
      {editingComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl animate-scale-in max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar">
            <div>
              <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Edit Ticket #{edSerial}
              </h4>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">
                You can edit this ticket while it&rsquo;s still Pending.
              </p>
            </div>

            {edError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm font-semibold flex items-center gap-3">
                <Icon name="error" />
                {edError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="ed-category"
                  className="block font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400"
                >
                  Complaint Category
                </label>
                <select
                  id="ed-category"
                  value={edCategory}
                  onChange={(e) => setEdCategory(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-body-md text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="" disabled>
                    Choose category
                  </option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Civil">Civil</option>
                  <option value="Carpentry">Carpentry</option>
                  <option value="HVAC">HVAC</option>
                  <option value="Telephone">Telephone</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="ed-priority"
                  className="block font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400"
                >
                  Priority Urgency
                </label>
                <select
                  id="ed-priority"
                  value={edPriority}
                  onChange={(e) => setEdPriority(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-body-md text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="ed-location"
                className="block font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400"
              >
                Campus Location
              </label>
              <input
                id="ed-location"
                type="text"
                value={edLocation}
                onChange={(e) => setEdLocation(e.target.value)}
                className="w-full rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-body-md text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="ed-description"
                className="block font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400"
              >
                Issue Description
              </label>
              <textarea
                id="ed-description"
                rows={4}
                value={edDescription}
                onChange={(e) => setEdDescription(e.target.value)}
                className="w-full rounded-xl p-4 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-body-md text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-primary transition-all resize-none"
              />
            </div>

            {/* Reference Image */}
            <div className="space-y-2">
              <span className="block font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Reference Image (Optional)
              </span>

              {!edImagePreview ? (
                <div
                  onDragEnter={handleEdDrag}
                  onDragOver={handleEdDrag}
                  onDragLeave={handleEdDrag}
                  onDrop={handleEdDrop}
                  onClick={() => edFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    edDragActive
                      ? "border-primary bg-primary/5"
                      : "border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <input
                    ref={edFileInputRef}
                    type="file"
                    onChange={handleEdFileChange}
                    accept="image/jpeg,image/png,image/jpg"
                    className="hidden"
                  />
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl flex items-center justify-center">
                    <Icon name="upload" className="text-xl" />
                  </div>
                  <p className="font-bold text-xs text-slate-700 dark:text-slate-300">
                    Drag & drop an image or click to upload
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    Supported: JPG, PNG, JPEG. Max file size: 5MB.
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-14 h-14 rounded-xl overflow-hidden relative shrink-0 border border-slate-200 dark:border-slate-800">
                      <img src={edImagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                      {edImageFile?.name || "Current attachment"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeEdImage}
                    className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all cursor-pointer shrink-0"
                  >
                    <Icon name="delete" className="text-lg" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-2">
              <button
                onClick={closeEdit}
                disabled={edSaving}
                className="flex-1 py-3 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm cursor-pointer disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={edSaving}
                className="flex-1 py-3 bg-primary hover:bg-opacity-95 text-white rounded-xl font-bold shadow-lg shadow-primary/25 transition-all text-sm cursor-pointer disabled:opacity-60"
              >
                {edSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
