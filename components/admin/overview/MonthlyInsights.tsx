"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/ui/Icon";

type ViewLevel = "month" | "week" | "day";

type DayItem = {
  label: string;
  fullLabel: string;
  count: number;
  isToday: boolean;
};

type WeekItem = {
  label: string;
  totalCount: number;
  days: DayItem[];
};

type MonthItem = {
  label: string;
  monthName: string;
  totalCount: number;
  weeks: WeekItem[];
};

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Monday of the calendar week containing `d`. */
function startOfWeek(d: Date) {
  const start = new Date(d);
  const daysSinceMonday = (d.getDay() + 6) % 7;
  start.setDate(d.getDate() - daysSinceMonday);
  start.setHours(0, 0, 0, 0);
  return start;
}

/**
 * Builds real month → week → day complaint counts for the last 5 months from
 * actual complaint dates — no fabricated/random distribution.
 */
function buildDataset(complaintDates: string[]): MonthItem[] {
  const dates = complaintDates
    .filter(Boolean)
    .map((d) => new Date(`${d}T00:00:00`));

  const now = new Date();
  const months: MonthItem[] = [];

  for (let i = 4; i >= 0; i--) {
    const monthAnchor = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(monthAnchor.getFullYear(), monthAnchor.getMonth(), 1);
    const monthEnd = new Date(monthAnchor.getFullYear(), monthAnchor.getMonth() + 1, 0);
    const monthLabel = monthAnchor.toLocaleString("default", { month: "short" }).toUpperCase();

    const monthTotal = dates.filter((d) => d >= monthStart && d <= monthEnd).length;

    const weeks: WeekItem[] = [];
    const cursor = startOfWeek(monthStart);
    let weekIdx = 0;
    while (cursor <= monthEnd) {
      const weekStart = new Date(cursor);

      const days: DayItem[] = DAY_NAMES.map((dayName, dIdx) => {
        const dayDate = new Date(weekStart);
        dayDate.setDate(weekStart.getDate() + dIdx);
        const inMonth = dayDate >= monthStart && dayDate <= monthEnd;
        const count = inMonth ? dates.filter((d) => isSameDay(d, dayDate)).length : 0;

        return {
          label: dayName,
          fullLabel: `${dayName}, ${dayDate.toLocaleDateString("default", { month: "short", day: "numeric" })}`,
          count,
          isToday: isSameDay(dayDate, now),
        };
      });

      weeks.push({
        label: `Week ${weekIdx + 1}`,
        totalCount: days.reduce((sum, d) => sum + d.count, 0),
        days,
      });

      cursor.setDate(cursor.getDate() + 7);
      weekIdx += 1;
    }

    months.push({ label: monthLabel, monthName: monthLabel, totalCount: monthTotal, weeks });
  }

  return months;
}

