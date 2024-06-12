"use client";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { Suspense } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

import MapGrid from "./mapGrid";
import theme from "./theme";

export default function Page() {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <Suspense>
          <MapGrid />
        </Suspense>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
