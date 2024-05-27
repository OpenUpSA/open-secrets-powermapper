"use client";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { useState } from "react";
import { Suspense } from "react";

import { PowerStation } from "@/types";
import Map from "@/components/map";
import FilterPanel from "@/components/filterPanel";

import Grid from "@mui/material/Unstable_Grid2";

export default function Page() {
  const [filteredPowerStations, setFilteredPowerStations] = useState<
    PowerStation[]
  >([]);
  return (
    <Grid container spacing={0}>
      <Grid xs={2}>
        <Suspense>
          <FilterPanel setFilteredPowerStations={setFilteredPowerStations} />
        </Suspense>
      </Grid>
      <Grid xs={10} className="mapContainer">
        <Map powerStations={filteredPowerStations} />
      </Grid>
    </Grid>
  );
}
