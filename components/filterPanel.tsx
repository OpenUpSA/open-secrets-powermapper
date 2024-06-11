import "./filterPanel.scss";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputAdornment from "@mui/material/InputAdornment";
import Slider from "@mui/material/Slider";

import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SearchIcon from "@mui/icons-material/Search";
import BoltIcon from "@mui/icons-material/Bolt";
import EventIcon from "@mui/icons-material/Event";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import CloseIcon from "@mui/icons-material/Close";

import { ItemLabel, Marks, PowerStation } from "@/types";

type Props = {
  setFilteredPowerStations: Function;
  filteredPowerStations: PowerStation[];
};

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

function truncateString(str: string, num: number) {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
}

function Component(props: Props) {
  const initialized = useRef(false);
  const { setFilteredPowerStations, filteredPowerStations } = props;

  const router = useRouter();
  const currentSearchParams = useSearchParams();

  const [powerStations, setPowerStations] = useState<PowerStation[]>([]);
  const [energyTypes, setEnergyTypes] = useState<ItemLabel>();
  const [operators, setOperators] = useState<ItemLabel>();
  const [owners, setOwners] = useState<ItemLabel>();
  const [locations, setLocations] = useState<ItemLabel>();

  const ageMarksDefault = useRef([
    {
      value: 11,
      label: "10",
    },
    {
      value: 62,
      label: "60",
    },
  ] as Marks[]);
  const [ageMarks, setAgeMarks] = useState<Marks[]>(ageMarksDefault.current);

  const ageValueDefault = (ages: Marks[]) => {
    return [ages[0].value, ages[ages.length - 1].value];
  };

  const powerOutputMarksDefault = useRef([
    {
      value: 100,
      label: "100",
    },
    {
      value: 1500,
      label: "1500",
    },
  ] as Marks[]);

  const [powerOutputMarks, setPowerOutputMarks] = useState<Marks[]>(
    powerOutputMarksDefault.current
  );

  const powerOutputValueDefault = (powerOutputs: Marks[]) => {
    return [powerOutputs[0].value, powerOutputs[powerOutputs.length - 1].value];
  };

  const handleAgeChange = (event: Event, newValue: number | number[]) => {
    const newParams = new URLSearchParams(currentSearchParams.toString());
    if (
      (newValue as number[]).join("-") === ageValueDefault(ageMarks).join("-")
    ) {
      newParams.delete("age");
    } else {
      newParams.set("age", String(newValue));
    }
    window.history.pushState(null, "", `?${newParams.toString()}`);
  };

  const handleEnergiesChange = (event: SelectChangeEvent<string[]>) => {
    const newValue = (
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    ).filter((n) => n);
    const newParams = new URLSearchParams(currentSearchParams.toString());
    if (newValue.length === 0) {
      newParams.delete("energies");
    } else {
      newParams.set("energies", newValue.join(",") as string);
    }
    window.history.pushState(null, "", `?${newParams.toString()}`);
  };

  const handleLocationsChange = (event: SelectChangeEvent<string[]>) => {
    const newValue = (
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    ).filter((n) => n);

    const newParams = new URLSearchParams(currentSearchParams.toString());
    if (newValue.length === 0) {
      newParams.delete("locations");
    } else {
      newParams.set("locations", newValue.join(",") as string);
    }
    window.history.pushState(null, "", `?${newParams.toString()}`);
  };

  const handleOperatorsChange = (event: SelectChangeEvent<string[]>) => {
    const newValue = (
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    ).filter((n) => n);
    const newParams = new URLSearchParams(currentSearchParams.toString());
    if (newValue.length === 0) {
      newParams.delete("operators");
    } else {
      newParams.set("operators", newValue.join(",") as string);
    }
    window.history.pushState(null, "", `?${newParams.toString()}`);
  };

  const handleOwnersChange = (event: SelectChangeEvent<string[]>) => {
    const newValue = (
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    ).filter((n) => n);
    const newParams = new URLSearchParams(currentSearchParams.toString());
    if (newValue.length === 0) {
      newParams.delete("owners");
    } else {
      newParams.set("owners", newValue.join(",") as string);
    }
    window.history.pushState(null, "", `?${newParams.toString()}`);
  };

  const handlePowerOutputChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    const newParams = new URLSearchParams(currentSearchParams.toString());
    if (
      (newValue as number[]).join("-") ===
      powerOutputValueDefault(powerOutputMarks).join("-")
    ) {
      newParams.delete("power");
    } else {
      newParams.set("power", String(newValue));
    }
    window.history.pushState(null, "", `?${newParams.toString()}`);
  };

  const handleShowByPowerChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const newParams = new URLSearchParams(currentSearchParams.toString());
    if (checked) {
      newParams.set("show-by-power", "true");
    } else {
      newParams.delete("show-by-power");
    }
    window.history.pushState(null, "", `?${newParams.toString()}`);
  };

  const changeNameValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(currentSearchParams.toString());
    if (e.target.value === "") {
      newParams.delete("name");
    } else {
      newParams.set("name", e.target.value);
    }
    window.history.pushState(null, "", `?${newParams.toString()}`);
  };

  useEffect(() => {
    const nameParam = currentSearchParams.get("name")?.toLowerCase() || "";
    const regionParam = currentSearchParams.get("locations")?.split(",") || [];
    const fuelTypeParam = currentSearchParams.get("energies")?.split(",") || [];
    const operatorParam =
      currentSearchParams.get("operators")?.split(",") || [];
    const ownerParam = currentSearchParams.get("owners")?.split(",") || [];
    const powerParam = currentSearchParams.get("power")?.split(",").map(Number);
    const ageParam = currentSearchParams.get("age")?.split(",").map(Number);

    setFilteredPowerStations(
      powerStations.filter(
        (station) =>
          station.name.toLowerCase().includes(nameParam) &&
          (regionParam.length === 0 ||
            regionParam.includes(station.region.name)) &&
          (fuelTypeParam.length === 0 ||
            fuelTypeParam.includes(station.fuelType.shorthand)) &&
          (operatorParam.length === 0 ||
            operatorParam.includes(station.operator?.name || "")) &&
          (ownerParam.length === 0 ||
            ownerParam.includes(station.owner?.name || "")) &&
          (!powerParam ||
            !station.powerOutput ||
            (station.powerOutput >= powerParam[0] &&
              station.powerOutput <= powerParam[1])) &&
          (!ageParam ||
            (station.age.years >= ageParam[0] &&
              station.age.years <= ageParam[1]))
      )
    );
  }, [currentSearchParams, powerStations, setFilteredPowerStations]);

  const clearFilters = () => {
    const newParams = new URLSearchParams(currentSearchParams.toString());
    newParams.delete("name");
    newParams.delete("locations");
    newParams.delete("energies");
    newParams.delete("operators");
    newParams.delete("owners");
    newParams.delete("age");
    newParams.delete("power");
    window.history.pushState(null, "", `?${newParams.toString()}`);
  };

  const removeFilter = (filter: string[]) => {
    const newParams = new URLSearchParams(currentSearchParams.toString());
    switch (filter[0]) {
      case "name":
        newParams.delete("name");
        break;

      case "energy":
        const newEnergies = currentSearchParams
          .get("energies")
          ?.split(",")
          .filter((item) => item !== filter[1]);
        if (newEnergies && newEnergies.length > 0) {
          newParams.set("energies", newEnergies.join(","));
        } else {
          newParams.delete("energies");
        }
        break;

      case "operator":
        const newOperators = currentSearchParams
          .get("operators")
          ?.split(",")
          .filter((item) => item !== filter[1]);
        if (newOperators && newOperators.length > 0) {
          newParams.set("operators", newOperators.join(","));
        } else {
          newParams.delete("operators");
        }
        break;
      case "owner":
        const newOwners = currentSearchParams
          .get("owners")
          ?.split(",")
          .filter((item) => item !== filter[1]);
        if (newOwners && newOwners.length > 0) {
          newParams.set("owners", newOwners.join(","));
        } else {
          newParams.delete("owners");
        }
        break;

      case "location":
        const newLocations = currentSearchParams
          .get("locations")
          ?.split(",")
          .filter((item) => item !== filter[1]);
        if (newLocations) {
          newParams.set("locations", newLocations.join(","));
        } else {
          newParams.delete("locations");
        }
        break;

      case "power":
        newParams.delete("power");
        break;

      case "age":
        newParams.delete("age");
        break;
    }
    window.history.pushState(null, "", `?${newParams.toString()}`);
  };

  const getLabelForFilter = (filter: string[]) => {
    switch (filter[0]) {
      case "name":
        return filter[1];
      case "energy":
        return energyTypes
          ? energyTypes[filter[1] as keyof typeof energyTypes].label
          : "...";
      case "operator":
        return operators
          ? operators[filter[1] as keyof typeof operators].label
          : "...";
      case "owner":
        return owners ? owners[filter[1] as keyof typeof owners].label : "...";
      case "location":
        return locations
          ? locations[filter[1] as keyof typeof locations].label
          : "...";
      case "power":
        return `Output: ${filter[1]} MW`;
      case "age":
        return `Age: ${filter[1]} years`;
      default:
        return "...";
    }
  };

  useEffect(() => {
    async function getData() {
      initialized.current = true;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/power-stations`
      );
      const powerStationsData = await res.json();
      setPowerStations(powerStationsData.powerStations);

      const energyTypesData = powerStationsData.powerStations.reduce(
        (acc: ItemLabel, cur: PowerStation) => {
          if (cur.fuelType) {
            acc[cur.fuelType.shorthand] = { label: cur.fuelType.name };
          }
          return acc;
        },
        {} as ItemLabel
      );
      setEnergyTypes(energyTypesData);

      const operatorsData = powerStationsData.powerStations.reduce(
        (acc: ItemLabel, cur: PowerStation) => {
          if (cur.operator) {
            acc[cur.operator.name] = { label: cur.operator.name };
          }
          return acc;
        },
        {} as ItemLabel
      );
      setOperators(operatorsData);

      const ownersData = powerStationsData.powerStations.reduce(
        (acc: ItemLabel, cur: PowerStation) => {
          if (cur.owner) {
            acc[cur.owner.name] = { label: cur.owner.name };
          }
          return acc;
        },
        {} as ItemLabel
      );
      setOwners(ownersData);

      const locationsData = powerStationsData.powerStations.reduce(
        (acc: ItemLabel, cur: PowerStation) => {
          if (cur.region) {
            acc[cur.region.name] = { label: cur.region.name };
          }
          return acc;
        },
        {} as ItemLabel
      );
      setLocations(locationsData);

      const minPowerOutput = Math.min(
        ...powerStationsData.powerStations
          .filter((station: PowerStation) => station.powerOutput)
          .map((station: PowerStation) => station.powerOutput)
      );
      const maxPowerOutput = Math.max(
        ...powerStationsData.powerStations
          .filter((station: PowerStation) => station.powerOutput)
          .map((station: PowerStation) => station.powerOutput)
      );
      const powerOutputMarksData = [
        { value: minPowerOutput, label: minPowerOutput.toString() },
        { value: maxPowerOutput, label: maxPowerOutput.toString() },
      ];
      setPowerOutputMarks(powerOutputMarksData);

      const minAge = Math.min(
        ...powerStationsData.powerStations.map(
          (station: PowerStation) => station.age?.years || 0
        )
      );
      const maxAge = Math.max(
        ...powerStationsData.powerStations.map(
          (station: PowerStation) => station.age?.years || 0
        )
      );
      const ageMarksData = [
        { value: minAge, label: minAge.toString() },
        { value: maxAge, label: maxAge.toString() },
      ];
      ageMarksDefault.current = ageMarksData;
      setAgeMarks(ageMarksData);
    }

    if (!initialized.current) {
      getData();
    }
  }, [powerStations, currentSearchParams]);

  const chipFilters = (): string[][] => {
    const newFilters: string[][] = [];

    if (currentSearchParams.get("name")) {
      newFilters.push(["name", currentSearchParams.get("name") as string]);
    }

    currentSearchParams
      .get("energies")
      ?.split(",")
      .filter((energy) => energy !== "")
      .forEach((energy) => {
        newFilters.push(["energy", energy]);
      });

    currentSearchParams
      .get("operators")
      ?.split(",")
      .filter((operator) => operator !== "")
      .forEach((operator) => {
        newFilters.push(["operator", operator]);
      });

    currentSearchParams
      .get("owners")
      ?.split(",")
      .filter((owner) => owner !== "")
      .forEach((owner) => {
        newFilters.push(["owner", owner]);
      });

    currentSearchParams
      .get("locations")
      ?.split(",")
      .filter((location) => location !== "")
      .forEach((location) => {
        newFilters.push(["location", location]);
      });

    if (currentSearchParams.get("power")) {
      newFilters.push([
        "power",
        currentSearchParams.get("power")?.split(",").join(" - ") as string,
      ]);
    }

    if (currentSearchParams.get("age")) {
      newFilters.push([
        "age",
        currentSearchParams.get("age")?.split(",").join(" - ") as string,
      ]);
    }
    return newFilters;
  };

  return (
    <Stack spacing={2} className="filterPanel">
      <Stack alignItems="center" direction="row" gap={2}>
        <FilterAltOutlinedIcon color="primary" />
        <Typography
          className="title"
          variant="h1"
          component="h2"
          fontSize={14}
          fontWeight={600}
        >
          Filter and search
        </Typography>
      </Stack>
      <Divider />
      <Stack alignItems="center" direction="row" gap={2}>
        <Typography
          className="currentlyActiveFiltersTitle"
          variant="h2"
          component="h3"
          fontSize={12}
        >
          Currently active filters
        </Typography>
        <button
          onClick={clearFilters}
          disabled={chipFilters().length === 0}
          className="clearAllButton"
        >
          Clear all
        </button>
      </Stack>
      <div className="chipList">
        {chipFilters().map((filter, index) => (
          <div
            key={index}
            className="chipFilter"
            title={getLabelForFilter(filter)}
            onClick={() => {
              removeFilter(filter);
            }}
          >
            <Stack alignItems="center" direction="row" gap={0.5}>
              <span className="chipTitle">
                {truncateString(getLabelForFilter(filter), 35)}
              </span>
              <CloseIcon className="closeIcon" fontSize="small" />
            </Stack>
          </div>
        ))}
        {chipFilters().length === 0 && (
          <div className="chipFilter">
            <Stack alignItems="center" direction="row" gap={0.5}>
              <span className="chipTitle">No filters applied</span>
            </Stack>
          </div>
        )}
      </div>
      <Typography
        className="filerOptionsTitle"
        variant="h2"
        component="h3"
        fontSize={12}
      >
        Filter options
      </Typography>
      <TextField
        id="name"
        label="Name search"
        value={currentSearchParams.get("name") || ""}
        onChange={changeNameValue}
        placeholder="Enter a station name"
        size="small"
        InputProps={{
          className: "is-padding-0-5em",
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
      <FormControl fullWidth>
        <InputLabel size="small" id="energies-label">
          Energy type
        </InputLabel>
        <Select
          
          labelId="energies-label"
          id="energies"
          label="Energy type"
          value={currentSearchParams.get("energies")?.split(",") || [""]}
          onChange={handleEnergiesChange}
          multiple
        >
          <MenuItem value={""}>Select energy type(s)</MenuItem>
          {energyTypes &&
            Object.entries(energyTypes).map(([value, { label }]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="operators-label" size="small">
          Operator
        </InputLabel>
        <Select
          labelId="operators-label"
          id="operators"
          label="Energy type"
          value={currentSearchParams.get("operators")?.split(",") || [""]}
          onChange={handleOperatorsChange}
          multiple
        >
          <MenuItem value={""}>Select operator(s)</MenuItem>
          {operators &&
            Object.entries(operators).map(([value, { label }]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="owners-label" size="small">
          Owner
        </InputLabel>
        <Select
          labelId="owners-label"
          id="owners"
          label="Owners"
          value={currentSearchParams.get("owners")?.split(",") || [""]}
          onChange={handleOwnersChange}
          multiple
        >
          <MenuItem value={""}>Select owner(s)</MenuItem>
          {owners &&
            Object.entries(owners).map(([value, { label }]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel size="small" id="locations-label">
          Location
        </InputLabel>
        <Select
          labelId="locations-label"
          id="locations"
          value={currentSearchParams.get("locations")?.split(",") || [""]}
          onChange={handleLocationsChange}
          multiple
          label="Select province(s)"
        >
          <MenuItem value={""}>Select province(s)</MenuItem>
          {locations &&
            Object.entries(locations).map(([value, { label }]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <Stack alignItems="center" direction="row" gap={2}>
          <BoltIcon fontSize="small" />
          <Typography fontSize="small" gutterBottom>
            Filter by power output (MW):
          </Typography>
        </Stack>
        <Slider
          size="small"
          id="power-output"
          value={
            currentSearchParams.get("power")?.split(",").map(Number) || [
              powerOutputMarks[0].value,
              powerOutputMarks[powerOutputMarks.length - 1].value,
            ]
          }
          onChange={handlePowerOutputChange}
          min={powerOutputValueDefault(powerOutputMarks)[0]}
          max={powerOutputValueDefault(powerOutputMarks)[1]}
          step={100}
          marks={powerOutputMarks}
        />
      </FormControl>
      <FormControl fullWidth>
        <Stack alignItems="center" direction="row" gap={2}>
          <EventIcon fontSize="small" />
          <Typography fontSize="small" gutterBottom>
            Filter by age:
          </Typography>
        </Stack>
        <Slider
          size="small"
          id="age"
          value={
            currentSearchParams.get("age")?.split(",").map(Number) || [
              ageMarks[0].value,
              ageMarks[ageMarks.length - 1].value,
            ]
          }
          onChange={handleAgeChange}
          min={ageValueDefault(ageMarks)[0]}
          max={ageValueDefault(ageMarks)[1]}
          step={5}
          marks={ageMarks}
        />
      </FormControl>

      <FormGroup>
        <FormControlLabel
          label={<Typography fontSize={12}>Show by power output</Typography>}
          control={
            <Switch
              size="small"
              checked={currentSearchParams.get("show-by-power") === "true"}
              onChange={handleShowByPowerChange}
            />
          }
        />
      </FormGroup>
    </Stack>
  );
}

export default Component;
