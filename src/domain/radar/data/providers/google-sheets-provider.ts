import type {
  TechRadarDataProvider,
  RadarVersion,
} from "../tech-radar-data-provider";
import type { TechRadarData, TechRadarBlipData } from "../tech-radar-data";
import type { BlipStatus } from "../../models/blip";

export type GoogleSheetsConfig = {
  sheetId: string;
  apiKey: string;
};

type SheetMetadata = {
  properties: {
    title: string;
  };
  sheets: Array<{
    properties: {
      sheetId: number;
      title: string;
    };
  }>;
};

type SheetValuesResponse = {
  values: string[][];
};

type SheetRow = {
  name: string;
  ring: string;
  quadrant: string;
  isNew: string;
  status: string;
  description: string;
};

const GOOGLE_SHEETS_API_BASE = "https://sheets.googleapis.com/v4/spreadsheets";

export class GoogleSheetsProvider implements TechRadarDataProvider {
  private metadata: SheetMetadata | null = null;
  private sheetId: string;
  private apiKey: string;

  constructor(config: GoogleSheetsConfig) {
    this.sheetId = config.sheetId;
    this.apiKey = config.apiKey;
  }

  async listVersions(): Promise<RadarVersion[]> {
    await this.ensureMetadata();

    if (!this.metadata) {
      return [];
    }

    return this.metadata.sheets.map((sheet) => ({
      id: sheet.properties.title,
      name: sheet.properties.title,
    }));
  }

  async fetchVersion(versionId: string): Promise<TechRadarData> {
    await this.ensureMetadata();

    const sheetName = versionId;
    const range = `${sheetName}!A1:F`;

    const url = `${GOOGLE_SHEETS_API_BASE}/${this.sheetId}/values/${encodeURIComponent(range)}?key=${this.apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch sheet data: ${response.status} ${response.statusText}`
      );
    }

    const data: SheetValuesResponse = await response.json();
    const blips = this.parseSheetData(data.values);

    return {
      title: this.metadata?.properties.title ?? "Tech Radar",
      blips,
    };
  }

  private async ensureMetadata(): Promise<void> {
    if (this.metadata) return;

    const url = `${GOOGLE_SHEETS_API_BASE}/${this.sheetId}?key=${this.apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch sheet metadata: ${response.status} ${response.statusText}`
      );
    }

    this.metadata = await response.json();
  }

  private parseSheetData(values: string[][]): TechRadarBlipData[] {
    if (!values || values.length < 2) {
      return [];
    }

    const [headerRow, ...dataRows] = values;
    const headers = headerRow.map((h) => h.toLowerCase().trim());

    const columnIndices = {
      name: headers.indexOf("name"),
      ring: headers.indexOf("ring"),
      quadrant: headers.indexOf("quadrant"),
      isNew: headers.indexOf("isnew"),
      status: headers.indexOf("status"),
      description: headers.indexOf("description"),
    };

    return dataRows
      .map((row) => this.parseRow(row, columnIndices))
      .filter((blip): blip is TechRadarBlipData => blip !== null);
  }

  private parseRow(
    row: string[],
    indices: Record<keyof SheetRow, number>
  ): TechRadarBlipData | null {
    const getValue = (index: number): string =>
      index >= 0 && index < row.length ? row[index]?.trim() ?? "" : "";

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
    // Capitalize first letter of each word
    return ring
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}
