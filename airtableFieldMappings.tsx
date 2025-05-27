// Column (field) names in Airtable can be changed by users which would break code
// so use field IDs for retrieval and map them to names that do not change in this
// code.
// Get IDs here:
// https://airtable.com/appZdj1pFZQOBMn4E/api/docs#curl/table:power%20stations:fields

export const PowerStationFieldIdToNameMapping = {
  fldc5VoKdeCbXtKCX: "Name",
  fld9sbxP5gHs8qcsO: "FuelType",
  fldZ2HLhUsFTg7XSn: "Region",
  fldaZuTUqYb2YEU15: "Latitude",
  fldxBXN0c81g4uGK1: "Longitude",
  fldPmhaZxEMTUcDWs: "Operator",
  fldghd96iP7HOINzp: "Owner",
  fldmZ00VzZXiMXThI: "Output",
  fldqby1mB9xtP4QuH: "CommissionStart",
  fldPx6NI6hAQk8BS1: "CommissionEnd",
  flduS2NRXXaClldbM: "DecommissionStart",
  flddtGBZFMGPR1Vgq: "DecommissionEnd",
  flddOvnQtlljYZpVw: "ThumbnailImage",
  fldvI25Q57sQFS9RJ: "ShortDescription",
  fldbClt2TMD7NELna: "Controversies"
};

// And inverse as helper
export const PowerStationFieldNameToIdMapping = Object.fromEntries(
  Object.entries(PowerStationFieldIdToNameMapping).map(([id, name]) => [
    name,
    id,
  ])
);

export const RegionFieldIdToNameMapping = {
  fldUjlD7kYOge8fS0: "Name",
};

export const RegionFieldNameToIdMapping = Object.fromEntries(
  Object.entries(RegionFieldIdToNameMapping).map(([id, name]) => [name, id])
);

export const FuelTypeFieldIdToNameMapping = {
  fldnEX77eOrhwz0B0: "Name",
  fldjHxR8L2XbSXlqB: "Shorthand",
  fldX24kZhRaaQkVCD: "RGBColor",
  fldA8ww1crWDDstuk: "Icon",
};

export const FuelTypeFieldNameToIdMapping = Object.fromEntries(
  Object.entries(FuelTypeFieldIdToNameMapping).map(([id, name]) => [name, id])
);

export const EntityFieldIdToNameMapping = {
  fldT2KxRmj72cucaA: "Name",
  fld6QU0bo6XWODmTs: "Role",
  fldbZyLm3ZBGL7RxJ: "Controversies",
  fldkQc4JxSfJjIDrW: "EntityType",
  fldlGae0cm0lXqrYw: "Country",
  fldoXxxYNmcUUlRrw: "Image",
  fld8ZhBjQ9KQf9sqg: "Details",
  fldFyUdwCXbJFyMBO: "Established",
  fldqLIbivSqHDGFks: "Description"

};

export const EntityFieldNameToIdMapping = Object.fromEntries(
  Object.entries(EntityFieldIdToNameMapping).map(([id, name]) => [name, id])
);

export const CountryFieldIdToNameMapping = {
  fldWkbfmIfSlt3MmF: "Name",
};

export const CountryFieldNameToIdMapping = Object.fromEntries(
  Object.entries(CountryFieldIdToNameMapping).map(([id, name]) => [name, id])
);

export const EntityRoleFieldIdToNameMapping = {
  fldgQBH9vWJeVXxl1: "Role",
  fldV2u9ZlbK1Z8mnP: "Entity",
  fld72lL4RmFWS7NU1: "PersonPolitician",
};

export const EntityRoleFieldNameToIdMapping = Object.fromEntries(
  Object.entries(EntityRoleFieldIdToNameMapping).map(([id, name]) => [name, id])
);
