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
  const [sidePanelEntityInfo, setSidePanelEntityInfo] = useState<Entity | null>(
    null
  );
  const [fuelTypes, setFuelTypes] = useState<PowerStation["fuelType"][]>([]);

  const closeSidePanel = () => {
    setSidePanelEntity(null);
  };

  useEffect(() => {
    async function getData() {
      if (sidePanelEntity) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/entity-info?id=${sidePanelEntity.id}`
        );
        const entityInfoData = await res.json();
        setSidePanelEntityInfo(entityInfoData);
      }
    }
    setSidePanelEntityInfo(null);
    getData();
  }, [sidePanelEntity]);

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
            {sidePanelEntityInfo ? (
              <>
                <Stack direction="row" spacing={2}>
                  <Typography>
                    <Typography className="title">
                      {sidePanelEntityInfo.name}
                    </Typography>
                    <Typography className="subTitle">
                      {sidePanelEntityInfo.entityType}
                    </Typography>
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
                  <h3>{sidePanelEntityInfo.role}</h3>
                  <p>{sidePanelEntityInfo.details}</p>
                  <table>
                    <tr>
                      <td>Type:</td>
                      <td>{sidePanelEntityInfo.entityType}</td>
                    </tr>
                    {sidePanelEntityInfo.country && (
                      <tr>
                        <td>Country:</td>
                        <td>{sidePanelEntityInfo.country.name}</td>
                      </tr>
                    )}
                    {sidePanelEntityInfo.established && (
                      <tr>
                        <td>Established:</td>
                        <td>
                          {new Date(
                            sidePanelEntityInfo.established
                          ).getFullYear()}
                        </td>
                      </tr>
                    )}
                  </table>

                  {sidePanelEntityInfo.leadership && (
                    <>
                      <h3>Leadership</h3>
                      {sidePanelEntityInfo.leadership.map((leader) => (
                        <p className="leadership" key={leader.id}>
                          {leader.name}
                          <span className="role">{leader.role}</span>
                        </p>
                      ))}
                    </>
                  )}

                  <h3>Controversies</h3>
                  <p>{sidePanelEntityInfo.controversies}</p>
                </div>
              </>
            ) : (
              <div>Loading...</div>
            )}
          </Box>
        </Slide>
      </Map>
    </APIProvider>
  );
}

export default Component;
