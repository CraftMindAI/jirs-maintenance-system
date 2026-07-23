"use client";

import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/Icon";

function formatDateDisplay(dateStr: string) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  if (!year || !month || !day) return dateStr;
  return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;
}

export default function DatePicker({
  id,
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
}: {
  id?: string;
  value: string; // ISO format "YYYY-MM-DD"
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Parsed current date or fallback
  const parsedDate = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(parsedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsedDate.getMonth()); // 0-indexed

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Days in current month
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const mStr = String(viewMonth + 1).padStart(2, "0");
    const dStr = String(day).padStart(2, "0");
    const selectedIso = `${viewYear}-${mStr}-${dStr}`;
    onChange(selectedIso);
    setOpen(false);
  };

  const borderClass = open ? "border-[#8083ff]" : "hover:border-[#8083ff]/50";
  const buttonStateClass = disabled ? "opacity-50 cursor-not-allowed" : `cursor-pointer ${borderClass}`;

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs bg-[#131b2e] border border-[#464554]/20 font-bold outline-none transition-colors ${buttonStateClass} ${value ? "text-[#dae2fd]" : "text-[#908fa0]"}`}
      >
        <span className="font-mono text-xs">{value ? formatDateDisplay(value) : placeholder}</span>
        <Icon
          name="calendar_month"
          className={`text-base ${disabled ? "text-[#908fa0]" : "text-[#8083ff]"}`}
        />
      </button>

      {open && !disabled && (
        <div className="absolute z-30 mt-2 w-72 bg-[#171f33] border border-[#464554]/20 rounded-2xl shadow-2xl p-4 space-y-3 animate-fade-in">
          {/* Header Month/Year Selector */}
          <div className="flex items-center justify-between pb-2 border-b border-[#464554]/20">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 text-[#908fa0] hover:text-[#dae2fd] hover:bg-[#131b2e] rounded-lg transition-colors cursor-pointer"
            >
              <Icon name="chevron_left" className="text-lg" />
            </button>

            <span className="text-xs font-bold text-[#dae2fd]">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 text-[#908fa0] hover:text-[#dae2fd] hover:bg-[#131b2e] rounded-lg transition-colors cursor-pointer"
            >
              <Icon name="chevron_right" className="text-lg" />
            </button>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-[#908fa0] font-bold">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
            {/* Empty slots before day 1 */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Day Numbers */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const mStr = String(viewMonth + 1).padStart(2, "0");
              const dStr = String(day).padStart(2, "0");
              const dateIso = `${viewYear}-${mStr}-${dStr}`;
              const isSelected = value === dateIso;
              const isToday = new Date().toISOString().split("T")[0] === dateIso;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs transition-all cursor-pointer mx-auto ${
                    isSelected
                      ? "bg-[#8083ff] text-white font-extrabold shadow-md shadow-[#8083ff]/30"
                      : isToday
                      ? "border border-[#00a572] text-[#4edea3] font-bold"
                      : "text-[#dae2fd] hover:bg-[#131b2e]"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
