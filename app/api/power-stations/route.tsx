import { Position, PowerStation, Region, FuelType, Entity } from "@/types";

import Airtable from "airtable";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const base = Airtable.base("appZdj1pFZQOBMn4E");

  const powerStationsTable = base("Power Stations").select({
    view: "Published",
    fields: [
      "Name",
      "Fuel Type",
      "Region",
      "Latitude",
      "Longitude",
      "Operator",
      "Owner",
      "Output (MW)",
      "Commission start",
      "Commission end",
      "Decommission start",
      "Decommission end",
      "Thumbnail image",
      "Short description"
    ],
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
          name: fields.Name as PowerStation["name"],
          fuelType: fuelTypes.find(
            (fuelType) =>
              fuelType.id === (fields["Fuel Type"] as readonly string[])[0]
          ) as PowerStation["fuelType"],
          country: fields.Country as PowerStation["country"],
          region: regions.find(
            (region) => region.id === (fields.Region as readonly string[])[0]
          ) as PowerStation["region"],
          position: {
            lat: fields.Latitude as Position["lat"],
            lng: fields.Longitude as Position["lng"],
          },
          powerOutput: fields["Output (MW)"] as PowerStation["powerOutput"],
          age: {
            commissionStart: new Date(fields["Commission start"] as string),
            commissionEnd: new Date(fields["Commission end"] as string),
            decommissionStart: new Date(fields["Decommission start"] as string),
            decommissionEnd: new Date(fields["Decommission end"] as string),
            years: 0,
          },
          description: fields["Short description"] as PowerStation["description"],
        };

        if (fields["Thumbnail image"]) {
          const image: any = (fields["Thumbnail image"] as any)[0];
          powerStation.images = {
            small: {
              id: image.id,
              url: image.thumbnails.small.url,
              width: image.thumbnails.small.width,
              height: image.thumbnails.small.height,
              filename: image.filename,
              type: image.type,
            },
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

        if (fields.Operator) {
          powerStation.operator = entities.find(
            (entity) => entity.id === (fields.Operator as readonly string[])[0]
          ) as Entity;
        }

        if (fields.Owner) {
          powerStation.owner = entities.find(
            (entity) => entity.id === (fields.Owner as readonly string[])[0]
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
