"use client";
import { PowerStation } from "@/types";
import Map from "@/components/map";
import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/power-stations`);
  const { powerStations } = await res.json();
  return powerStations;
}

export default function Page() {
  const pathname = usePathname();
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const [powerStations, setPowerStations] = useState<PowerStation[]>([]);
  const [filterName, setFilterName] = useState(
    currentSearchParams.get("name") ?? ""
  );
  const filteredPowerStations = powerStations.filter(({ name }) =>
    name.toLowerCase().includes(filterName.toLowerCase())
  );
  useEffect(() => {
    getData().then(setPowerStations);
  }, []);

  const updatedSearchParams = new URLSearchParams(
    currentSearchParams.toString()
  );

  const changeFilterName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(e.target.value);
    updatedSearchParams.set("name", e.target.value);
    router.push(pathname + "?" + updatedSearchParams.toString());
  };
  return (
    <main>
      <div className="mapContainer">
        <Map powerStations={filteredPowerStations} />
      </div>
      <aside>
        <label>
          Filter Name:
          <input type="text" value={filterName} onChange={changeFilterName} />
        </label>
        <table>
          <thead>
            <tr>
              <th>Power Station</th>
              <th>Latitude</th>
              <th>Longitude</th>
            </tr>
          </thead>
          <tbody>
            {filteredPowerStations.map(({ name, position }) => (
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
