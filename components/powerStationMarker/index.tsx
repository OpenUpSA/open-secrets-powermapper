import "./index.scss";
import { Marker, InfoWindow, useMarkerRef } from "@vis.gl/react-google-maps";
import { PowerStation } from "@/types";
import { useState } from "react";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

type Props = {
  powerStation: PowerStation;
};

export function PowerStationMarker({ powerStation }: Props) {
  const [markerRef, marker] = useMarkerRef();

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

  const hideMoreInfoWindow = () => {
    setMoreIsOpen(false);
  };

  return (
    <>
      <Marker
        ref={markerRef}
        position={powerStation.position}
        title={powerStation.name}
        onMouseOver={showHoverInfoWindow}
        onMouseOut={hideHoverInfoWindow}
        onClick={showMoreInfoWindow}
      />
      {isHoverOpen && (
        <InfoWindow
          anchor={marker}
          onCloseClick={hideHoverInfoWindow}
          className="powerStationHoverInfo"
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
          anchor={marker}
          onCloseClick={hideMoreInfoWindow}
          className="powerStationMoreInfo"
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
                <tr>
                  <td>Operator:</td>
                  <td>{powerStation.operator?.name}</td>
                </tr>
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
