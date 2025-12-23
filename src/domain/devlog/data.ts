import fm from "front-matter";
import { marked } from "marked";

export type EntryFrontmatter = {
  title: string;
  date: string;
  tags: string[];
  slug: string;
};

export type Entry = {
  frontmatter: EntryFrontmatter;
  content: string;
  html: string;
  weekKey: string;
};

export type WeekGroup = {
  key: string;
  label: string;
  startDate: Date;
  endDate: Date;
  entries: Entry[];
};

type EntryModule = {
  default: string;
};

// Import all markdown files at build time
const entryModules = import.meta.glob<EntryModule>("./content/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

/**
 * Get ISO week number and year for a given date
 * Returns "YYYY-WW" format
 */
export function getWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-${String(weekNo).padStart(2, "0")}`;
}

/**
 * Get the start and end dates for a week key
 */
export function getWeekDates(weekKey: string): { start: Date; end: Date } {
  const [yearStr, weekStr] = weekKey.split("-");
  const year = parseInt(yearStr);
  const week = parseInt(weekStr);

  // Find first Thursday of the year (ISO week date system)
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = jan4.getDay() || 7;
  const firstThursday = new Date(jan4);
  firstThursday.setDate(jan4.getDate() - dayOfWeek + 4);

  // Calculate the Monday of the requested week
  const monday = new Date(firstThursday);
  monday.setDate(firstThursday.getDate() - 3 + (week - 1) * 7);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return { start: monday, end: sunday };
}

/**
 * Format a week's date range for display
 */
export function formatWeekLabel(weekKey: string): string {
  const { start, end } = getWeekDates(weekKey);
  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  const startMonth = months[start.getMonth()];
  const endMonth = months[end.getMonth()];
  const year = start.getFullYear();

  if (startMonth === endMonth) {
    return `week of ${startMonth} ${start.getDate()}, ${year}`;
  }
  return `week of ${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${year}`;
}

export function getAllEntries(): Entry[] {
  const entries: Entry[] = [];

  for (const path in entryModules) {
    const raw = entryModules[path] as unknown as string;
    const parsed = fm<EntryFrontmatter>(raw);
    const entryDate = new Date(parsed.attributes.date);

    entries.push({
      frontmatter: parsed.attributes,
      content: parsed.body,
      html: marked(parsed.body) as string,
      weekKey: getWeekKey(entryDate),
    });
  }

  // Sort by date, newest first
  return entries.sort((a, b) => {
    return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
  });
}

export function getEntryBySlug(slug: string): Entry | undefined {
  const entries = getAllEntries();
  return entries.find((entry) => entry.frontmatter.slug === slug);
}

/**
 * Get entry counts per week for the contribution matrix
 */
export function getEntryCounts(): Map<string, number> {
  const entries = getAllEntries();
  const counts = new Map<string, number>();

  entries.forEach((entry) => {
    const current = counts.get(entry.weekKey) || 0;
    counts.set(entry.weekKey, current + 1);
  });

  return counts;
}

/**
 * Group entries by week
 */
export function getEntriesGroupedByWeek(entries: Entry[]): WeekGroup[] {
  const groups = new Map<string, Entry[]>();

  entries.forEach((entry) => {
    const existing = groups.get(entry.weekKey) || [];
    existing.push(entry);
    groups.set(entry.weekKey, existing);
  });

  // Convert to array and sort by week (newest first)
  return Array.from(groups.entries())
    .map(([key, weekEntries]) => {
      const { start, end } = getWeekDates(key);
      return {
        key,
        label: formatWeekLabel(key),
        startDate: start,
        endDate: end,
        entries: weekEntries,
      };
    })
    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
}

/**
 * Filter entries by week key
 */
export function getEntriesForWeek(weekKey: string): Entry[] {
  return getAllEntries().filter((entry) => entry.weekKey === weekKey);
}
