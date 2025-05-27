export type Position = {
  lat: number;
  lng: number;
};

export type PowerStation = {
  id: string;
  name: string;
  fuelType: FuelType;
  country: string;
  region: Region;
  position: Position;
  age: Age;
  description?: string;
  controversies?: string;
  powerOutput?: number;
  operator?: Entity;
  owner?: Entity;
  images?: {
    large: Image;
    full: Image;
  };
};

export type Region = {
  id: string;
  name: string;
};

export type Country = {
  id: string;
  name: string;
};

export type FuelType = {
  id: string;
  name: string;
  shorthand: string;
  rGBColor: string;
  icon: string;
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

export type Entity = {
  id: string;
  name: string;
  controversies?: string;
  role_id: string[];
  country_id?: string[];
  leadership?: Entity[];
  entityType?: string;
  role?: string;
  country?: Country;
  image?: { url: string }[];
  details?: string;
  established?: Date;
  description?: string;
  otherPositions?: string[];
};

export type Age = {
  commissionStart?: Date;
  commissionEnd: Date;
  decommissionStart?: Date;
  decommissionEnd?: Date;
  years: number;
};

export type EntityRole = {
  id: string;
  role: string;
  entity_id: string;
  entity?: Entity;
  personPolitician_id: string;
  personPolitician?: Entity;
};

export type Image = {
  id: string;
  url: string;
  filename: string;
  width: number;
  height: number;
  type: string;
};
