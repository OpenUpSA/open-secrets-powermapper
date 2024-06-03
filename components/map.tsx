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

  const powerStationFuelTypeColor = (fuelType: string, opacity: number) => {
    switch (fuelType) {
      case "Coal":
        return `rgba(151, 151, 151, ${opacity})`;
      case "PSH":
        return `rgba(131, 74, 255, ${opacity})`;
      case "Hydro":
        return `rgba(38, 184, 255, ${opacity})`;
      case "OCGT":
        return `rgba(237, 61, 198, ${opacity})`;
      case "Nuclear":
        return `rgba(255, 255, 255, ${opacity})`;
      case "Wind":
        return `rgba(87, 219, 91, ${opacity})`;
      case "CSP":
        return `rgba(255, 85, 31, ${opacity})`;
      case "Solar PV":
        return `rgba(255, 204, 20, ${opacity})`;
      default:
        return `rgba(0, 0, 0, ${opacity})`;
    }
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
            powerStationFuelTypeColor={powerStationFuelTypeColor}
          />
        ))}
      </Map>
    </APIProvider>
  );
}

export default Component;
