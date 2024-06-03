import "./index.scss";
import {
  Marker,
  AdvancedMarkerRef,
  InfoWindow,
  useMarkerRef,
  AdvancedMarker,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { PowerStation } from "@/types";
import { useState } from "react";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useSearchParams } from "next/navigation";

type Props = {
  powerStation: PowerStation;
};

export function PowerStationMarker({ powerStation }: Props) {
  const [markerRef, marker] = useMarkerRef();
  const [advandedMarkerRef, advancedMarker] = useAdvancedMarkerRef();
  const currentSearchParams = useSearchParams();

  const [isHoverOpen, setHoverIsOpen] = useState(false);
  const [isMoreOpen, setMoreIsOpen] = useState(false);

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
  };

  const calcPowerStationSize = (factor: number, powerOutput?: number) => {
    return Math.min(Math.max(((powerOutput || 100) * 2) / factor, 10), 100);
  };

  return (
    <>
      {currentSearchParams.get("show-by-power") ? (
        <AdvancedMarker
          position={powerStation.position}
          onClick={toggleMoreInfoWindow}
          ref={advandedMarkerRef}
        >
          <div
            onMouseOver={showHoverInfoWindow}
            onMouseOut={hideHoverInfoWindow}
            style={{
              width: calcPowerStationSize(100, powerStation.powerOutput),
              height: calcPowerStationSize(100, powerStation.powerOutput),
              position: "absolute",
              top: 0,
              left: 0,
              background: "rgba(0, 0, 0, 0.5)",
              border: "2px solid #ccc",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
            }}
          ></div>
        </AdvancedMarker>
      ) : (
        <Marker
          position={powerStation.position}
          onClick={toggleMoreInfoWindow}
          ref={markerRef}
          onMouseOver={showHoverInfoWindow}
          onMouseOut={hideHoverInfoWindow}
        />
      )}

      {isHoverOpen && (
        <InfoWindow
          anchor={marker || advancedMarker}
          onCloseClick={hideHoverInfoWindow}
          className="powerStationHoverInfo"
          pixelOffset={[
            0,
            -calcPowerStationSize(200, powerStation.powerOutput),
          ]}
        >
          <div>
            <Typography variant="h1" component="h1">
              {powerStation.name}
            </Typography>
            <p>
              <Chip
                label={powerStation.fuelType.name}
                variant="filled"
                size="small"
              />
              {powerStation.powerOutput} MW
            </p>
            <p>{powerStation.operator?.name}</p>
          </div>
        </InfoWindow>
      )}
      {isMoreOpen && (
        <InfoWindow
          anchor={marker || advancedMarker}
          onCloseClick={hideMoreInfoWindow}
          className="powerStationMoreInfo"
          pixelOffset={[
            0,
            -(powerStation.powerOutput ? powerStation.powerOutput : 0) / 200,
          ]}
        >
          <div>
            <Stack alignItems="center" direction="row" gap={2}>
              <Typography variant="h1" component="h1">
                {powerStation.name}
              </Typography>
              <Button
                size="small"
                onClick={hideMoreInfoWindow}
                sx={{ marginLeft: "auto" }}
              >
                X
              </Button>
            </Stack>
            <table>
              <tbody>
                <tr>
                  <td>Type:</td>
                  <td>
                    <Chip
                      label={powerStation.fuelType.name}
                      variant="filled"
                      size="small"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Location:</td>
                  <td>{powerStation.region.name}</td>
                </tr>
                <tr>
                  <td>GPS:</td>
                  <td>
                    {powerStation.position.lat}, {powerStation.position.lng}
                  </td>
                </tr>
                {powerStation.operator && (
                  <tr>
                    <td>Operator:</td>
                    <td>{powerStation.operator?.name}</td>
                  </tr>
                )}
                <tr>
                  <td>Power Output:</td>
                  <td>{powerStation.powerOutput} MW</td>
                </tr>
                {powerStation.age.commissionStart &&
                  powerStation.age.commissionEnd && (
                    <tr>
                      <td>Commissioned:</td>
                      <td>
                        {new Date(
                          powerStation.age.commissionStart
                        ).getFullYear()}{" "}
                        -
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
                        ).getFullYear()}{" "}
                        -
                        {new Date(
                          powerStation.age.decommissionEnd
                        ).getFullYear()}
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
