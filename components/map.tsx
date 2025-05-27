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
import MenuOpenOutlinedIcon from "@mui/icons-material/MenuOpenOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LeaderModal from "@/components/leaderModal"

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
  panelOpen: boolean;
  setPanelOpen: Function;
};

const defaultCenter = { lat: -29.01886710220426, lng: 26.096035496567033 };

function Component({ powerStations, panelOpen, setPanelOpen }: Props) {
  const currentSearchParams = useSearchParams();
  const [center, setCenter] = useState({
    lat: Number(currentSearchParams.get("lat")) || defaultCenter.lat,
    lng: Number(currentSearchParams.get("lng")) || defaultCenter.lng,
  });
  const [selectedLeader, setSelectedLeader] = useState<Record<string, any> | null>(null);
const [leaderModalOpen, setLeaderModalOpen] = useState(false);

  // Get all entities from powerStation.owner and powerStation.operator
  const entities = powerStations
    .map((powerStation) => [powerStation.owner, powerStation.operator])
    .flat()
    .filter((entity) => entity !== null)
    .filter((entity) => entity !== undefined) as Entity[];

  const [sidePanelEntity, setSidePanelEntity] = useState<string | null>(
    currentSearchParams.get("eip") || null
  );
  const [sidePanelEntityInfo, setSidePanelEntityInfo] = useState<Entity | null>(
    null
  );
  const [fuelTypes, setFuelTypes] = useState<PowerStation["fuelType"][]>([]);
  const [zoom, setZoom] = useState(currentSearchParams.get("zoom") || 6);

  const closeSidePanel = () => {
    setSidePanelEntity(null);
    const newParams = new URLSearchParams(currentSearchParams.toString());
    newParams.delete("eip");
    window.history.pushState(null, "", `?${newParams.toString()}`);
  };

  const showSidePanelEntity = (id: string) => {
    setSidePanelEntity(id);
    async function getData() {
      if (sidePanelEntity) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/entity-info?id=${sidePanelEntity}`
        );
        const entityInfoData = await res.json();
        setSidePanelEntityInfo(entityInfoData);
      }
    }
    setSidePanelEntityInfo(null);
    getData();

    if (entities.length > 0) {
      const newParams = new URLSearchParams(currentSearchParams.toString());
      newParams.set("eip", id || "");
      window.history.pushState(null, "", `?${newParams.toString()}`);
    }
  };

  useEffect(() => {
    if (sidePanelEntity) {
      showSidePanelEntity(sidePanelEntity);
    }
  }, [sidePanelEntity]);

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

  function handleLegendClick(energyType: string) {
    const params = new URLSearchParams(currentSearchParams.toString());
    params.set('energies', energyType);
    window.history.pushState(null, "", `?${params.toString()}`);
  }

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
    const newParams = new URLSearchParams(currentSearchParams.toString());
    newParams.set("map", event.map.mapTypeId);
    window.history.pushState(null, "", `?${newParams.toString()}`);
  };

  const handleLeaderClick = (leader: Record<string, any>) => {
    setSelectedLeader(leader);
    setLeaderModalOpen(true);
  };

  return (
    <APIProvider apiKey="AIzaSyAYcsm0xB834bBAKu0GGjCu2Xzp2qLWx0o">
      <Map
        disableDefaultUI={true}
        defaultCenter={center}
        defaultZoom={6}
        zoom={Number(zoom)}
        mapId="2090f822becfb038"
        mapTypeId={currentSearchParams.get("map") || "roadmap"}
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
            showSidePanelEntity={showSidePanelEntity}
          />
        ))}

        <MapControl position={ControlPosition.TOP_LEFT}>
          <Image
            src={logo}
            alt="logo"
            className="logo"
            width={215}
            height={45}
            priority={true}
          />
          <button
            className="toggleFilterPanel"
            onClick={() => setPanelOpen(!panelOpen)}
          >
            <MenuOpenOutlinedIcon fontSize="small" />
          </button>
        </MapControl>

        <MapControl position={ControlPosition.LEFT_BOTTOM}>
          <div
            className={`fuelTypeLegend ${fuelTypes.length === 0 ? "noFuelTypes" : ""
              }`}
          >
            <FormGroup
              className="showBySize"
              title="Size points by power output"
            >
              <FormControlLabel
                label={
                  <Typography fontSize={12}>
                    Size points by power output
                  </Typography>
                }
                labelPlacement="start"
                control={
                  <StyledSwitch
                    className="showBySizeSwitch"
                    size="small"
                    checked={
                      currentSearchParams.get("show-by-power") === "true"
                    }
                    onChange={handleShowByPowerChange}
                  />
                }
              />
            </FormGroup>
            <Divider
              className="verticalDivider"
              orientation="vertical"
              flexItem
            />
            <div className="legendTitle">
              {fuelTypes.length === 0
                ? "No matching power stations"
                : "Legend:"}
            </div>
            {fuelTypes.map((fuelType) => (
              <div className="legendItem" key={fuelType.shorthand} onClick={() => handleLegendClick(fuelType.shorthand)}>
                <div
                  title={fuelType.name}
                  className="legendColor"
                  style={{
                    background: `rgba(${fuelType.rGBColor}, ${currentSearchParams.get("show-by-power") === "true"
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
          <Box className="sidePanel" sx={{ maxHeight: '100vh', overflowY: 'auto' }}>
            {sidePanelEntityInfo ? (
              <>
                <Stack direction="row" spacing={2}>
                  <Typography component="div">
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
                    <tbody>
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
                    </tbody>
                  </table>

                  {sidePanelEntityInfo.leadership && (
                    <>
                      <h3>Leadership</h3>
                      {sidePanelEntityInfo.leadership.map((leader) => (
                        
                        <div className="leadership" key={leader.id}>
                          <div className="leadershipItem"
                          onClick={() => handleLeaderClick(leader)}
                          style={{ cursor: "pointer" }}>
                            
                            <div className="leaderImgWrap">
                            {leader.image?.[0]?.url ? 
                            (
                              <img
                                src={leader.image[0].url}
                                alt={leader.name}
                                className="leaderImg"
                              />
                            ) : null}
                            </div>
                            <div className="leadershipText">
                              <span className="name">{leader.name}</span>
                              <span className="role">{leader.role}</span>
                              {leader.otherPositions && (
                                <span className="otherPositions">
                                  {leader.otherPositions}
                                </span>
                              )}
                            </div>
                            <ArrowForwardIosIcon className="leaderArrow" fontSize="small" />
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  <LeaderModal
  open={leaderModalOpen}
  leader={selectedLeader}
  onClose={() => setLeaderModalOpen(false)}
/>
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
