"use client";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { useEffect, useState } from "react";
import { Suspense } from "react";

import { PowerStation } from "@/types";
import Map from "@/components/map";
import FilterPanel from "@/components/filterPanel";

import Grid from "@mui/material/Unstable_Grid2";

async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/power-stations`);
  const { powerStations } = await res.json();
  return powerStations;
}

export default function Page() {
  const [powerStations, setPowerStations] = useState<PowerStation[]>([]);
  useEffect(() => {
    getData().then(setPowerStations);
  }, []);

  return (
    <Grid container spacing={0}>
      <Grid xs={2}>
        <Suspense>
          <FilterPanel />
        </Suspense>
      </Grid>
      <Grid xs={10} className="mapContainer">
        <Map powerStations={powerStations} />
      </Grid>
    </Grid>
  );
}
