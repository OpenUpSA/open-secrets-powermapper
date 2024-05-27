import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputAdornment from "@mui/material/InputAdornment";
import Slider from "@mui/material/Slider";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import BoltIcon from "@mui/icons-material/Bolt";
import EventIcon from "@mui/icons-material/Event";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";

import { PowerStation } from "@/types";

type Props = {
  setFilteredPowerStations: Function;
};

type Marks = {
  value: number;
  label: string;
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

  const currentSearchParams = useSearchParams();

  const energyTypes = {
    coal: { label: "Coal" },
    solar: { label: "Solar" },
    wind: { label: "Wind" },
  };
  const operators = {
    eskom: { label: "Eskom" },
    dingan: { label: "Dingan" },
    matt: { label: "Matt's Energy" },
  };
  const locations = {
    kzn: { label: "KwaZulu-Natal" },
    fs: { label: "Free State" },
    gp: { label: "Gauteng" },
  };

  const [powerStations, setPowerStations] = useState<PowerStation[]>([]);

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
  const [ageValue, setAgeValue] = useState<number[]>([
    ageMarks[0].value,
    ageMarks[ageMarks.length - 1].value,
  ]);

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
  const [powerOutputValue, setPowerOutputValue] = useState<number[]>([
    powerOutputMarks[0].value,
    powerOutputMarks[powerOutputMarks.length - 1].value,
  ]);

  const [locationsValue, setLocationsValue] = useState<string[]>([""]);
  const [energiesValue, setEnergiesValue] = useState<string[]>([""]);
  const [operatorsValue, setOperatorsValue] = useState<string[]>([""]);
  const [nameValue, setNameValue] = useState("");
  const [filters, setFilters] = useState<string[][]>([]);

  const handleAgeChange = (event: Event, newValue: number | number[]) => {
    setAgeValue(newValue as number[]);
    if (
      (newValue as number[]).join("-") === ageValueDefault(ageMarks).join("-")
    ) {
      updatedSearchParams.delete("age");
    } else {
      updatedSearchParams.set("age", String(newValue));
    }
    window.history.pushState(null, "", `?${updatedSearchParams.toString()}`);
  };

  const handleEnergiesChange = (event: SelectChangeEvent<string[]>) => {
    const newValue = (
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    ).filter((n) => n);
    setEnergiesValue(newValue.length === 0 ? [""] : newValue);
    if (newValue.length === 0) {
      updatedSearchParams.delete("energies");
    } else {
      updatedSearchParams.set("energies", newValue.join(",") as string);
    }
    window.history.pushState(null, "", `?${updatedSearchParams.toString()}`);
  };

  const handleLocationsChange = (event: SelectChangeEvent<string[]>) => {
    const newValue = (
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    ).filter((n) => n);
    setLocationsValue(newValue.length === 0 ? [""] : newValue);
    if (newValue.length === 0) {
      updatedSearchParams.delete("locations");
    } else {
      updatedSearchParams.set("locations", newValue.join(",") as string);
    }
    window.history.pushState(null, "", `?${updatedSearchParams.toString()}`);
  };

  const handleOperatorsChange = (event: SelectChangeEvent<string[]>) => {
    const newValue = (
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    ).filter((n) => n);
    setOperatorsValue(newValue.length === 0 ? [""] : newValue);
    if (newValue.length === 0) {
      updatedSearchParams.delete("operators");
    } else {
      updatedSearchParams.set("operators", newValue.join(",") as string);
    }
    window.history.pushState(null, "", `?${updatedSearchParams.toString()}`);
  };

  const handlePowerOutputChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setPowerOutputValue(newValue as number[]);
    if (
      (newValue as number[]).join("-") ===
      powerOutputValueDefault(powerOutputMarks).join("-")
    ) {
      updatedSearchParams.delete("power");
    } else {
      updatedSearchParams.set("power", String(newValue));
    }
    window.history.pushState(null, "", `?${updatedSearchParams.toString()}`);
  };

  const changeNameValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue(e.target.value);
    if (e.target.value === "") {
      updatedSearchParams.delete("name");
    } else {
      updatedSearchParams.set("name", e.target.value);
    }
    window.history.pushState(null, "", `?${updatedSearchParams.toString()}`);
  };

  const updatedSearchParams = new URLSearchParams(
    currentSearchParams.toString()
  );

  const clearFilters = () => {
    setNameValue("");
    setEnergiesValue([""]);
    setOperatorsValue([""]);
    setLocationsValue([""]);
    setPowerOutputValue(powerOutputValueDefault(powerOutputMarks));
    setAgeValue(ageValueDefault(ageMarks));
    updatedSearchParams.delete("name");
    updatedSearchParams.delete("energies");
    updatedSearchParams.delete("operators");
    updatedSearchParams.delete("locations");
    updatedSearchParams.delete("power");
    updatedSearchParams.delete("age");
    window.history.pushState(null, "", `?${updatedSearchParams.toString()}`);
  };

  const removeFilter = (filter: string[]) => {
    setFilters(
      filters.filter((item) => {
        return item !== filter;
      })
    );
    switch (filter[0]) {
      case "name":
        setNameValue("");
        updatedSearchParams.delete("name");
        break;
      case "energy":
        setEnergiesValue(energiesValue.filter((item) => item !== filter[1]));
        updatedSearchParams.delete("energies");
        break;
      case "operator":
        setOperatorsValue(operatorsValue.filter((item) => item !== filter[1]));
        updatedSearchParams.delete("operators");
        break;
      case "location":
        setLocationsValue(locationsValue.filter((item) => item !== filter[1]));
        updatedSearchParams.delete("locations");
        break;
      case "power":
        setPowerOutputValue(powerOutputValueDefault(powerOutputMarks));
        updatedSearchParams.delete("power");
        break;
      case "age":
        setAgeValue(ageValueDefault(ageMarks));
        updatedSearchParams.delete("age");
        break;
    }
    window.history.pushState(null, "", `?${updatedSearchParams.toString()}`);
  };

  const getLabelForFilter = (filter: string[]) => {
    switch (filter[0]) {
      case "name":
        return filter[1];
      case "energy":
        return energyTypes[filter[1] as keyof typeof energyTypes].label;
      case "operator":
        return operators[filter[1] as keyof typeof operators].label;
      case "location":
        return locations[filter[1] as keyof typeof locations].label;
      case "power":
        return `Output: ${filter[1]} MW`;
      case "age":
        return `Age: ${filter[1]} years`;
      default:
        return "";
    }
  };

  useEffect(() => {
    const updateFilters = () => {
      const newFilters = [];

      if (nameValue !== "") {
        newFilters.push(["name", nameValue]);
      }

      energiesValue
        .filter((energy) => energy !== "")
        .forEach((energy) => {
          newFilters.push(["energy", energy]);
        });

      operatorsValue
        .filter((operator) => operator !== "")
        .forEach((operator) => {
          newFilters.push(["operator", operator]);
        });

      locationsValue
        .filter((location) => location !== "")
        .forEach((location) => {
          newFilters.push(["location", location]);
        });

      if (
        powerOutputValue.join("-") !==
        powerOutputValueDefault(powerOutputMarks).join("-")
      ) {
        newFilters.push(["power", powerOutputValue.join(" - ")]);
      }

      if (ageValue.join("-") !== ageValueDefault(ageMarks).join("-")) {
        newFilters.push(["age", ageValue.join(" - ")]);
      }
      setFilters(newFilters);

      props.setFilteredPowerStations(
        powerStations.filter((station) => {
          return (
            nameValue === "" ||
            station.name.toLowerCase().includes(nameValue.toLowerCase())
          );
        })
      );
    };
    updateFilters();
  }, [
    powerStations,
    currentSearchParams,
    ageValue,
    energiesValue,
    locationsValue,
    nameValue,
    operatorsValue,
    powerOutputValue,
  ]);

  useEffect(() => {
    async function getData() {
      initialized.current = true;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/power-stations`
      );
      const data = await res.json();
      setPowerStations(data.powerStations);

      const powerOutputMarksData = [
        { value: 0, label: "0" },
        { value: 2000, label: "2000" },
      ];
      setPowerOutputMarks(powerOutputMarksData);

      const ageMarksData = [
        { value: 10, label: "10" },
        { value: 40, label: "40" },
      ];
      ageMarksDefault.current = ageMarksData;
      setAgeMarks(ageMarksData);

      const nameParam = currentSearchParams.get("name");
      if (nameParam) {
        setNameValue(nameParam);
      }

      const operatorsParam = currentSearchParams
        .get("operators")
        ?.split(",")
        .map(String);
      if (operatorsParam) {
        setOperatorsValue(operatorsParam);
      }

      const energiesParam = currentSearchParams
        .get("energies")
        ?.split(",")
        .map(String);
      if (energiesParam) {
        setEnergiesValue(energiesParam);
      }

      const locationsParam = currentSearchParams
        .get("locations")
        ?.split(",")
        .map(String);
      if (locationsParam) {
        setLocationsValue(locationsParam);
      }

      const powerParam = currentSearchParams
        .get("power")
        ?.split(",")
        .map(Number);
      if (powerParam) {
        setPowerOutputValue(powerParam);
      } else {
        setPowerOutputValue(powerOutputValueDefault(powerOutputMarksData));
      }

      const ageParam = currentSearchParams.get("age")?.split(",").map(Number);
      if (ageParam) {
        setAgeValue(ageParam);
      } else {
        setAgeValue(ageValueDefault(ageMarksData));
      }
    }

    if (!initialized.current) {
      getData();
    }
  }, [
    powerStations,
    currentSearchParams,
    ageValue,
    energiesValue,
    locationsValue,
    nameValue,
    operatorsValue,
    powerOutputValue,
  ]);

  useEffect(() => {
    const nameParam = currentSearchParams.get("name");
    if (nameParam && nameParam !== nameValue) {
      setNameValue(nameParam);
    }

    const operatorsParam = currentSearchParams
      .get("operators")
      ?.split(",")
      .map(String);
    if (
      operatorsParam &&
      operatorsParam?.join(",") !== operatorsValue.join(",")
    ) {
      setOperatorsValue(operatorsParam);
    }

    const energiesParam = currentSearchParams
      .get("energies")
      ?.split(",")
      .map(String);
    if (energiesParam && energiesParam?.join(",") !== energiesValue.join(",")) {
      setEnergiesValue(energiesParam);
    }

    const locationsParam = currentSearchParams
      .get("locations")
      ?.split(",")
      .map(String);
    if (
      locationsParam &&
      locationsParam?.join(",") !== locationsValue.join(",")
    ) {
      setLocationsValue(locationsParam);
    }

    const powerParam = currentSearchParams.get("power")?.split(",").map(Number);
    if (powerParam && powerParam?.join(",") !== powerOutputValue.join(",")) {
      setPowerOutputValue(powerParam);
    }

    const ageParam = currentSearchParams.get("age")?.split(",").map(Number);
    if (ageParam && ageParam?.join(",") !== ageValue.join(",")) {
      setAgeValue(ageParam);
    }
  }, [currentSearchParams]);

  return (
    <Stack spacing={2} className="filterPanel">
      <Stack alignItems="center" direction="row" gap={2}>
        <FilterAltIcon />
        <Typography variant="h1" component="h2" fontSize={14}>
          Filter and search
        </Typography>
      </Stack>
      <Divider />
      <Stack alignItems="center" direction="row" gap={2}>
        <Typography variant="h2" component="h3" fontSize={12}>
          Currently active filters
        </Typography>
        <Button
          size="small"
          onClick={clearFilters}
          disabled={filters.length === 0}
          sx={{ textDecoration: "underline", marginLeft: "auto" }}
        >
          Clear all
        </Button>
      </Stack>
      <List
        sx={{
          display: "flex",
          justifyContent: "left",
          flexWrap: "wrap",
          listStyle: "none",
          p: 0.5,
          m: 0,
          minHeight: "5em",
          transition: "height 1s ease",
        }}
        component="ul"
      >
        {filters.map((filter, index) => (
          <ListItem key={index}>
            <Chip
              label={truncateString(getLabelForFilter(filter), 35)}
              variant="outlined"
              size="small"
              onDelete={() => {
                removeFilter(filter);
              }}
            />
          </ListItem>
        ))}
        {filters.length === 0 && (
          <ListItem>
            <Chip label="No filters applied" variant="outlined" size="small" />
          </ListItem>
        )}
      </List>
      <Typography variant="h2" component="h3" fontSize={12}>
        Filter options
      </Typography>
      <TextField
        id="name"
        label="Name search"
        value={nameValue}
        onChange={changeNameValue}
        placeholder="Enter a station name"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <FormControl fullWidth>
        <InputLabel id="energies-label">Energy type</InputLabel>
        <Select
          labelId="energies-label"
          id="energies"
          label="Energy type"
          value={energiesValue}
          onChange={handleEnergiesChange}
          multiple
        >
          <MenuItem value={""}>Select energy type(s)</MenuItem>
          {Object.entries(energyTypes).map(([value, { label }]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="operators-label">Operator</InputLabel>
        <Select
          labelId="operators-label"
          id="operators"
          label="Energy type"
          value={operatorsValue}
          onChange={handleOperatorsChange}
          multiple
        >
          <MenuItem value={""}>Select operator(s)</MenuItem>
          {Object.entries(operators).map(([value, { label }]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="locations-label">Location</InputLabel>
        <Select
          labelId="locations-label"
          id="locations"
          value={locationsValue}
          onChange={handleLocationsChange}
          multiple
          label="Select province(s)"
        >
          <MenuItem value={""}>Select province(s)</MenuItem>
          {Object.entries(locations).map(([value, { label }]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <Stack alignItems="center" direction="row" gap={2}>
          <BoltIcon />
          <Typography gutterBottom>Filter by power output (MW):</Typography>
        </Stack>
        <Slider
          id="power-output"
          value={powerOutputValue}
          onChange={handlePowerOutputChange}
          min={powerOutputValueDefault(powerOutputMarks)[0]}
          max={powerOutputValueDefault(powerOutputMarks)[1]}
          step={100}
          marks={powerOutputMarks}
        />
      </FormControl>
      <FormControl fullWidth>
        <Stack alignItems="center" direction="row" gap={2}>
          <EventIcon />
          <Typography gutterBottom>Filter by age:</Typography>
        </Stack>
        <Slider
          id="age"
          value={ageValue}
          onChange={handleAgeChange}
          min={ageValueDefault(ageMarks)[0]}
          max={ageValueDefault(ageMarks)[1]}
          step={5}
          marks={ageMarks}
        />
      </FormControl>
    </Stack>
  );
}

export default Component;
