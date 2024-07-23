import { Entity, EntityRole, Country } from "@/types";
import {
  EntityFieldIdToNameMapping,
  EntityFieldNameToIdMapping,
  CountryFieldNameToIdMapping,
  CountryFieldIdToNameMapping,
  EntityRoleFieldNameToIdMapping,
  EntityRoleFieldIdToNameMapping,
} from "@/airtableFieldMappings";

import Airtable from "airtable";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const entityToExpandId = request.nextUrl.searchParams.get("id");

  const base = Airtable.base("appZdj1pFZQOBMn4E");

  const countriesTable = base("tblaY5bXfxdoY7Bxa").select({
    view: "Grid view",
    fields: Object.keys(CountryFieldIdToNameMapping),
    returnFieldsByFieldId: true,
  });
  const countries: Country[] = [];

  const entitiesTable = base("tbliu88eOfPtmIMRO").select({
    view: "All Entities",
    fields: Object.keys(EntityFieldIdToNameMapping),
    returnFieldsByFieldId: true,
  });
  const entities: Entity[] = [];

  const entityRolesTable = base("tblygJBhM0TzGgit6").select({
    view: "Live",
    fields: Object.keys(EntityRoleFieldIdToNameMapping),
    returnFieldsByFieldId: true,
  });
  const entityRoles: EntityRole[] = [];

  try {
    await countriesTable.eachPage((records, processNextPage) => {
      records.forEach(({ fields, id }) => {
        countries.push({
          id: id as Country["id"],
          name: fields[CountryFieldNameToIdMapping["Name"]] as Country["name"],
        });
      });
      processNextPage();
    });
    await entityRolesTable.eachPage((records, processNextPage) => {
      records.forEach(({ fields, id }) => {
        entityRoles.push({
          id: id as EntityRole["id"],
          role: fields[
            EntityRoleFieldNameToIdMapping["Role"]
          ] as EntityRole["role"],
          entity_id: fields[
            EntityRoleFieldNameToIdMapping["Entity"]
          ] as EntityRole["entity_id"],
          personPolitician_id: fields[
            EntityRoleFieldNameToIdMapping["PersonPolitician"]
          ] as EntityRole["personPolitician_id"],
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
          controversies: fields[
            EntityFieldNameToIdMapping["Controversies"]
          ] as Entity["controversies"],
          entityType: fields[
            EntityFieldNameToIdMapping["EntityType"]
          ] as Entity["entityType"],
          country_id: fields[
            EntityFieldNameToIdMapping["Country"]
          ] as Entity["country_id"],
          image: fields[EntityFieldNameToIdMapping["Image"]] as Entity["image"],
          details: fields[
            EntityFieldNameToIdMapping["Details"]
          ] as Entity["details"],
          established: fields[
            EntityFieldNameToIdMapping["Established"]
          ] as Entity["established"],
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

  // Hydrate entityRoles
  entityRoles.forEach((entityRole) => {
    if (entityRole.entity_id) {
      entityRole.entity = entities.find(
        (e) => e.id === entityRole.entity_id[0]
      ) as Entity;
    }

    if (entityRole.personPolitician_id) {
      entityRole.personPolitician = entities.find(
        (e) => e.id === entityRole.personPolitician_id[0]
      ) as Entity;
    }
  });

  const responseEntity: Entity = entities.filter(
    (entity) => entity.id === entityToExpandId
  )[0];

  entityRoles.forEach((entityRole) => {
    if (
      entityRole.entity_id[0] === entityToExpandId &&
      entityRole.personPolitician
    ) {
      const leadershipEntity = entityRole.personPolitician;
      leadershipEntity.role = entityRole.role;
      if (!responseEntity.leadership) {
        responseEntity.leadership = [];
      }
      responseEntity.leadership.push(leadershipEntity);
    }
  });

  responseEntity.country = countries.find(
    (country) =>
      country.id ===
      (responseEntity.country_id &&
        responseEntity.country_id.length > 0 &&
        responseEntity.country_id[0])
  );

  return NextResponse.json(responseEntity, {
    status: 200,
  });
}
