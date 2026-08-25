"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { GithubActivityData, GithubContributionDay } from "@/lib/github";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function getIntensity(day: GithubContributionDay, maxContributions: number) {
  if (day.contributionCount === 0) {
    return 0;
  }

  if (maxContributions <= 1) {
    return 1;
  }

  const ratio = day.contributionCount / maxContributions;

  if (ratio > 0.72) {
    return 4;
  }

  if (ratio > 0.42) {
    return 3;
  }

  if (ratio > 0.18) {
    return 2;
  }

  return 1;
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(dateKey: string, amount: number) {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return toDateKey(date);
}

function calculateMetrics(
  days: GithubContributionDay[],
  weeks: GithubActivityData["contributionCalendar"]["weeks"],
) {
  const sortedDays = [...days].sort((left, right) => left.date.localeCompare(right.date));
  const contributionByDate = new Map(
    sortedDays.map((day) => [day.date, day.contributionCount]),
  );
  const totalContributions = sortedDays.reduce(
    (total, day) => total + day.contributionCount,
    0,
  );
  const activeDays = sortedDays.filter((day) => day.contributionCount > 0).length;
  const activeWeeks = weeks.filter((week) =>
    week.contributionDays.some((day) => day.contributionCount > 0),
  ).length;

  let currentStreak = 0;
  let currentDate = toDateKey(new Date());

  while ((contributionByDate.get(currentDate) ?? 0) > 0) {
    currentStreak += 1;
    currentDate = addDays(currentDate, -1);
  }

  let longestStreak = 0;
  let runningStreak = 0;
  let previousDate: string | null = null;

  sortedDays.forEach((day) => {
    const expectedDate = previousDate ? addDays(previousDate, 1) : null;

    if (day.contributionCount > 0) {
      runningStreak = previousDate && day.date !== expectedDate ? 1 : runningStreak + 1;
      longestStreak = Math.max(longestStreak, runningStreak);
    } else {
      runningStreak = 0;
    }

    previousDate = day.date;
  });

  return [
    { label: "Total Contributions", value: totalContributions },
    { label: "Active Days", value: activeDays },
    { label: "Current Streak", value: currentStreak },
    { label: "Longest Streak", value: longestStreak },
    { label: "Active Weeks", value: activeWeeks },
  ];
}

function Stat({
  label,
  value,
  index,
}: {
  label: string;
  value: number;
  index: number;
}) {
  return (
    <motion.div
      className="github-stat"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.38 }}
    >
      <span>{value.toLocaleString("id-ID")}</span>
      <p>{label}</p>
    </motion.div>
  );
}

function ContributionCell({
  day,
  maxContributions,
  index,
  reduceMotion,
}: {
  day: GithubContributionDay;
  maxContributions: number;
  index: number;
  reduceMotion: boolean;
}) {
  const cellRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({
    placement: "above" as "above" | "below",
    x: 0,
    y: 0,
  });
  const intensity = getIntensity(day, maxContributions);
  const contributionText =
    day.contributionCount === 0
      ? "Tidak ada kontribusi"
      : `${day.contributionCount} kontribusi`;

  const updateTooltipPosition = useCallback(() => {
    const cell = cellRef.current;

    if (!cell) {
      return;
    }

    const cellBounds = cell.getBoundingClientRect();
    const tooltipBounds = tooltipRef.current?.getBoundingClientRect();
    const tooltipWidth = tooltipBounds?.width ?? 190;
    const tooltipHeight = tooltipBounds?.height ?? 54;
    const viewportInset = 10;
    const offset = 9;
    const placement =
      cellBounds.top >= tooltipHeight + offset + viewportInset ? "above" : "below";
    const centeredX = cellBounds.left + cellBounds.width / 2;
    const halfTooltip = tooltipWidth / 2;
    const x = Math.min(
      window.innerWidth - halfTooltip - viewportInset,
      Math.max(halfTooltip + viewportInset, centeredX),
    );

    setTooltipPosition({
      placement,
      x,
      y: placement === "above" ? cellBounds.top - offset : cellBounds.bottom + offset,
    });
  }, []);

  useLayoutEffect(() => {
    if (!tooltipVisible) {
      return;
    }

    updateTooltipPosition();
    window.addEventListener("resize", updateTooltipPosition);
    window.addEventListener("scroll", updateTooltipPosition, true);

    return () => {
      window.removeEventListener("resize", updateTooltipPosition);
      window.removeEventListener("scroll", updateTooltipPosition, true);
    };
  }, [tooltipVisible, updateTooltipPosition]);

  const showTooltip = () => {
    updateTooltipPosition();
    setTooltipVisible(true);
  };

  return (
    <>
      <motion.span
        ref={cellRef}
        className="github-activity__cell"
        data-intensity={intensity}
        role="gridcell"
        tabIndex={0}
        aria-label={`${contributionText} pada ${formatDate(day.date)}`}
        aria-describedby={tooltipVisible ? tooltipId : undefined}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.72 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ delay: Math.min(index * 0.003, 0.7), duration: 0.24 }}
        onMouseEnter={showTooltip}
        onMouseLeave={() => setTooltipVisible(false)}
        onFocus={showTooltip}
        onBlur={() => setTooltipVisible(false)}
      />

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {tooltipVisible ? (
                <span
                  className="github-activity__tooltip-positioner"
                  data-placement={tooltipPosition.placement}
                  style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
                >
                  <motion.span
                    ref={tooltipRef}
                    id={tooltipId}
                    role="tooltip"
                    className="github-activity__tooltip"
                    initial={{
                      opacity: 0,
                      y: tooltipPosition.placement === "above" ? 5 : -5,
                    }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      y: tooltipPosition.placement === "above" ? 5 : -5,
                    }}
                    transition={{ duration: reduceMotion ? 0 : 0.15, ease: "easeOut" }}
                  >
                    <strong>{contributionText}</strong>
                    <small>{formatDate(day.date)}</small>
                  </motion.span>
                </span>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}

