import { useState } from "react";

import { PowerStation } from "@/types";
import Map from "@/components/map";
import FilterPanel from "@/components/filterPanel";

import Stack from "@mui/material/Stack";

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

  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <>
      <div className="flexGrid">
        <FilterPanel
          setFilteredPowerStations={setFilteredPowerStations}
          filteredPowerStations={filteredPowerStations}
          setIntroModalOpen={setIntroModalOpen}
          panelOpen={panelOpen}
          setPanelOpen={setPanelOpen}
        />
        <div className="mapContainer">
          <Map
            powerStations={filteredPowerStations}
            panelOpen={panelOpen}
            setPanelOpen={setPanelOpen}
          />
        </div>
      </div>
      <IntroModal
        introModalOpen={introModalOpen}
        closeIntroModal={closeIntroModal}
      />
    </>
  );
}
