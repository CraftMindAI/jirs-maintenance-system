"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";

const ROLE_OPTIONS = [
  { value: "Student", label: "Student", icon: "school" },
  { value: "Staff", label: "Staff", icon: "badge" },
];

export default function RoleSelect({
  name = "role",
  required = true,
}: {
  name?: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = ROLE_OPTIONS.find((option) => option.value === selected);

  return (
    <div className="space-y-1" ref={containerRef}>
      <label
        htmlFor={`${name}-trigger`}
        className="font-mono text-xs font-bold uppercase tracking-wider text-slate-700 block"
      >
        SELECT ROLE
      </label>

      <div className="relative">
        <input type="hidden" name={name} value={selected} required={required} />

        <button
          id={`${name}-trigger`}
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="w-full flex items-center justify-between rounded-lg px-3 py-2 font-body text-xs bg-[#f8f9ff] border border-slate-300 text-slate-900 cursor-pointer text-left focus:border-[#00355f] focus:ring-2 focus:ring-[#00355f]/20 outline-none transition-all"
        >
          <span className={`flex items-center gap-2 ${selectedOption ? "text-slate-900 font-semibold" : "text-slate-400"}`}>
            {selectedOption && (
              <Icon name={selectedOption.icon} className="text-xl text-[#00355f]" />
            )}
            {selectedOption ? selectedOption.label : "Choose your role"}
          </span>
          <Icon
            name="expand_more"
            className={`text-xl text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl"
          >
            {ROLE_OPTIONS.map((option) => (
              <li key={option.value} role="option" aria-selected={option.value === selected}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(option.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-body cursor-pointer transition-colors ${
                    option.value === selected
                      ? "bg-[#00355f]/10 text-[#00355f] font-bold"
                      : "text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <Icon name={option.icon} className="text-xl" />
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

