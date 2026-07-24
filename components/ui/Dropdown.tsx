"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";

export interface DropdownOption {
  value: string;
  label: string;
}

export default function Dropdown({
  id,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  scroll = true,
}: {
  id?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  scroll?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-xs bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-[#464554]/20 font-bold outline-none transition-colors cursor-pointer ${
          open ? "border-primary dark:border-[#8083ff]" : "hover:border-primary/50 dark:hover:border-[#8083ff]/50"
        } ${selected ? "text-slate-800 dark:text-[#dae2fd]" : "text-slate-400 dark:text-[#908fa0]"}`}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <Icon
          name="expand_more"
          className={`text-base text-slate-400 dark:text-[#908fa0] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/20 rounded-xl shadow-lg overflow-hidden">
          <ul className={`p-1.5 ${scroll ? "max-h-60 overflow-y-auto" : ""}`}>
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    option.value === value
                      ? "bg-primary/10 dark:bg-[#8083ff]/10 text-primary dark:text-[#8083ff]"
                      : "text-slate-700 dark:text-[#dae2fd] hover:bg-slate-100 dark:hover:bg-[#131b2e]"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
