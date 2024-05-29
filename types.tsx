export type Position = {
  lat: number;
  lng: number;
};

export type PowerStation = {
  name: any;
  fuelType: string;
  country: string;
  region: string;
  position: Position;
};

export type PowerStationMarker = {
  colour: string;
  powerStation: PowerStation;
};

export type Marks = {
  value: number;
  label: string;
};

export type ItemLabel = {
  [key: string]: { label: string };
};
