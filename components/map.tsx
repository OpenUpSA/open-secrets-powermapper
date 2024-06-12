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
import { useSearchParams } from "next/navigation";
import { styled } from "@mui/material/styles";

import { PowerStationMarker } from "@/components/powerStationMarker/index";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import SVG from "react-inlinesvg";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { Typography } from "@mui/material";
import Image from "next/image";
import LinearProgress from "@mui/material/LinearProgress";
import CloseIcon from "@mui/icons-material/Close";

import logo from "@/public/images/logo.png";

const StyledSwitch = styled(Switch)(() => ({
  "& .MuiSwitch-switchBase": {
    color: "#80660a",
  },
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#FFCB14",
  },
  "& .MuiSwitch-track": {
    backgroundColor: "#999",
  },
  "& .MuiSwitch-track.Mui-checked": {
    backgroundColor: "#FFCB14",
  },
}));

type Props = {
  powerStations: PowerStation[];
};

const defaultCenter = { lat: -29.01886710220426, lng: 26.096035496567033 };

function Component({ powerStations }: Props) {
  const currentSearchParams = useSearchParams();
  const [center, setCenter] = useState({
    lat: Number(currentSearchParams.get("lat")) || defaultCenter.lat,
    lng: Number(currentSearchParams.get("lng")) || defaultCenter.lng,
  });
  const [sidePanelEntity, setSidePanelEntity] = useState<Entity | null>(null);
  const [sidePanelEntityInfo, setSidePanelEntityInfo] = useState<Entity | null>(
    null
  );
  const [fuelTypes, setFuelTypes] = useState<PowerStation["fuelType"][]>([]);
  const [mapTypeId, setMapTypeId] = useState(
    currentSearchParams.get("map") || "roadmap"
  );
  const [zoom, setZoom] = useState(currentSearchParams.get("zoom") || 6);

  const closeSidePanel = () => {
    setSidePanelEntity(null);
  };

  const handleShowByPowerChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const newParams = new URLSearchParams(currentSearchParams.toString());
    if (checked) {
      newParams.set("show-by-power", "true");
    } else {
      newParams.delete("show-by-power");
    }
    window.history.pushState(null, "", `?${newParams.toString()}`);
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

  const setZoomAndCenterParams = (event: MapCameraChangedEvent) => {
    const newParams = new URLSearchParams(currentSearchParams.toString());
    const newCenter = event.map.getCenter();
    if (newCenter) {
      setCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
      newParams.set("lat", newCenter.lat().toString());
      newParams.set("lng", newCenter.lng().toString());
    }

    const newZoom = event.map.getZoom();
    if (newZoom) {
      newParams.set("zoom", newZoom.toString());
      setZoom(newZoom);
    }
    window.history.pushState(null, "", `?${newParams.toString()}`);
  };

  const centerChanged = (event: MapCameraChangedEvent) => {
    setZoomAndCenterParams(event);
  };

  const zoomChanged = (event: any) => {
    setZoomAndCenterParams(event);
  };

  const mapTypeIdChanged = (event: any) => {
    if (event.map.mapTypeId) {
      const newParams = new URLSearchParams(currentSearchParams.toString());
      newParams.set("map", event.map.mapTypeId);
      setMapTypeId(event.detail.mapTypeId);
      window.history.pushState(null, "", `?${newParams.toString()}`);
    }
  };

  return (
    <APIProvider apiKey="AIzaSyAYcsm0xB834bBAKu0GGjCu2Xzp2qLWx0o">
      <Map
        defaultCenter={center}
        defaultZoom={6}
        zoom={Number(zoom)}
        mapId="2090f822becfb038"
        mapTypeId={mapTypeId}
        onCenterChanged={centerChanged}
        streetViewControl={false}
        fullscreenControl={false}
        mapTypeControl={true}
        mapTypeControlOptions={{
          position: ControlPosition.TOP_RIGHT,
          mapTypeIds: ["roadmap", "satellite"],
        }}
        zoomControlOptions={{
          position: ControlPosition.LEFT_BOTTOM,
        }}
        onMapTypeIdChanged={mapTypeIdChanged}
        onZoomChanged={zoomChanged}
      >
        {powerStations.map((powerStation) => (
          <PowerStationMarker
            key={powerStation.id}
            powerStation={powerStation}
            setSidePanelEntity={setSidePanelEntity}
          />
        ))}

        <MapControl position={ControlPosition.TOP_LEFT}>
          <Image
            src={logo}
            alt="logo"
            className="logo"
            width={215}
            height={45}
          />
        </MapControl>

        <MapControl position={ControlPosition.LEFT_BOTTOM}>
          <div
            className={`fuelTypeLegend ${
              fuelTypes.length === 0 ? "noFuelTypes" : ""
            }`}
          >
            <FormGroup>
              <FormControlLabel
                label={
                  <Typography fontSize={12}>Show by power output</Typography>
                }
                labelPlacement="start"
                control={
                  <StyledSwitch
                    size="small"
                    checked={
                      currentSearchParams.get("show-by-power") === "true"
                    }
                    onChange={handleShowByPowerChange}
                  />
                }
              />
            </FormGroup>
            <div className="legendTitle">
              {fuelTypes.length === 0 ? "No matching power stations" : "Legend"}
            </div>
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
                  <button className="closeButton" onClick={closeSidePanel}>
                    <CloseIcon fontSize="medium" />
                  </button>
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

                  {sidePanelEntityInfo.controversies && (
                    <>
                      <h3>Controversies</h3>
                      <p>{sidePanelEntityInfo.controversies}</p>
                    </>
                  )}
                </div>
              </>
            ) : (
              <LinearProgress />
            )}
          </Box>
        </Slide>
      </Map>
    </APIProvider>
  );
}

export default Component;
