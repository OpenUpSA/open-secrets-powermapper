import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
  MapControl,
  ControlPosition,
} from "@vis.gl/react-google-maps";
import { PowerStation } from "@/types";
import { useState } from "react";

import { PowerStationMarker } from "@/components/powerStationMarker/index";

function Component({ powerStations }: { powerStations: PowerStation[] }) {
  const defaultCenter = { lat: -29.01886710220426, lng: 26.096035496567033 };
  const [center, setCenter] = useState(defaultCenter);

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
          position: 9,
        }}
      >
        {powerStations.map((powerStation) => (
          <PowerStationMarker
            key={powerStation.id}
            powerStation={powerStation}
          />
        ))}
      </Map>
    </APIProvider>
  );
}

export default Component;
