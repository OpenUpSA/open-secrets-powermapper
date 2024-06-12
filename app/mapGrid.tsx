import { useState } from "react";

import { PowerStation } from "@/types";
import Map from "@/components/map";
import FilterPanel from "@/components/filterPanel";

import Grid from "@mui/material/Unstable_Grid2";

import { IntroModal } from "@/components/introModal";

import { getCookie, setCookie } from "cookies-next";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const currentSearchParams = useSearchParams();
  const seenIntroModal = getCookie("seenIntroModal");

  const closeIntroModal = () => {
    setCookie("seenIntroModal", "true");
    setIntroModalOpen(false);
  };

  const [introModalOpen, setIntroModalOpen] = useState(
    !seenIntroModal && currentSearchParams.toString() === ""
  );
  const [filteredPowerStations, setFilteredPowerStations] = useState<
    PowerStation[]
  >([]);

  return (
    <>
      <Grid container spacing={0}>
        <Grid
          xs={2.5}
          sx={{
            display: currentSearchParams.get("full") ? "none" : "block",
          }}
        >
          <FilterPanel
            setFilteredPowerStations={setFilteredPowerStations}
            filteredPowerStations={filteredPowerStations}
            setIntroModalOpen={setIntroModalOpen}
          />
        </Grid>
        <Grid
          xs={currentSearchParams.get("full") ? 12 : 9.5}
          className="mapContainer"
        >
          <Map powerStations={filteredPowerStations} />
        </Grid>
      </Grid>
      <IntroModal
        introModalOpen={introModalOpen}
        closeIntroModal={closeIntroModal}
      />
    </>
  );
}
