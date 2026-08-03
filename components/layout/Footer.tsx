"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function Footer() {
  const [activeModal, setActiveModal] = useState<"privacy" | "terms" | null>(null);

  return (
    <>
      <footer className="w-full bg-[#030812] py-8 md:py-10 px-margin-mobile md:px-margin-desktop text-white border-t border-white/10 relative overflow-hidden">
        {/* Subtle Ambient Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />

        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-6">
          
          {/* Brand Col */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/20">
                <Icon name="school" className="text-lg text-white" />
              </div>
              <span className="font-display text-xl font-black tracking-wider text-white">JMMS</span>
            </div>
            <p className="font-body text-xs text-slate-400 leading-relaxed max-w-xs">
              Elevating residential life through enterprise-grade facility maintenance management at Jain International Residential School.
            </p>
          </div>

          {/* System Services */}
          <div className="space-y-2">
            <h6 className="font-display text-xs font-bold text-white tracking-wider uppercase">System Services</h6>
            <div className="flex flex-col gap-1.5 text-xs text-slate-400">
              <Link href="/" className="hover:text-sky-400 transition-colors">Maintenance Portal</Link>
              <Link href="/login" className="hover:text-sky-400 transition-colors">Admin Dashboard</Link>
              <Link href="/login" className="hover:text-sky-400 transition-colors">Technician Hub</Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h6 className="font-display text-xs font-bold text-white tracking-wider uppercase">Quick Links</h6>
            <div className="flex flex-col gap-1.5 text-xs text-slate-400">
              <Link href="/about-us" className="hover:text-sky-400 transition-colors">About JIRS</Link>
              <Link href="/feedback" className="hover:text-sky-400 transition-colors">User Feedback</Link>
              <Link href="/login" className="hover:text-sky-400 transition-colors">Submit Ticket</Link>
            </div>
          </div>

          {/* Legal & Info */}
          <div className="space-y-2">
            <h6 className="font-display text-xs font-bold text-white tracking-wider uppercase">Legal & Info</h6>
            <div className="flex flex-col gap-1.5 text-xs text-slate-400">
              <button
                onClick={() => setActiveModal("privacy")}
                className="text-left hover:text-sky-400 transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setActiveModal("terms")}
                className="text-left hover:text-sky-400 transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="max-w-container-max mx-auto pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="font-mono text-[11px] text-slate-500">
            © 2026 JAIN International Residential School. All rights reserved.
          </p>
        </div>
      </footer>

      {/* POPUP MODALS FOR PRIVACY & TERMS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-white space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Icon name={activeModal === "privacy" ? "shield" : "gavel"} className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-white">
                    {activeModal === "privacy" ? "Privacy Policy" : "Terms of Service"}
                  </h3>
                  <p className="text-xs font-mono text-sky-400">JMMS Security & Legal Governance</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              >
                <Icon name="close" className="text-lg" />
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              {activeModal === "privacy" ? (
                <>
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-start gap-3">
                    <Icon name="verified_user" className="text-lg shrink-0 mt-0.5 text-emerald-400" />
                    <div>
                      <strong>Secure School Infrastructure:</strong> All user data, student ticket logs, and maintenance media are strictly stored in the secure JIRS school database with enterprise-grade encryption.
                    </div>
                  </div>
                  <p>
                    <strong>1. Data Collection & Purpose:</strong> JMMS collects minimal personal information (such as name, room number, and campus credentials) strictly necessary to verify and dispatch maintenance services.
                  </p>
                  <p>
                    <strong>2. Student & Parent Privacy:</strong> We prioritize absolute privacy for all residential students and parents. Information logged in tickets is visible only to authorized campus admins and assigned facility staff.
                  </p>
                  <p>
                    <strong>3. Data Security & Storage:</strong> Data is encrypted both in transit (TLS 1.3) and at rest within the school&apos;s isolated cloud database infrastructure. No third-party data monetization or external access is ever permitted.
                  </p>
                  <p>
                    <strong>4. Retention Policy:</strong> Maintenance logs are retained for audit and facility lifecycle tracking, automatically anonymized upon student graduation.
                  </p>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-medium flex items-start gap-3">
                    <Icon name="info" className="text-lg shrink-0 mt-0.5 text-sky-400" />
                    <div>
                      <strong>Fair Usage Governance:</strong> JMMS is an official service platform maintained exclusively for the JIRS campus community.
                    </div>
                  </div>
                  <p>
                    <strong>1. Campus Code of Conduct:</strong> Users must submit authentic, respectful, and accurate maintenance requests. Abuse of the priority dispatch engine or submitting false reports is strictly prohibited under school policies.
                  </p>
                  <p>
                    <strong>2. Service Level Agreement (SLA):</strong> While our facility teams strive to resolve requests within the 3-day SLA target, resolution times may vary depending on spare parts availability or emergency campus operations.
                  </p>
                  <p>
                    <strong>3. Technician Access & Safety:</strong> Submitting a maintenance ticket authorizes authorized campus maintenance personnel to enter designated campus facilities during scheduled operational hours to perform repairs.
                  </p>
                  <p>
                    <strong>4. System Modifications:</strong> JIRS administration reserves the right to update features, access roles, or system policies to maintain optimal campus service quality.
                  </p>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
              >
                I Understand
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