export default function GithubActivity({
  data,
}: {
  data: GithubActivityData | null;
}) {
  const reduceMotion = useReducedMotion();
  const weeks = data?.contributionCalendar.weeks ?? [];
  const days = weeks.flatMap((week) =>
    [...week.contributionDays].sort((left, right) => left.weekday - right.weekday),
  );
  const maxContributions = Math.max(...days.map((day) => day.contributionCount), 1);
  const metrics = data ? calculateMetrics(days, weeks) : [];

  return (
    <section id="github-activity" className="home-section home-section--github relative px-5 py-20 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <motion.div
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-7xl"
      >
        <div className="max-w-3xl">
          <p className="font-display text-sm uppercase tracking-[0.32em] text-secondary">
            GitHub Activity
          </p>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight text-primary sm:text-6xl">
            Ringkasan aktivitas pengembangan saya di GitHub.
          </h2>
        </div>

        <div className="github-activity-panel mt-10">
          {data ? (
            <>
              <div className="github-activity-panel__header">
                <motion.div
                  className="github-profile-identity"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45 }}
                >
                  <img
                    src={data.user.avatarUrl}
                    alt={`${data.user.login} GitHub avatar`}
                    className="h-[4.6rem] w-[4.6rem] rounded-[1.25rem] border border-white/12 bg-white/[0.04]"
                  />
                  <div className="min-w-0">
                    <a
                      href={data.user.url}
                      className="group inline-flex items-center gap-2 font-display text-2xl font-semibold text-primary"
                    >
                      @{data.user.login}
                      <ArrowUpRight
                        size={18}
                        className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </a>
                    <p className="mt-1 text-sm text-secondary">
                      Aktivitas pengembangan dari waktu ke waktu.
                    </p>
                  </div>
                </motion.div>

                <div className="github-activity-panel__stats">
                  {metrics.map((metric, index) => (
                    <Stat
                      key={metric.label}
                      label={metric.label}
                      value={metric.value}
                      index={index}
                    />
                  ))}
                </div>
              </div>

              <div className="github-activity__calendar-wrap">
                <div
                  className="github-activity__calendar"
                  role="grid"
                  aria-label="GitHub contribution heatmap"
                >
                  {days.map((day, index) => (
                    <ContributionCell
                      key={day.date}
                      day={day}
                      maxContributions={maxContributions}
                      index={index}
                      reduceMotion={Boolean(reduceMotion)}
                    />
                  ))}
                </div>
              </div>

              <div className="github-activity__footer">
                <div className="github-activity__legend" aria-label="Contribution intensity legend">
                  <span>Less</span>
                  {[0, 1, 2, 3, 4].map((intensity) => (
                    <i key={intensity} data-intensity={intensity} />
                  ))}
                  <span>More</span>
                </div>
                <p>Data aktivitas diperbarui secara berkala dari GitHub.</p>
              </div>
            </>
          ) : (
            <div className="github-activity-unavailable">
              <Github size={28} />
              <h3>GitHub Activity sedang tidak tersedia.</h3>
              <p>
                Kalender kontribusi asli akan ditampilkan kembali saat koneksi
                data tersedia.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
