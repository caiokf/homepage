import type { TechRadarDataProvider } from "../tech-radar-data-provider";
import type { TechRadarData, TechRadarBlipData } from "../tech-radar-data";

export type GoogleSheetsConfig = {
  sheetId: string;
  apiKey?: string;
};

export class GoogleSheetsProvider implements TechRadarDataProvider {
  constructor(private config: GoogleSheetsConfig) {}

  async fetch(): Promise<TechRadarData> {
    // TODO: Implement Google Sheets API integration using this.config.sheetId
    void this.config.sheetId;
    const blips: TechRadarBlipData[] = [];

    return {
      title: "Tech Radar",
      blips,
    };
  }
}
