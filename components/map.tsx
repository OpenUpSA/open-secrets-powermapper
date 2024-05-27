import {
  APIProvider,
  Map,
  AdvancedMarker,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import { PowerStation } from "@/types";
import { useState } from "react";

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
      >
        {powerStations.map((powerStation) => (
          <AdvancedMarker
            key={powerStation.name}
            position={powerStation.position}
          />
        ))}
      </Map>
    </APIProvider>
  );
}

export default Component;
