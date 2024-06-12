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
import Image from "next/image";

type Props = {
  powerStation: PowerStation;
  setSidePanelEntity: Function;
};

export function PowerStationMarker({
  powerStation,
  setSidePanelEntity,
}: Props) {
  const [advandedMarkerRef, advancedMarker] = useAdvancedMarkerRef();
  const currentSearchParams = useSearchParams();

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
          className={`powerStationMarker ${
            currentSearchParams.get("show-by-power") === "true" && "byPower"
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
            background: `rgba(${powerStation.fuelType.rGBColor}, ${
              currentSearchParams.get("show-by-power") === "true" ? 0.6 : 1
            })`,
          }}
        ></div>
      </AdvancedMarker>

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
            className={`infowindowContent ${
              powerStation.images ? "" : "noImage"
            }`}
          >
            <Stack alignItems="center" direction="row" gap={1}>
              {powerStation.images && powerStation.images.large && (
                <Image
                  src={powerStation.images.large.url}
                  alt={powerStation.name}
                  width="48"
                  height="48"
                  className="photograph"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                {powerStation.operator && <p>{powerStation.operator.name}</p>}
                {powerStation.owner &&
                  powerStation.operator &&
                  powerStation.operator.name !== powerStation.owner.name && (
                    <p>{powerStation.owner.name}</p>
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
              src={powerStation.images.full.url}
              alt={powerStation.name}
              width={powerStation.images.full.width}
              height={powerStation.images.full.height}
            />
          )}
          <div
            className={`infowindowContent ${
              powerStation.images ? "" : "noImage"
            }`}
          >
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
                {powerStation.operator && (
                  <tr>
                    <td>Operator:</td>
                    <td>
                      <a
                        onClick={() =>
                          setSidePanelEntity(powerStation.operator)
                        }
                        className="entityButton"
                      >
                        {powerStation.operator.name}
                      </a>
                    </td>
                  </tr>
                )}
                {powerStation.owner && (
                  <tr>
                    <td>Owner:</td>
                    <td>
                      <a
                        onClick={() => setSidePanelEntity(powerStation.owner)}
                        className="entityButton"
                      >
                        {powerStation.owner.name}
                      </a>
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
          </div>
        </InfoWindow>
      )}
    </>
  );
}
