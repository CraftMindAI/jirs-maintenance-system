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
        className="font-bold text-xs uppercase tracking-widest text-on-surface-variant dark:text-slate-300 block mb-1.5"
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
          className="w-full flex items-center justify-between rounded-xl px-4 py-3.5 font-body-md premium-input dark:text-slate-100 dark:bg-slate-900 cursor-pointer text-left"
        >
          <span className={`flex items-center gap-2 ${selectedOption ? "" : "text-outline dark:text-slate-500"}`}>
            {selectedOption && (
              <Icon name={selectedOption.icon} className="text-[20px] text-primary dark:text-blue-300" />
            )}
            {selectedOption ? selectedOption.label : "Choose your role"}
          </span>
          <Icon
            name="expand_more"
            className={`text-[20px] text-outline dark:text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-outline-variant/20 dark:border-white/10 bg-white dark:bg-slate-900 shadow-lg"
          >
            {ROLE_OPTIONS.map((option) => (
              <li key={option.value} role="option" aria-selected={option.value === selected}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(option.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-body-md cursor-pointer transition-colors ${
                    option.value === selected
                      ? "bg-primary/10 text-primary dark:text-blue-300"
                      : "text-on-surface dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon name={option.icon} className="text-[20px]" />
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
