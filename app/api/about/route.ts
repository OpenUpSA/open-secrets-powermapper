export const dynamic = "force-dynamic";

import { About } from "@/types";
import {
  AboutToolFieldIdToNameMapping,
  AboutToolFieldNameToIdMapping,
} from "@/airtableFieldMappings";

import Airtable from "airtable";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const base = Airtable.base("appZdj1pFZQOBMn4E");

  
  const aboutTable = base("tblOZsCYUFdB5gZug").select({
    view: "Grid view", 
    fields: Object.keys(AboutToolFieldIdToNameMapping),
    returnFieldsByFieldId: true,
  });
  
  const aboutData: About[] = [];

  try {
    await aboutTable.eachPage((records, processNextPage) => {
      records.forEach(({ fields, id }) => {
        aboutData.push({
          title: fields[AboutToolFieldNameToIdMapping["Title"]] as About["title"],
          body: fields[AboutToolFieldNameToIdMapping["Body text"]] as About["body"],
          reportUrl: fields[AboutToolFieldNameToIdMapping["Report URL"]] as About["reportUrl"],
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

  const responseData = aboutData.length > 0 ? aboutData[0] : null;

  return NextResponse.json(responseData, {
    status: 200,
  });
}