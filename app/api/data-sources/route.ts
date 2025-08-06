export const dynamic = "force-dynamic";

import { DataSource } from "@/types";
import {
  DataSourcesFieldIdToNameMapping,
  DataSourcesFieldNameToIdMapping,
} from "@/airtableFieldMappings";

import Airtable from "airtable";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const base = Airtable.base("appZdj1pFZQOBMn4E");

  const dataSourcesTable = base("tbl7rgO5nswYVj53q").select({
    view: "Grid view", 
    fields: Object.keys(DataSourcesFieldIdToNameMapping),
    returnFieldsByFieldId: true,
  });
  
  const dataSourcesData: DataSource[] = [];

  try {
    await dataSourcesTable.eachPage((records, processNextPage) => {
      records.forEach(({ fields, id }) => {
        dataSourcesData.push({
          source: fields[DataSourcesFieldNameToIdMapping["Source name"]] as DataSource["source"],
          url: fields[DataSourcesFieldNameToIdMapping["URL"]] as DataSource["url"],
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

 
  return NextResponse.json(dataSourcesData, {
    status: 200,
  });
}