export default function MonthlyInsights({ complaintDates }: Readonly<{ complaintDates: string[] }>) {
  const [level, setLevel] = useState<ViewLevel>("month");
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(null);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const dataset = useMemo(() => buildDataset(complaintDates), [complaintDates]);

  const handleBarClick = (index: number) => {
    if (level === "month") {
      setSelectedMonthIndex(index);
      setLevel("week");
      setHoveredIndex(null);
    } else if (level === "week") {
      setSelectedWeekIndex(index);
      setLevel("day");
      setHoveredIndex(null);
    }
  };

  const handleBack = () => {
    if (level === "day") {
      setSelectedWeekIndex(null);
      setLevel("week");
      setHoveredIndex(null);
    } else if (level === "week") {
      setSelectedMonthIndex(null);
      setLevel("month");
      setHoveredIndex(null);
    }
  };

  const activeItems = useMemo(() => {
    if (level === "month") {
      return dataset.map((m) => ({
        label: m.label,
        subLabel: `${m.totalCount} complaints`,
        count: m.totalCount,
        clickable: true,
        isToday: false,
      }));
    }

    if (level === "week" && selectedMonthIndex !== null) {
      const monthObj = dataset[selectedMonthIndex] || dataset[0];
      return monthObj.weeks.map((w) => ({
        label: w.label,
        subLabel: `${w.totalCount} complaints`,
        count: w.totalCount,
        clickable: true,
        isToday: false,
      }));
    }

    if (level === "day" && selectedMonthIndex !== null && selectedWeekIndex !== null) {
      const monthObj = dataset[selectedMonthIndex] || dataset[0];
      const weekObj = monthObj.weeks[selectedWeekIndex] || monthObj.weeks[0];
      return weekObj.days.map((d) => ({
        label: d.label,
        subLabel: d.fullLabel,
        count: d.count,
        clickable: false,
        isToday: d.isToday,
      }));
    }

    return [];
  }, [level, selectedMonthIndex, selectedWeekIndex, dataset]);

  const maxCount = useMemo(() => {
    return Math.max(...activeItems.map((item) => item.count), 1);
  }, [activeItems]);

  const breadcrumbText = useMemo(() => {
    if (level === "month") return "Monthly Overview";
    const monthName = dataset[selectedMonthIndex ?? 0]?.monthName || "";
    if (level === "week") return `${monthName} • Weekly Breakdown`;
    const weekName = dataset[selectedMonthIndex ?? 0]?.weeks[selectedWeekIndex ?? 0]?.label || "";
    return `${monthName} • ${weekName} • Daily Linear Graph`;
  }, [level, selectedMonthIndex, selectedWeekIndex, dataset]);

  const linePoints = useMemo(() => {
    if (level !== "day" || activeItems.length === 0) return { path: "", area: "", points: [] };

    const svgWidth = 500;
    const svgHeight = 160;
    const paddingX = 30;
    const paddingY = 20;

    const usableWidth = svgWidth - paddingX * 2;
    const usableHeight = svgHeight - paddingY * 2;

    const points = activeItems.map((item, idx) => {
      const x = paddingX + (idx / (activeItems.length - 1)) * usableWidth;
      const ratio = item.count / maxCount;
      const y = svgHeight - paddingY - ratio * usableHeight;
      return { x, y, ...item, idx };
    });

    const path = points.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      const prev = points[i - 1];
      const cpX1 = prev.x + (pt.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (pt.x - prev.x) / 2;
      const cpY2 = pt.y;
      return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pt.x} ${pt.y}`;
    }, "");

    const area = `${path} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`;

    return { path, area, points };
  }, [level, activeItems, maxCount]);

  return (
    <div className="lg:col-span-2 bg-white dark:bg-[#171f33] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-[#464554]/10 flex flex-col min-h-[460px] shadow-md dark:vibrant-shadow relative overflow-hidden">
      {/* Header with Title & Breadcrumbs */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary dark:text-[#8083ff] bg-primary/10 dark:bg-[#8083ff]/10 px-2.5 py-0.5 rounded-full border border-primary/20 dark:border-[#8083ff]/20">
              {level === "day" ? "Linear Graph View" : "Bar Chart View"}
            </span>
            <span className="text-xs text-slate-500 dark:text-[#908fa0] font-mono">• {breadcrumbText}</span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#dae2fd] mt-1.5 flex items-center gap-2">
            Monthly Insights
          </h3>
        </div>

        {/* Action Controls: Back Button & Mode Indicator */}
        <div className="flex items-center gap-3">
          {level !== "month" && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleBack}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-primary/30 dark:border-[#8083ff]/30 bg-slate-100 dark:bg-[#131b2e] hover:bg-primary/10 dark:hover:bg-[#8083ff]/20 text-xs font-bold text-primary dark:text-[#c0c1ff] transition-all cursor-pointer shadow-md group"
            >
              <Icon
                name="arrow_back"
                className="text-sm group-hover:-translate-x-0.5 transition-transform"
              />
              <span>Back</span>
            </motion.button>
          )}

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#131b2e] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#464554]/20 text-[11px] text-slate-600 dark:text-[#908fa0] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#00a572] animate-pulse" />
            <span className="capitalize">{level} View</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="flex-1 relative bg-slate-50/80 dark:bg-[#131b2e]/60 rounded-2xl p-6 flex flex-col justify-between overflow-hidden border border-slate-200 dark:border-[#464554]/10 min-h-[310px]">
        {/* Horizontal Background Grid Lines */}
        <div className="absolute inset-0 px-6 py-8 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="border-b border-slate-300 dark:border-[#464554]/40 w-full" />
          <div className="border-b border-slate-300 dark:border-[#464554]/40 w-full" />
          <div className="border-b border-slate-300 dark:border-[#464554]/40 w-full" />
          <div className="border-b border-slate-300 dark:border-[#464554]/40 w-full" />
        </div>

        {/* Hint Text */}
        <div className="z-10 flex justify-end items-center text-[11px] text-slate-500 dark:text-[#908fa0] font-medium mb-2">
          <span className="font-mono text-primary dark:text-[#c0c1ff]">
            Total Volume: <strong className="text-slate-900 dark:text-white font-bold">{activeItems.reduce((s, i) => s + i.count, 0)}</strong>
          </span>
        </div>

        {/* Smooth AnimatePresence Transition between levels */}
        <AnimatePresence mode="wait">
          <motion.div
            key={level + (selectedMonthIndex ?? "") + (selectedWeekIndex ?? "")}
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col justify-between"
          >
            {level === "day" ? (
              /* Linear Graph for DAY view */
              <div className="flex-1 flex flex-col justify-between pt-4 relative z-10">
                <div className="relative flex-1 w-full flex items-center justify-center">
                  <svg
                    viewBox="0 0 500 160"
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0f4c81" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#0f4c81" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#0f4c81" />
                        <stop offset="50%" stopColor="#00a572" />
                        <stop offset="100%" stopColor="#0f4c81" />
                      </linearGradient>
                    </defs>

                    {/* Gradient Area Fill */}
                    <motion.path
                      d={linePoints.area}
                      fill="url(#lineGrad)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6 }}
                    />

                    {/* Animated Line Draw Path */}
                    <motion.path
                      d={linePoints.path}
                      fill="none"
                      stroke="url(#strokeGrad)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.75, ease: "easeInOut" }}
                    />

                    {/* Interactive Data Dots with entrance pop */}
                    {linePoints.points.map((pt, idx) => {
                      const isHovered = hoveredIndex === pt.idx;
                      const isToday = "isToday" in pt && pt.isToday;
                      return (
                        <g
                          key={pt.idx}
                          onMouseEnter={() => setHoveredIndex(pt.idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          className="cursor-pointer"
                        >
                          {isToday && (
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="12"
                              fill="none"
                              stroke="#00a572"
                              strokeWidth="1.5"
                              className="animate-ping opacity-60"
                            />
                          )}
                          <motion.circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isHovered || isToday ? "7" : "5"}
                            fill={isToday ? "#00a572" : isHovered ? "#00a572" : "#0f4c81"}
                            stroke="#ffffff"
                            strokeWidth="2.5"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 + idx * 0.05 }}
                          />
                          {isHovered && !isToday && (
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="12"
                              fill="none"
                              stroke="#00a572"
                              strokeWidth="1.5"
                              className="animate-ping opacity-75"
                            />
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* Tooltip Popup */}
                  {hoveredIndex !== null && linePoints.points[hoveredIndex] && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute bg-slate-900 dark:bg-[#1e293b] border border-slate-700 dark:border-[#8083ff]/40 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-xl whitespace-nowrap z-30 pointer-events-none -translate-x-1/2 -translate-y-12"
                      style={{
                        left: `${(linePoints.points[hoveredIndex].x / 500) * 100}%`,
                        top: `${(linePoints.points[hoveredIndex].y / 160) * 100}%`,
                      }}
                    >
                      <span className="text-slate-300 dark:text-[#c0c1ff] block text-center">
                        {("isToday" in linePoints.points[hoveredIndex] && linePoints.points[hoveredIndex].isToday)
                          ? "Today"
                          : linePoints.points[hoveredIndex].label}
                      </span>
                      <span className="text-white font-extrabold block text-center">
                        {linePoints.points[hoveredIndex].count} Complaints
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* X-Axis Day Labels */}
                <div className="flex justify-between items-center px-4 pt-2 border-t border-slate-200 dark:border-[#464554]/10">
                  {activeItems.map((item, idx) => (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className={`text-center cursor-pointer transition-colors ${
                        "isToday" in item && item.isToday
                          ? "text-[#00a572] font-extrabold"
                          : hoveredIndex === idx
                            ? "text-[#00a572] font-extrabold"
                            : "text-slate-500 dark:text-[#908fa0]"
                      }`}
                    >
                      {"isToday" in item && item.isToday ? (
                        <span className="text-[9px] font-mono font-bold uppercase block px-1.5 py-0.5 rounded-full bg-[#00a572]/15 text-[#00a572] border border-[#00a572]/30 mb-0.5">
                          Today
                        </span>
                      ) : (
                        <span className="text-[10px] sm:text-xs font-mono font-bold uppercase block">
                          {item.label}
                        </span>
                      )}
                      <span className="text-[9px] font-mono text-primary dark:text-[#c0c1ff] block">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Bar Chart View for MONTH and WEEK levels */
              <div className="flex-1 flex items-end justify-around gap-2 sm:gap-4 pt-8 pb-4 relative z-10">
                {activeItems.map((item, colIdx) => {
                  const heightPercent = Math.max(12, Math.round((item.count / maxCount) * 100));
                  const isHovered = hoveredIndex === colIdx;

                  return (
                    <motion.div
                      key={colIdx}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => item.clickable && handleBarClick(colIdx)}
                      onMouseEnter={() => setHoveredIndex(colIdx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className={`flex-1 flex flex-col items-center h-full justify-end group relative ${
                        item.clickable ? "cursor-pointer" : "cursor-default"
                      }`}
                    >
                      {/* Tooltip Overlay */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.9 }}
                            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-[#1e293b] border border-slate-700 dark:border-[#8083ff]/40 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-xl whitespace-nowrap z-30 flex flex-col items-center gap-0.5"
                          >
                            <span className="text-slate-300 dark:text-[#c0c1ff]">{item.label}</span>
                            <span className="text-white font-extrabold">{item.count} Complaints</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Value Pill Above Bar */}
                      <span className="text-[10px] font-mono font-bold text-primary dark:text-[#c0c1ff] mb-2 transition-transform group-hover:scale-110">
                        {item.count}
                      </span>

                      {/* Animated Solid Bar */}
                      <div className="w-full max-w-[52px] bg-slate-200 dark:bg-[#131b2e] rounded-t-2xl overflow-hidden h-[75%] flex items-end p-0.5 border border-slate-300 dark:border-[#464554]/20">
                        <motion.div
                          initial={{ height: "0%" }}
                          animate={{ height: `${heightPercent}%` }}
                          transition={{
                            duration: 0.5,
                            ease: [0.16, 1, 0.3, 1],
                            delay: colIdx * 0.06,
                          }}
                          className={`w-full rounded-t-xl transition-colors duration-300 ${
                            isHovered
                              ? "bg-primary dark:vibrant-gradient shadow-[0_0_20px_rgba(15,76,129,0.4)] dark:shadow-[0_0_20px_rgba(128,131,255,0.6)] brightness-110"
                              : "bg-primary/40 dark:bg-[#8083ff]/40 group-hover:bg-primary/60 dark:group-hover:bg-[#8083ff]/60"
                          }`}
                        />
                      </div>

                      {/* Column X-Axis Label */}
                      <span className="text-[10px] sm:text-xs font-mono font-bold uppercase text-slate-500 dark:text-[#908fa0] group-hover:text-slate-800 dark:group-hover:text-[#dae2fd] mt-3 transition-colors">
                        {item.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
