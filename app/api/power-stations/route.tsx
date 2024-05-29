import { Position, PowerStation, Region, FuelType, Entity } from "@/types";

import Airtable from "airtable";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const base = Airtable.base("appZdj1pFZQOBMn4E");

  const powerStationsTable = base("Power Stations").select({
    view: "Grid view",
    fields: [
      "Name",
      "Fuel Type",
      "Region",
      "Latitude",
      "Longitude",
      "Operator",
      "Output (MW)",
      "Commission start",
      "Commission end",
      "Decommission start",
      "Decommission end",
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
    fields: ["Name", "Shorthand"],
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
        });
      });
      processNextPage();
    });
    await entitiesTable.eachPage((records, processNextPage) => {
      records.forEach(({ fields, id }) => {
        entities.push({
          id: id as Entity["id"],
          name: fields.Name as Entity["name"],
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
        };

        if (fields.Operator) {
          powerStation.operator = entities.find(
            (entity) => entity.id === (fields.Operator as readonly string[])[0]
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
