"use client";
import { PowerStation } from "@/types";
import Map from "@/components/map";
import { useEffect, useState } from "react";

async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/power-stations`);
  const { powerStations } = await res.json();
  return powerStations;
}

export default function Page() {
  const [powerStations, setPowerStations] = useState<PowerStation[]>([]);
  useEffect(() => {
    getData().then(setPowerStations);
  }, []);
  return (
    <main>
      <div className="mapContainer"
        
      >
        <Map powerStations={powerStations} />
      </div>
      <aside>
        <table>
          <thead>
            <tr>
              <th>Power Station</th>
              <th>Latitude</th>
              <th>Longitude</th>
            </tr>
          </thead>
          <tbody>
            {powerStations.map(({ name, position }) => (
              <tr key={name}>
                <td>{name}</td>
                <td>{position.lat}</td>
                <td>{position.lng}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </aside>
    </main>
  );
}
