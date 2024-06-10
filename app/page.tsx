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

import { Roboto } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#ffcc14",
    },
    secondary: {
      main: "#efefef",
    },
    info: {
      main: "#333",
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  shadows: [
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
  ],
});

export default function Page() {
  const [filteredPowerStations, setFilteredPowerStations] = useState<
    PowerStation[]
  >([]);
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <Grid container spacing={0}>
          <Grid xs={2.5}>
            <Suspense>
              <FilterPanel
                setFilteredPowerStations={setFilteredPowerStations}
                filteredPowerStations={filteredPowerStations}
              />
            </Suspense>
          </Grid>
          <Grid xs={9.5} className="mapContainer">
            <Suspense>
              <Map powerStations={filteredPowerStations} />
            </Suspense>
          </Grid>
        </Grid>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
