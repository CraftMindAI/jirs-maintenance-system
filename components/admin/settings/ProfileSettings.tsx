"use client";

import { useEffect, useState, FormEvent } from "react";
import Icon from "@/components/ui/Icon";

export default function ProfileSettings() {
  const [fullName, setFullName] = useState("Admin User");
  const [email, setEmail] = useState("admin@jirs.ac.in");
  const [phone, setPhone] = useState("+91 99001 99880");
  const [department, setDepartment] = useState("Administration");
  const [role, setRole] = useState("Super Admin");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("jmms_admin_profile");
    if (stored) {
      const data = JSON.parse(stored);
      setFullName(data.name || "Admin User");
      setEmail(data.email || "admin@jirs.ac.in");
      setPhone(data.phone || "+91 99001 99880");
      setDepartment(data.department || "Administration");
      setRole(data.role || "Super Admin");
    }
  }, []);

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);

    setTimeout(() => {
      const updated = { name: fullName, email, phone, department, role };
      localStorage.setItem("jmms_admin_profile", JSON.stringify(updated));
      setProfileSaving(false);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {profileSaved && (
        <div className="p-4 bg-[#00a572]/10 border border-[#00a572]/20 text-[#4edea3] rounded-2xl text-xs font-bold flex items-center gap-3 animate-fade-in">
          <Icon name="check_circle" /> Admin profile updated successfully!
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#464554]/20">
        <div className="w-20 h-20 rounded-full bg-[#8083ff]/10 border border-[#8083ff]/30 text-[#c0c1ff] text-3xl font-black flex items-center justify-center relative">
          {fullName.charAt(0).toUpperCase()}
          <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full vibrant-gradient text-white flex items-center justify-center border border-[#0b1326] cursor-pointer shadow-md">
            <Icon name="photo_camera" className="text-xs" />
          </button>
        </div>
        <div>
          <h3 className="font-bold text-[#dae2fd] text-base">{fullName}</h3>
          <span className="text-xs text-[#908fa0] mt-0.5 block">{role} • {department}</span>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase text-[#908fa0]">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-xs bg-[#131b2e] border border-[#464554]/20 text-[#dae2fd] font-semibold outline-none focus:border-[#8083ff]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase text-[#908fa0]">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-xs bg-[#131b2e] border border-[#464554]/20 text-[#dae2fd] font-semibold outline-none focus:border-[#8083ff]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase text-[#908fa0]">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-xs bg-[#131b2e] border border-[#464554]/20 text-[#dae2fd] font-semibold outline-none focus:border-[#8083ff]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase text-[#908fa0]">Department</label>
            <input
              type="text"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-xs bg-[#131b2e] border border-[#464554]/20 text-[#dae2fd] font-semibold outline-none focus:border-[#8083ff]"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-[#464554]/20">
          <button
            type="submit"
            disabled={profileSaving}
            className="flex-1 py-3.5 vibrant-gradient text-white rounded-xl font-bold shadow-lg shadow-[#8083ff]/20 text-xs cursor-pointer uppercase tracking-wider"
          >
            {profileSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
