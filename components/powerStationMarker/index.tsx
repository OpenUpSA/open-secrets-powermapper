import "./index.scss";
import {
  InfoWindow,
  AdvancedMarker,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { PowerStation } from "@/types";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';


import { Image } from '@imagekit/next';

type Props = {
  powerStation: PowerStation;
  showSidePanelEntity: Function;
};

export function PowerStationMarker({
  powerStation,
  showSidePanelEntity,
}: Props) {
  const [advandedMarkerRef, advancedMarker] = useAdvancedMarkerRef();
  const currentSearchParams = useSearchParams();

  const [tab, setTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const [isHoverOpen, setHoverIsOpen] = useState(false);
  const [isMoreOpen, setMoreIsOpen] = useState(
    currentSearchParams.get("psiw")?.split(",").includes(powerStation.id)
  );

  const showHoverInfoWindow = () => {
    if (!isMoreOpen) {
      setHoverIsOpen(true);
    }
  };

  const hideHoverInfoWindow = () => {
    setHoverIsOpen(false);
  };

  const showMoreInfoWindow = () => {
    hideHoverInfoWindow();
    setMoreIsOpen(true);
    const newParams = new URLSearchParams(currentSearchParams.toString());
    const powerStationIds = newParams.get("psiw")?.split(",");
    const newPowerStationIds = powerStationIds
      ? [...powerStationIds, powerStation.id]
      : [powerStation.id];
    newParams.set("psiw", newPowerStationIds.join(","));
    window.history.pushState(null, "", `?${newParams.toString()}`);
  };

  const toggleMoreInfoWindow = () => {
    if (isMoreOpen) {
      hideMoreInfoWindow();
    } else {
      showMoreInfoWindow();
    }
  };

  const hideMoreInfoWindow = () => {
    setMoreIsOpen(false);
    const newParams = new URLSearchParams(currentSearchParams.toString());
    const powerStationIds = newParams.get("psiw")?.split(",");
    const newPowerStationIds = powerStationIds?.filter(
      (id) => id !== powerStation.id
    );

    if (newPowerStationIds && newPowerStationIds.length > 0) {
      newParams.set("psiw", newPowerStationIds.join(","));
    } else {
      newParams.delete("psiw");
    }
    window.history.pushState(null, "", `?${newParams.toString()}`);
  };

  const calcPowerStationSize = (factor: number, powerOutput?: number) => {
    return Math.min(Math.max(((powerOutput || 100) * 2) / factor, 8), 100);
  };



  return (
    <>
      <AdvancedMarker
        position={powerStation.position}
        onClick={toggleMoreInfoWindow}
        ref={advandedMarkerRef}
      >
        <div
          className={`powerStationMarker ${currentSearchParams.get("show-by-power") === "true" && "byPower"
            }`}
          onMouseOver={showHoverInfoWindow}
          onMouseOut={hideHoverInfoWindow}
          style={{
            width:
              currentSearchParams.get("show-by-power") === "true"
                ? calcPowerStationSize(100, powerStation.powerOutput)
                : 12,
            height:
              currentSearchParams.get("show-by-power") === "true"
                ? calcPowerStationSize(100, powerStation.powerOutput)
                : 12,
            background: `rgba(${powerStation.fuelType.rGBColor}, ${currentSearchParams.get("show-by-power") === "true" ? 0.6 : 1
              })`,
          }}
        ></div>
      </AdvancedMarker>
      {/* Following preloads the power station thumbnails */}
      {powerStation.images && powerStation.images.full && (
        <Image
          urlEndpoint="https://ik.imagekit.io/powermapper/"
          src={`powerstations/full_${powerStation.images.full.filename}`}
          alt={powerStation.name}
          width="48"
          height="48"
          className="photograph"
          loading="eager"
          transformation={[{ width: 48, height: 48, quality: 100, format: 'webp' }]}
          responsive={false}
          style={{ position: "fixed", top: 0, right: 0, pointerEvents: "none", opacity: 0 }}
        />
      )}
      {/* Following preloads the power station larger images */}
      {powerStation.images && powerStation.images.full && (
        <Image
          urlEndpoint="https://ik.imagekit.io/powermapper/"
          src={`powerstations/full_${powerStation.images.full.filename}`}
          alt={powerStation.name}
          className="photograph"
          loading="eager"
          width={powerStation.images.full.width}
          height={powerStation.images.full.height}
          transformation={[{ width: 310, quality: 75, format: 'webp' }]}
          responsive={false}
          style={{ position: "fixed", top: 0, right: 0, pointerEvents: "none", opacity: 0 }}
        />
      )}
      {isHoverOpen && (
        <InfoWindow
          anchor={advancedMarker}
          onCloseClick={hideHoverInfoWindow}
          className="powerStationHoverInfo"
          pixelOffset={[
            0,
            currentSearchParams.get("show-by-power") === "true"
              ? -calcPowerStationSize(200, powerStation.powerOutput)
              : -4,
          ]}
        >
          <div
            className={`infowindowContent ${powerStation.images ? "" : "noImage"
              }`}
          >
            <Stack alignItems="center" direction="row" gap={1}>
              {powerStation.images && powerStation.images.large && (
                <Image
                  urlEndpoint="https://ik.imagekit.io/powermapper/"
                  src={`powerstations/full_${powerStation.images.full.filename}`}
                  alt={powerStation.name}
                  width="48"
                  height="48"
                  className="photograph"
                  loading="eager"
                  transformation={[{ width: 48, height: 48, quality: 100, format: 'webp' }]}
                  responsive={false}
                />
              )}
              <div>
                <h1 className="name">{powerStation.name}</h1>
                {powerStation.powerOutput && (
                  <p>
                    <span className="fuelType">
                      {powerStation.fuelType.name}
                    </span>
                    {powerStation.powerOutput} MW
                  </p>
                )}
                {powerStation.operator && powerStation.operator.length > 0 && (
                  <p>{powerStation.operator.map(op => op.name).join(", ")}</p>
                )}
                {powerStation.owner && powerStation.owner.length > 0 && (
                  <p>{powerStation.owner.map(ow => ow.name).join(", ")}</p>
                )}
              </div>
            </Stack>
          </div>
        </InfoWindow>
      )}
      {isMoreOpen && (
        <InfoWindow
          anchor={advancedMarker}
          onCloseClick={hideMoreInfoWindow}
          className="powerStationMoreInfo"
          pixelOffset={[
            0,
            -(powerStation.powerOutput ? powerStation.powerOutput : 0) / 200,
          ]}
        >
          {powerStation.images && powerStation.images.full && (
            <Image
              className="photograph"
              urlEndpoint="https://ik.imagekit.io/powermapper/"
              src={`powerstations/full_${powerStation.images.full.filename}`}
              alt={powerStation.name}
              width={powerStation.images.full.width}
              height={powerStation.images.full.height}
              transformation={[{ width: 310, quality: 75, format: 'webp' }]}
              responsive={false}
            />
          )}
          <div
            className={`infowindowContent ${powerStation.images ? "" : "noImage"
              }`}
          >
            <Box sx={{ width: '100%' }} className="marker-box-container">
              <Stack alignItems="center" direction="row" gap={2}>
                <Typography className="name" variant="h1" component="h1">

                  {powerStation.name}

                </Typography>
                <button
                  className="moreInfoWindowCloseButton"
                  onClick={hideMoreInfoWindow}
                >
                  <CloseIcon fontSize="medium" />
                </button>
              </Stack>
              <Tabs value={tab} onChange={handleTabChange}>
                <Tab label="About" />
                <Tab label="Controversies" />
              </Tabs>
              <Box sx={{ backgroundColor: '#fff', padding: '1em' }}>
                {tab === 0 && (
                  <>
                    <table>
                      <tbody>
                        <tr>
                          <td>Type:</td>
                          <td>{powerStation.fuelType.name}</td>
                        </tr>
                        <tr>
                          <td>Location:</td>
                          <td>{powerStation.region.name}</td>
                        </tr>
                        <tr>
                          <td>GPS:</td>
                          <td>
                            {powerStation.position.lat.toFixed(5)},{" "}
                            {powerStation.position.lng.toFixed(5)}
                          </td>
                        </tr>
                        {powerStation.operator && powerStation.operator.length > 0 && (
                          <tr>
                            <td>Operator:</td>
                            <td>
                              
                                <span>
                                  {powerStation.operator.map((operator, idx) => (
                                    <span key={operator.id}>
                                      <a
                                        href="#"
                                        onClick={() => showSidePanelEntity(operator?.id)}
                                      >
                                        {operator.name}
                                      </a>
                                      {idx < powerStation.operator!.length - 1 && ', '}
                                    </span>
                                  ))}
                                </span>
                             
                            </td>
                          </tr>
                        )}
                        {powerStation.owner && powerStation.owner.length > 0 && (
                          <tr>
                            <td>Owner:</td>
                            <td>
                            
                                <span>
                                  {powerStation.owner.map((owner, idx) => (
                                    <span key={owner.id}>
                                      <a
                                        href="#"
                                        onClick={() => showSidePanelEntity(owner?.id)}
                                      >
                                        {owner.name}
                                      </a>
                                      {idx < powerStation.owner!.length - 1 && ', '}
                                    </span>
                                  ))}
                                </span>
                              
                            </td>
                          </tr>
                        )}

                        {powerStation.powerOutput && (
                          <tr>
                            <td>Power Output:</td>
                            <td>{powerStation.powerOutput} MW</td>
                          </tr>
                        )}
                        {powerStation.age.commissionStart &&
                          powerStation.age.commissionEnd && (
                            <tr>
                              <td>Commissioned:</td>
                              <td>
                                {new Date(
                                  powerStation.age.commissionStart
                                ).getFullYear()}
                                &ndash;
                                {new Date(powerStation.age.commissionEnd).getFullYear()}
                              </td>
                            </tr>
                          )}
                        {powerStation.age.decommissionStart &&
                          powerStation.age.decommissionEnd && (
                            <tr>
                              <td>Decommissioned:</td>
                              <td>
                                {new Date(
                                  powerStation.age.decommissionStart
                                ).getFullYear()}
                                &ndash;
                                {new Date(
                                  powerStation.age.decommissionEnd
                                ).getFullYear()}
                              </td>
                            </tr>
                          )}
                        {powerStation.description && (
                          <tr>
                            <td colSpan={2} className="description">
                              {powerStation.description}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </>
                )}
                {tab === 1 && (
                  <>{powerStation.controversies}</>
                )}
              </Box>
            </Box>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
