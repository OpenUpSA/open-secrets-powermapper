import "./map.scss";
import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
  MapControl,
  ControlPosition,
} from "@vis.gl/react-google-maps";
import { PowerStation } from "@/types";
import { useEffect, useState } from "react";

import { PowerStationMarker } from "@/components/powerStationMarker/index";
import { useSearchParams } from "next/navigation";

import SVG from "react-inlinesvg";

type Props = {
  powerStations: PowerStation[];
};

function Component({ powerStations }: Props) {
  const defaultCenter = { lat: -29.01886710220426, lng: 26.096035496567033 };
  const [center, setCenter] = useState(defaultCenter);
  const currentSearchParams = useSearchParams();

  const [fuelTypes, setFuelTypes] = useState<PowerStation["fuelType"][]>([]);

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

        <MapControl position={ControlPosition.LEFT_BOTTOM}>
          <div className="fuelTypeLegend">
            <div className="legendTitle">Legend</div>
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
      </Map>
    </APIProvider>
  );
}

export default Component;
