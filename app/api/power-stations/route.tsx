import { Position, PowerStation, Region, FuelType, Entity } from "@/types";

import Airtable from "airtable";
import { NextResponse } from "next/server";

// Column (field) names in Airtable can be changed by users which would break code
// so use field IDs for retrieval and map them to names that do not change in this
// code.
// Get IDs here:
// https://airtable.com/appZdj1pFZQOBMn4E/api/docs#curl/table:power%20stations:fields
const powerStationFieldIdToNameMapping = {
  fldc5VoKdeCbXtKCX: "Name",
  fld9sbxP5gHs8qcsO: "Fuel Type",
  fldZ2HLhUsFTg7XSn: "Region",
  fldaZuTUqYb2YEU15: "Latitude",
  fldxBXN0c81g4uGK1: "Longitude",
  fldPmhaZxEMTUcDWs: "Operator",
  fldghd96iP7HOINzp: "Owner",
  fldmZ00VzZXiMXThI: "Output (MW)",
  fldqby1mB9xtP4QuH: "Commission start",
  fldPx6NI6hAQk8BS1: "Commission end",
  flduS2NRXXaClldbM: "Decommission start",
  flddtGBZFMGPR1Vgq: "Decommission end",
  flddOvnQtlljYZpVw: "Thumbnail image",
  fldvI25Q57sQFS9RJ: "Short description",
};

// And inverse as helper
const PowerStationFieldNameToIdMapping = Object.fromEntries(
  Object.entries(powerStationFieldIdToNameMapping).map(([id, name]) => [
    name,
    id,
  ])
);

export async function GET(req: Request) {
  const base = Airtable.base("appZdj1pFZQOBMn4E");

  const powerStationsTable = base("Power Stations").select({
    view: "Published",
    fields: Object.keys(powerStationFieldIdToNameMapping),
    returnFieldsByFieldId: true,
  });
  const powerStations: PowerStation[] = [];

  const regionsTable = base("Region (Ref)").select({
    view: "Grid view",
    fields: ["Name"],
  });
  const regions: Region[] = [];

  const fuelTypesTable = base("Fuel Type (Ref)").select({
    view: "Grid view",
    fields: ["Name", "Shorthand", "RGB Color", "Icon"],
  });
  const fuelTypes: FuelType[] = [];

  const entitiesTable = base("Entities").select({
    view: "All Entities",
    fields: ["Name"],
  });
  const entities: Entity[] = [];

  try {
    await regionsTable.eachPage((records, processNextPage) => {
      records.forEach(({ fields, id }) => {
        regions.push({
          id: id as Region["id"],
          name: fields.Name as Region["name"],
        });
      });
      processNextPage();
    });
    await fuelTypesTable.eachPage((records, processNextPage) => {
      records.forEach(({ fields, id }) => {
        fuelTypes.push({
          id: id as FuelType["id"],
          name: fields.Name as FuelType["name"],
          shorthand: fields.Shorthand as FuelType["shorthand"],
          rGBColor: fields["RGB Color"] as FuelType["rGBColor"],
          icon: fields.Icon as FuelType["icon"],
        });
      });
      processNextPage();
    });
    await entitiesTable.eachPage((records, processNextPage) => {
      records.forEach(({ fields, id }) => {
        entities.push({
          id: id as Entity["id"],
          name: fields.Name as Entity["name"],
          role_id: fields.Role as Entity["role_id"],
          country_id: fields.Country as Entity["country_id"],
        });
      });
      processNextPage();
    });
    await powerStationsTable.eachPage((records, processNextPage) => {
      records.forEach(({ fields, id }) => {
        const powerStation: PowerStation = {
          id: id as PowerStation["id"],
          name: fields[
            PowerStationFieldNameToIdMapping["Name"]
          ] as PowerStation["name"],
          fuelType: fuelTypes.find(
            (fuelType) =>
              fuelType.id ===
              (
                fields[
                  PowerStationFieldNameToIdMapping["Fuel Type"]
                ] as readonly string[]
              )[0]
          ) as PowerStation["fuelType"],
          country: fields[
            PowerStationFieldNameToIdMapping["Country"]
          ] as PowerStation["country"],
          region: regions.find(
            (region) =>
              region.id ===
              (
                fields[
                  PowerStationFieldNameToIdMapping["Region"]
                ] as readonly string[]
              )[0]
          ) as PowerStation["region"],
          position: {
            lat: fields[
              PowerStationFieldNameToIdMapping["Latitude"]
            ] as Position["lat"],
            lng: fields[
              PowerStationFieldNameToIdMapping["Longitude"]
            ] as Position["lng"],
          },
          powerOutput: fields["Output (MW)"] as PowerStation["powerOutput"],
          age: {
            commissionStart: new Date(fields["Commission start"] as string),
            commissionEnd: new Date(fields["Commission end"] as string),
            decommissionStart: new Date(fields["Decommission start"] as string),
            decommissionEnd: new Date(fields["Decommission end"] as string),
            years: 0,
          },
          description: fields[
            "Short description"
          ] as PowerStation["description"],
        };

        if (fields["Thumbnail image"]) {
          const image: any = (fields["Thumbnail image"] as any)[0];
          powerStation.images = {
            large: {
              id: image.id,
              url: image.thumbnails.large.url,
              width: image.thumbnails.large.width,
              height: image.thumbnails.large.height,
              filename: image.filename,
              type: image.type,
            },
            full: {
              id: image.id,
              url: image.thumbnails.full.url,
              width: image.thumbnails.full.width,
              height: image.thumbnails.full.height,
              filename: image.filename,
              type: image.type,
            },
          };
        }

        if (fields[PowerStationFieldNameToIdMapping["Operator"]]) {
          powerStation.operator = entities.find(
            (entity) =>
              entity.id ===
              (
                fields[
                  PowerStationFieldNameToIdMapping["Operator"]
                ] as readonly string[]
              )[0]
          ) as Entity;
        }

        if (fields[PowerStationFieldNameToIdMapping["Owner"]]) {
          powerStation.owner = entities.find(
            (entity) =>
              entity.id ===
              (
                fields[
                  PowerStationFieldNameToIdMapping["Owner"]
                ] as readonly string[]
              )[0]
          ) as Entity;
        }

        if (fields["Decommission start"]) {
          powerStation.age.years =
            new Date(fields["Decommission start"] as string).getFullYear() -
            new Date(fields["Commission end"] as string).getFullYear();
        } else if (fields["Commission end"]) {
          powerStation.age.years =
            new Date().getFullYear() -
            new Date(fields["Commission end"] as string).getFullYear();
        }

        powerStations.push(powerStation);
      });
      processNextPage();
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Unknown server error" },
      { status: 502 }
    );
  }

  return NextResponse.json({ powerStations }, { status: 200 });
}
