import { PowerStation } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";
import Airtable from "airtable";
import { NextResponse } from "next/server";

export async function GET(request: NextApiRequest, response: NextApiResponse) {
  const base = Airtable.base("appZdj1pFZQOBMn4E");
  const table = base("Power Stations").select({
    view: "Grid view",
    fields: ["Name", "Fuel Type", "Country", "Region", "Latitude", "Longitude"],
  });
  const powerStations: PowerStation[] = [];

  try {
    await table.eachPage((records, processNextPage) => {
      records.forEach(({ fields, id }) => {
        powerStations.push({
          name: fields.Name as PowerStation["name"],
          fuelType: fields["Fuel Type"] as PowerStation["fuelType"],
          country: fields.Country as PowerStation["country"],
          region: fields.Region as PowerStation["region"],
          latitude: fields.Latitude as PowerStation["latitude"],
          longitude: fields.Longitude as PowerStation["longitude"],

        });
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
