import type { RadarDataProvider, RawRadarData, RawBlipData } from "../types";
import type { BlipStatus } from "../../models/blip";

// Google Sheets API types
declare const gapi: {
  load: (api: string, callback: () => void) => void;
  client: {
    init: (config: {
      apiKey: string;
      discoveryDocs: string[];
    }) => Promise<void>;
    sheets: {
      spreadsheets: {
        get: (params: { spreadsheetId: string }) => Promise<{
          result: {
            properties: { title: string };
            sheets: Array<{ properties: { title: string } }>;
          };
        }>;
        values: {
          get: (params: { spreadsheetId: string; range: string }) => Promise<{
            result: { values: string[][] };
          }>;
        };
      };
    };
  };
};

export interface GoogleSheetsConfig {
  apiKey: string;
  spreadsheetId: string;
  sheetName?: string;
}

const DISCOVERY_DOCS = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4",
];

const REQUIRED_HEADERS = ["name", "ring", "quadrant", "description"];

/**
 * Extract spreadsheet ID from a Google Sheets URL or return as-is if already an ID
 */
function extractSpreadsheetId(sheetReference: string): string {
  const match = sheetReference.match(
    /https:\/\/docs\.google\.com\/spreadsheets\/d\/(.*?)($|\/|&|\?)/
  );
  return match ? match[1] : sheetReference;
}

/**
 * Validate that required headers are present
 */
function validateHeaders(headers: string[]): void {
  const lowerHeaders = headers.map((h) => h.toLowerCase().trim());

  const missingRequired = REQUIRED_HEADERS.filter(
    (h) => !lowerHeaders.includes(h)
  );

  if (missingRequired.length > 0) {
    throw new Error(`Missing required headers: ${missingRequired.join(", ")}`);
  }

  const hasStatusColumn =
    lowerHeaders.includes("isnew") || lowerHeaders.includes("status");
  if (!hasStatusColumn) {
    throw new Error("Missing required header: isNew or status");
  }
}

/**
 * Convert a row array to a blip object using header indices
 */
function rowToBlip(row: string[], headers: string[]): RawBlipData {
  const lowerHeaders = headers.map((h) => h.toLowerCase().trim());

  const getValue = (field: string): string => {
    const index = lowerHeaders.indexOf(field.toLowerCase());
    return index >= 0 && row[index] ? row[index].trim() : "";
  };

  const isNewValue = getValue("isNew");
  const statusValue = getValue("status");

  // Determine isNew and status
  let isNew = false;
  let status: BlipStatus | undefined;

  if (statusValue) {
    const lowerStatus = statusValue.toLowerCase();
    if (lowerStatus === "new") {
      isNew = true;
      status = "new";
    } else if (lowerStatus === "moved in") {
      status = "moved in";
    } else if (lowerStatus === "moved out") {
      status = "moved out";
    } else {
      status = "no change";
    }
  } else if (isNewValue) {
    isNew = isNewValue.toLowerCase() === "true";
    status = isNew ? "new" : "no change";
  }

  return {
    name: getValue("name"),
    ring: getValue("ring"),
    quadrant: getValue("quadrant"),
    description: getValue("description"),
    topic: getValue("topic"),
    isNew,
    status,
  };
}

/**
 * Google Sheets data provider for fetching radar data from public Google Sheets
 */
export class GoogleSheetsProvider implements RadarDataProvider {
  private config: GoogleSheetsConfig;
  private spreadsheetId: string;
  private initialized = false;

  constructor(config: GoogleSheetsConfig) {
    this.config = config;
    this.spreadsheetId = extractSpreadsheetId(config.spreadsheetId);
  }

  /**
   * Load and initialize the Google API client
   */
  private async initializeGapi(): Promise<void> {
    if (this.initialized) return;

    // Load gapi client
    await new Promise<void>((resolve) => {
      gapi.load("client", resolve);
    });

    // Initialize with API key
    await gapi.client.init({
      apiKey: this.config.apiKey,
      discoveryDocs: DISCOVERY_DOCS,
    });

    this.initialized = true;
  }

  /**
   * Get available sheet names from the spreadsheet
   */
  private async getSheetNames(): Promise<string[]> {
    const response = await gapi.client.sheets.spreadsheets.get({
      spreadsheetId: this.spreadsheetId,
    });

    return response.result.sheets.map((s) => s.properties.title);
  }

  /**
   * Fetch data from a specific sheet range
   */
  private async fetchSheetData(sheetName: string): Promise<string[][]> {
    const range = `${sheetName}!A1:G`; // Columns A through G (name, ring, quadrant, description, isNew, status, topic)

    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range,
    });

    return response.result.values || [];
  }

  /**
   * Fetch radar data from Google Sheets
   */
  async fetchRadarData(): Promise<RawRadarData> {
    await this.initializeGapi();

    // Get available sheets
    const sheetNames = await this.getSheetNames();

    if (sheetNames.length === 0) {
      throw new Error("No sheets found in spreadsheet");
    }

    // Use configured sheet name or first sheet
    const targetSheet = this.config.sheetName || sheetNames[0];

    if (!sheetNames.includes(targetSheet)) {
      throw new Error(`Sheet "${targetSheet}" not found in spreadsheet`);
    }

    // Fetch data
    const rows = await this.fetchSheetData(targetSheet);

    if (rows.length < 2) {
      throw new Error("Sheet must have at least a header row and one data row");
    }

    // First row is headers
    const headers = rows[0];
    validateHeaders(headers);

    // Remaining rows are data
    const dataRows = rows
      .slice(1)
      .filter((row) => row.some((cell) => cell?.trim()));

    // Convert to blip objects
    const blips: RawBlipData[] = dataRows.map((row) => rowToBlip(row, headers));

    return {
      title: targetSheet,
      blips,
    };
  }
}

/**
 * Create a Google Sheets provider instance
 */
export function createGoogleSheetsProvider(
  config: GoogleSheetsConfig
): RadarDataProvider {
  return new GoogleSheetsProvider(config);
}
