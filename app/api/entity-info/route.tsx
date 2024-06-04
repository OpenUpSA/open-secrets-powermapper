import { Entity, EntityRole, Country } from "@/types";

import Airtable from "airtable";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const entityToExpandId = request.nextUrl.searchParams.get("id");

  const base = Airtable.base("appZdj1pFZQOBMn4E");

  const countriesTable = base("Country (Ref)").select({
    view: "Grid view",
    fields: ["Name"],
  });
  const countries: Country[] = [];

  const entitiesTable = base("Entities").select({
    view: "All Entities",
    fields: [
      "Name",
      "Role",
      "Controversies",
      "Entity Type",
      "Country",
      "Image",
      "Details",
      "Established",
    ],
  });
  const entities: Entity[] = [];

  const entityRolesTable = base("Entity Roles (Junction)").select({
    view: "Live",
    fields: ["Role", "Entity", "Person / Politician"],
  });
  const entityRoles: EntityRole[] = [];

  try {
    await countriesTable.eachPage((records, processNextPage) => {
      records.forEach(({ fields, id }) => {
        countries.push({
          id: id as Country["id"],
          name: fields.Name as Country["name"],
        });
      });
      processNextPage();
    });
    await entityRolesTable.eachPage((records, processNextPage) => {
      records.forEach(({ fields, id }) => {
        entityRoles.push({
          id: id as EntityRole["id"],
          role: fields.Role as EntityRole["role"],
          entity_id: fields.Entity as EntityRole["entity_id"],
          personPolitician_id: fields[
            "Person / Politician"
          ] as EntityRole["personPolitician_id"],
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
          controversies: fields.Controversies as Entity["controversies"],
          entityType: fields["Entity Type"] as Entity["entityType"],
          country_id: fields.Country as Entity["country_id"],
          image: fields.Image as Entity["image"],
          details: fields.Details as Entity["details"],
          established: fields.Established as Entity["established"],
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

  // Find entityRole with entity id of entityToExpandId
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

  // Hydrate responseEntity.country from countries
  responseEntity.country = countries.find(
    (country) => country.id === responseEntity.country_id[0]
  ) as Country;

  return NextResponse.json(responseEntity, {
    status: 200,
  });
}
