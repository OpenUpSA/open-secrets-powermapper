import "./map.scss";
import Slide from "@mui/material/Slide";
import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
  MapControl,
  ControlPosition,
} from "@vis.gl/react-google-maps";
import { Entity, PowerStation } from "@/types";
import { useEffect, useState } from "react";

import { PowerStationMarker } from "@/components/powerStationMarker/index";
import { useSearchParams } from "next/navigation";

import SVG from "react-inlinesvg";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { Typography } from "@mui/material";

type Props = {
  powerStations: PowerStation[];
};

function Component({ powerStations }: Props) {
  const defaultCenter = { lat: -29.01886710220426, lng: 26.096035496567033 };
  const [center, setCenter] = useState(defaultCenter);
  const currentSearchParams = useSearchParams();
  const [sidePanelEntity, setSidePanelEntity] = useState<Entity | null>(null);
  const [fuelTypes, setFuelTypes] = useState<PowerStation["fuelType"][]>([]);

  const closeSidePanel = () => {
    setSidePanelEntity(null);
  };

  useEffect(() => {
    const fuelTypes = powerStations
      .map((powerStation) => powerStation.fuelType)
      .filter((fuelType, index, self) => {
        return (
          index ===
          self.findIndex(
            (t) => t.id === fuelType.id && t.name === fuelType.name
          )
        );
      });

    setFuelTypes(fuelTypes);
  }, [powerStations]);

  const centerChanged = (event: MapCameraChangedEvent) => {
    setCenter(event.detail.center);
  };

  return (
    <APIProvider apiKey="AIzaSyAYcsm0xB834bBAKu0GGjCu2Xzp2qLWx0o">
      <Map
        defaultCenter={defaultCenter}
        defaultZoom={6}
        mapId="2090f822becfb038"
        center={center}
        onCenterChanged={centerChanged}
        streetViewControl={false}
        fullscreenControl={false}
        mapTypeControl={false}
        zoomControlOptions={{
          position: ControlPosition.LEFT_BOTTOM,
        }}
      >
        {powerStations.map((powerStation) => (
          <PowerStationMarker
            key={powerStation.id}
            powerStation={powerStation}
            setSidePanelEntity={setSidePanelEntity}
          />
        ))}

        <MapControl position={ControlPosition.LEFT_BOTTOM}>
          <div className="fuelTypeLegend">
            <div className="legendTitle">Legend</div>
            {fuelTypes.map((fuelType) => (
              <div className="legendItem" key={fuelType.shorthand}>
                <div
                  className="legendColor"
                  style={{
                    background: `rgba(${fuelType.rGBColor}, ${
                      currentSearchParams.get("show-by-power") === "true"
                        ? 0.6
                        : 1
                    })`,
                  }}
                >
                  <SVG src={fuelType.icon} className="legendIcon" />
                </div>
                <div className="legendLabel">{fuelType.name}</div>
              </div>
            ))}
          </div>
        </MapControl>
        <Slide
          direction="left"
          in={sidePanelEntity ? true : false}
          mountOnEnter
          unmountOnExit
        >
          <Box className="sidePanel">
            {sidePanelEntity && (
              <>
                <Stack direction="row" spacing={2}>
                  <Typography>
                    <Typography className="title">
                      {sidePanelEntity.name}
                    </Typography>
                    <Typography className="subTitle">Operator</Typography>
                  </Typography>
                  <Button
                    className="closeButton"
                    variant="contained"
                    onClick={closeSidePanel}
                  >
                    X
                  </Button>
                </Stack>
                <Divider className="buffer" />
                <div className="content">
                  <h3>Company details</h3>
                  <p>
                    PetroSA Operator Company details PetroSA, was formed in 2002
                    as a result of a merger of unree entities. soekor (riy Li,
                    Mossoas (ru co. and parts of the Strategic Fuel Fund
                    Association. As it stands, PetroSA is the largest diesel
                    supplier to Eskom, though the power utility also purchases
                    diesel from commercial suppliers including Astron, Engen,
                    and Shell.
                  </p>
                  <table>
                    <tr>
                      <td>Type:</td>
                      <td>State owned</td>
                    </tr>
                    <tr>
                      <td>Country:</td>
                      <td>South Africa</td>
                    </tr>
                    <tr>
                      <td>Established:</td>
                      <td>2002</td>
                    </tr>
                  </table>
                  <h3>Leadership</h3>
                  <p className="leadership">
                    Nkululeko Poya
                    <span className="role">Chairperson</span>
                  </p>
                  <h3>Controversies</h3>
                  <p>
                    PetroSA has a long history of being used for narrow noliteal
                    nain and corniniton in Jilll the came vos PetroSA was
                    formed, a company called Imvume won a R750 million contract
                    to supply oil to PetroSA. In 2005, the Mall and Guardian
                    exposed That Imvume was errectively al front company for the
                    African National Congress (ANC) and had diverted Ri million
                    from the contract to the aNci in the run-up to the 2004
                    elections.
                  </p>
                  <p>
                    PetroSA has been unprofitable for many years, with the
                    auditor general casting doubt on the company's viability as
                    early as 2017, following a R1.4 billion annual loss. The
                    year before, PetroSA was forced to impair R14.5 billion in
                    assets due to a failed gas project called Ikwezi. PetroSA's
                    leadershin souant to navo the parliamentar« hearina into
                    this issue and a related forensic report kept secret. Its
                    financial struggles have accelerated following the closure
                    of its Mossel Bay refinery in 2020.
                  </p>
                  <p>
                    Eskom was torced to use Ra.., billion in tunas trom ito
                    savings in capital and operational expenditure to secure an
                    emergency procurement of 50 million litres of diesel from
                    stock held by PetroSA in late November 2022. This eqliated
                    to Kya per litre, sianiticantlv more than the R23.51 it
                    usually paid (which was already an elevated price). On 6
                    January 2023, Eskom made a second payment of R 1.3 billion
                    to PetroSA for 56 million litres, Inotan tis time ala lower
                    orice. Later. on 70 anuary rernm manastnra nirenseonrs
                    liansakm is paid just over R4 billion to PetroSA in the
                    space of three...
                  </p>
                </div>
              </>
            )}
          </Box>
        </Slide>
      </Map>
    </APIProvider>
  );
}

export default Component;
