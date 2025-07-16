import { Position, PowerStation, Region, FuelType, Entity } from "@/types";
import {
  PowerStationFieldNameToIdMapping,
  PowerStationFieldIdToNameMapping,
  RegionFieldNameToIdMapping,
  RegionFieldIdToNameMapping,
  FuelTypeFieldNameToIdMapping,
  FuelTypeFieldIdToNameMapping,
  EntityFieldIdToNameMapping,
  EntityFieldNameToIdMapping,
} from "@/airtableFieldMappings";

import { uploadToImgKit } from "@/utils/imgkit";

import Airtable from "airtable";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  const base = Airtable.base("appZdj1pFZQOBMn4E");

  const powerStationsTable = base("tblEBJSWNL3XANYxt").select({
    view: "Published",
    fields: Object.keys(PowerStationFieldIdToNameMapping),
    returnFieldsByFieldId: true,
  });
  const powerStations: PowerStation[] = [];

  const regionsTable = base("tblyeRxxIuBRuLyr4").select({
    view: "Grid view",
    fields: Object.keys(RegionFieldIdToNameMapping),
    returnFieldsByFieldId: true,
  });
  const regions: Region[] = [];

  const fuelTypesTable = base("tblKA9N6rrCI4yEJS").select({
    view: "Grid view",
    fields: Object.keys(FuelTypeFieldIdToNameMapping),
    returnFieldsByFieldId: true,
  });
  const fuelTypes: FuelType[] = [];

  const entitiesTable = base("tbliu88eOfPtmIMRO").select({
    view: "All Entities",
    fields: Object.keys(EntityFieldIdToNameMapping),
    returnFieldsByFieldId: true,
  });
  const entities: Entity[] = [];

  try {
    await regionsTable.eachPage((records, processNextPage) => {
      records.forEach(({ fields, id }) => {
        regions.push({
          id: id as Region["id"],
          name: fields[RegionFieldNameToIdMapping["Name"]] as Region["name"],
        });
      });
      processNextPage();
    });
    await fuelTypesTable.eachPage((records, processNextPage) => {
      records.forEach(({ fields, id }) => {
        fuelTypes.push({
          id: id as FuelType["id"],
          name: fields[
            FuelTypeFieldNameToIdMapping["Name"]
          ] as FuelType["name"],
          shorthand: fields[
            FuelTypeFieldNameToIdMapping["Shorthand"]
          ] as FuelType["shorthand"],
          rGBColor: fields[
            FuelTypeFieldNameToIdMapping["RGBColor"]
          ] as FuelType["rGBColor"],
          icon: fields[
            FuelTypeFieldNameToIdMapping["Icon"]
          ] as FuelType["icon"],
        });
      });
      processNextPage();
    });
    await entitiesTable.eachPage((records, processNextPage) => {
      records.forEach(({ fields, id }) => {
        entities.push({
          id: id as Entity["id"],
          name: fields[EntityFieldNameToIdMapping["Name"]] as Entity["name"],
          role_id: fields[
            EntityFieldNameToIdMapping["Role"]
          ] as Entity["role_id"],
          country_id: fields[
            EntityFieldNameToIdMapping["Country"]
          ] as Entity["country_id"],
          description: fields[
            EntityFieldNameToIdMapping["Description"]
          ] as Entity["description"]
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
                PowerStationFieldNameToIdMapping["FuelType"]
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
          powerOutput: fields[
            PowerStationFieldNameToIdMapping["Output"]
          ] as PowerStation["powerOutput"],
          age: {
            commissionStart: new Date(
              fields[
              PowerStationFieldNameToIdMapping["CommissionStart"]
              ] as string
            ),
            commissionEnd: new Date(
              fields[
              PowerStationFieldNameToIdMapping["CommissionEnd"]
              ] as string
            ),
            decommissionStart: new Date(
              fields[
              PowerStationFieldNameToIdMapping["DecommissionStart"]
              ] as string
            ),
            decommissionEnd: new Date(
              fields[
              PowerStationFieldNameToIdMapping["DecommissionEnd"]
              ] as string
            ),
            years: 0,
          },
          description: fields[
            PowerStationFieldNameToIdMapping["ShortDescription"]
          ] as PowerStation["description"],
          controversies: fields[
            PowerStationFieldNameToIdMapping["Controversies"]
          ] as PowerStation["controversies"],
        };

        if (fields[PowerStationFieldNameToIdMapping["ThumbnailImage"]]) {
          const image: any = (
            fields[PowerStationFieldNameToIdMapping["ThumbnailImage"]] as any
          )[0];
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
          // We the Airtable image URLs on Imgkit because Airtable image URLs expire after
          // 2 hours
          uploadToImgKit(
            powerStation.images.full.url,
            `full_${powerStation.images.full.filename}`,
            "powerstations"
          );
        }

        const operatorIds = fields[PowerStationFieldNameToIdMapping["Operator"]];
        powerStation.operator = Array.isArray(operatorIds)
          ? operatorIds
            .map(id => entities.find(entity => entity.id === id))
            .filter(Boolean) as Entity[]
          : [];


        const ownerIds = fields[PowerStationFieldNameToIdMapping["Owner"]];
        powerStation.owner = Array.isArray(ownerIds)
          ? ownerIds
            .map(id => entities.find(entity => entity.id === id))
            .filter(Boolean) as Entity[]
          : [];

        if (fields["DecommissionStart"]) {
          powerStation.age.years =
            new Date(fields["DecommissionStart"] as string).getFullYear() -
            new Date(fields["CommissionEnd"] as string).getFullYear();
        } else if (fields["CommissionEnd"]) {
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

  console.log(JSON.stringify(powerStations));

  return NextResponse.json({ powerStations }, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Netlify-CDN-Cache-Control": "public, max-age=31536000, must-revalidate",
      "Cache-Tag": "power-stations",
    },
  });
}
