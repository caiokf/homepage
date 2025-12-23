import type {
  TechRadarDataProvider,
  RadarVersion,
} from "./data-provider";
import type { TechRadarData, TechRadarBlipData } from "./types";
import type { BlipStatus } from "../models/blip";

export type CsvProviderConfig = {
  url: string;
};

type CsvRow = {
  name: string;
  ring: string;
  quadrant: string;
  isNew: string;
  status: string;
  description: string;
};

export class DataProviderCsv implements TechRadarDataProvider {
  private url: string;

  constructor(config: CsvProviderConfig) {
    this.url = config.url;
  }

  async listVersions(): Promise<RadarVersion[]> {
    // CSV files don't have multiple versions/tabs
    return [{ id: "default", name: "Default" }];
  }

  async fetchVersion(_versionId: string): Promise<TechRadarData> {
    const response = await fetch(this.url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch CSV data: ${response.status} ${response.statusText}`
      );
    }

    const csvText = await response.text();
    const blips = this.parseCsv(csvText);

    return {
      title: "Tech Radar",
      blips,
    };
  }

  private parseCsv(csvText: string): TechRadarBlipData[] {
    const lines = csvText.split("\n").filter((line) => line.trim());

    if (lines.length < 2) {
      return [];
    }

    const headers = this.parseCsvLine(lines[0]).map((h) =>
      h.toLowerCase().trim()
    );

    const columnIndices: Record<keyof CsvRow, number> = {
      name: headers.indexOf("name"),
      ring: headers.indexOf("ring"),
      quadrant: headers.indexOf("quadrant"),
      isNew: headers.indexOf("isnew"),
      status: headers.indexOf("status"),
      description: headers.indexOf("description"),
    };

    return lines
      .slice(1)
      .map((line) => this.parseRow(this.parseCsvLine(line), columnIndices))
      .filter((blip): blip is TechRadarBlipData => blip !== null);
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i++;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }

  private parseRow(
    values: string[],
    indices: Record<keyof CsvRow, number>
  ): TechRadarBlipData | null {
    const getValue = (index: number): string =>
      index >= 0 && index < values.length ? values[index]?.trim() ?? "" : "";

    const name = getValue(indices.name);
    const ring = getValue(indices.ring);
    const quadrant = getValue(indices.quadrant);

    // Skip rows without required fields
    if (!name || !ring || !quadrant) {
      return null;
    }

    const isNewValue = getValue(indices.isNew).toLowerCase();
    const isNew = isNewValue === "true" || isNewValue === "yes";

    const statusValue = getValue(indices.status).toLowerCase();
    const status = this.normalizeStatus(statusValue, isNew);

    const description = getValue(indices.description);

    return {
      name,
      ring: this.normalizeRing(ring),
      quadrant, // Pass through raw quadrant name - Radar.create() handles normalization
      isNew,
      status,
      description,
    };
  }

  private normalizeStatus(status: string, isNew: boolean): BlipStatus {
    if (isNew) return "new";

    const normalized = status.toLowerCase().replace(/[_-]/g, " ").trim();

    switch (normalized) {
      case "moved in":
        return "moved in";
      case "moved out":
        return "moved out";
      case "no change":
      default:
        return "no change";
    }
  }

  private normalizeRing(ring: string): string {
    return ring
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}
