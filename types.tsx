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