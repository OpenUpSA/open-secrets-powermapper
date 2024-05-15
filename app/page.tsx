import { PowerStation } from "@/types";
async function getData() {
  const res = await fetch(`${process.env.URL}/api/power-stations`);
  const { powerStations } = await res.json();
  return powerStations;
}

export default async function Page() {
  const powerStations: PowerStation[] = await getData();
  return (
    <main>
      <table>
        <thead>
          <tr>
            <th>Power Station</th>
            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
        </thead>
        <tbody>
          {powerStations.map(
            ({ name, fuelType, country, region, latitude, longitude }) => (
              <tr key={name}>
                <td>{name}</td>
                <td>{latitude}</td>
                <td>{longitude}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </main>
  );
}
