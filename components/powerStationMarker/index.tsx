import "./index.scss";
import { Marker, InfoWindow, useMarkerRef } from "@vis.gl/react-google-maps";
import { PowerStation } from "@/types";
import { useState } from "react";
import { Chip } from "@mui/material";

type Props = {
  powerStation: PowerStation;
};

export function PowerStationMarker({ powerStation }: Props) {
  const [markerRef, marker] = useMarkerRef();

  const [isOpen, setIsOpen] = useState(false);

  const showInfoWindow = () => {
    setIsOpen(true);
  };

  const hideInfoWindow = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Marker
        ref={markerRef}
        position={powerStation.position}
        title={powerStation.name}
        onMouseOver={showInfoWindow}
        onMouseOut={hideInfoWindow}
      />
      {isOpen && (
        <InfoWindow
          anchor={marker}
          onCloseClick={hideInfoWindow}
          className="powerStationHoverInfo"
        >
          <div>
            <h1>{powerStation.name}</h1>
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
    </>
  );
}
