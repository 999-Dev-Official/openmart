// Location Types
export interface GmapLeadSearchLocParams {
  city?: string;
  state?: string;
  country?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  geo_radius?: number; // in meters
}

export type Location = GmapLeadSearchLocParams | GmapLeadSearchLocParams[];
