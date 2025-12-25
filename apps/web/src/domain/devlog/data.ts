<<<<<<< ours
import fm from "front-matter";
import { marked } from "marked";
import { getWeekKey } from "@caiokf/shared";
import devlogIndex from "virtual:devlog-index";

export { getWeekKey };

export type EntryFrontmatter = {
  title: string;
  date: string;
  tags: string[];
  slug: string;
};

export type HasWeekKey = {
  weekKey: string;
};

export type EntryMetadata = EntryFrontmatter & HasWeekKey & {
  filename: string;
};

export type EntryContent = {
  content: string;
  html: string;
};

export type Entry = HasWeekKey & {
  frontmatter: EntryFrontmatter;
  content: string;
  html: string;
};

export type WeekGroup<T extends HasWeekKey = Entry> = {
  key: string;
  label: string;
  startDate: Date;
  endDate: Date;
  entries: T[];
};

// Cache for loaded entry content
const contentCache = new Map<string, EntryContent>();

/**
 * Get the base URL for fetching devlog assets
 */
function getDevlogBaseUrl(): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base}devlog`;
}

/**
 * Get the devlog index (metadata only) - bundled at build time
 */
export function fetchIndex(): Promise<EntryMetadata[]> {
  return Promise.resolve(devlogIndex);
}

/**
 * Fetch content for a single entry by filename
 */
export async function fetchEntryContent(filename: string): Promise<EntryContent> {
  const cached = contentCache.get(filename);
  if (cached) {
    return cached;
  }

  const response = await fetch(`${getDevlogBaseUrl()}/${filename}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch devlog entry: ${response.statusText}`);
  }

  const raw = await response.text();
  const parsed = fm<EntryFrontmatter>(raw);
  const html = marked(parsed.body) as string;

  const content: EntryContent = {
    content: parsed.body,
    html,
  };

  contentCache.set(filename, content);
  return content;
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

/**
 * Get entry counts per week for the contribution matrix
 */
export function getEntryCounts<T extends HasWeekKey>(entries: T[]): Map<string, number> {
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
export function getEntriesGroupedByWeek<T extends HasWeekKey>(entries: T[]): WeekGroup<T>[] {
  const groups = new Map<string, T[]>();

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
export function getEntriesForWeek<T extends HasWeekKey>(entries: T[], weekKey: string): T[] {
  return entries.filter((entry) => entry.weekKey === weekKey);
}
|||||||
=======
import fm from "front-matter";
import { marked } from "marked";
import { getWeekKey } from "@caiokf/shared";

export { getWeekKey };

export type EntryFrontmatter = {
  title: string;
  date: string;
  tags: string[];
  slug: string;
};

export type HasWeekKey = {
  weekKey: string;
};

export type EntryMetadata = EntryFrontmatter & HasWeekKey & {
  filename: string;
};

export type EntryContent = {
  content: string;
  html: string;
};

export type Entry = HasWeekKey & {
  frontmatter: EntryFrontmatter;
  content: string;
  html: string;
};

export type WeekGroup<T extends HasWeekKey = Entry> = {
  key: string;
  label: string;
  startDate: Date;
  endDate: Date;
  entries: T[];
};

// Cache for loaded entry content
const contentCache = new Map<string, EntryContent>();

// Cached index data
let indexCache: EntryMetadata[] | null = null;

/**
 * Get the base URL for fetching devlog assets
 */
function getDevlogBaseUrl(): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base}devlog`;
}

/**
 * Fetch the devlog index (metadata only)
 */
export async function fetchIndex(): Promise<EntryMetadata[]> {
  if (indexCache) {
    return indexCache;
  }

  const response = await fetch(`${getDevlogBaseUrl()}/index.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch devlog index: ${response.statusText}`);
  }

  indexCache = await response.json();
  return indexCache!;
}

/**
 * Fetch content for a single entry by filename
 */
export async function fetchEntryContent(filename: string): Promise<EntryContent> {
  const cached = contentCache.get(filename);
  if (cached) {
    return cached;
  }

  const response = await fetch(`${getDevlogBaseUrl()}/${filename}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch devlog entry: ${response.statusText}`);
  }

  const raw = await response.text();
  const parsed = fm<EntryFrontmatter>(raw);
  const html = marked(parsed.body) as string;

  const content: EntryContent = {
    content: parsed.body,
    html,
  };

  contentCache.set(filename, content);
  return content;
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

/**
 * Get entry counts per week for the contribution matrix
 */
export function getEntryCounts<T extends HasWeekKey>(entries: T[]): Map<string, number> {
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
export function getEntriesGroupedByWeek<T extends HasWeekKey>(entries: T[]): WeekGroup<T>[] {
  const groups = new Map<string, T[]>();

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
export function getEntriesForWeek<T extends HasWeekKey>(entries: T[], weekKey: string): T[] {
  return entries.filter((entry) => entry.weekKey === weekKey);
}
>>>>>>> theirs
