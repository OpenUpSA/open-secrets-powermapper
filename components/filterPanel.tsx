import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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

function Component() {
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

  const powerOutputValueDefault = [1, 2000];
  const ageValueDefault = [1, 20];

  const [ageValue, setAgeValue] = useState<number[]>(
    currentSearchParams.get("age")?.split(",").map(Number) ?? ageValueDefault
  );
  const [powerOutputValue, setPowerOutputValue] = useState<number[]>(
    currentSearchParams.get("power")?.split(",").map(Number) ??
      powerOutputValueDefault
  );
  const [locationsValue, setLocationsValue] = useState<string[]>(
    currentSearchParams.get("locations")?.split(",").map(String) ?? [""]
  );
  const [energiesValue, setEnergiesValue] = useState<string[]>(
    currentSearchParams.get("energies")?.split(",").map(String) ?? [""]
  );
  const [operatorsValue, setOperatorsValue] = useState<string[]>(
    currentSearchParams.get("operators")?.split(",").map(String) ?? [""]
  );
  const [nameValue, setNameValue] = useState(
    currentSearchParams.get("name") ?? ""
  );

  const [filters, setFilters] = useState<string[][]>([]);

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

    if (powerOutputValue.join("-") !== powerOutputValueDefault.join("-")) {
      newFilters.push(["power", powerOutputValue.join(" - ")]);
    }
    if (ageValue.join("-") !== ageValueDefault.join("-")) {
      newFilters.push(["age", ageValue.join(" - ")]);
    }
    console.log({ newFilters });
    setFilters(newFilters);
  };

  const handleAgeChange = (event: Event, newValue: number | number[]) => {
    setAgeValue(newValue as number[]);
    updatedSearchParams.set("age", String(newValue));
    window.history.pushState(null, "", `?${updatedSearchParams.toString()}`);
    updateFilters();
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
    updateFilters();
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
    updateFilters();
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
    updateFilters();
  };

  const handlePowerOutputChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setPowerOutputValue(newValue as number[]);
    updatedSearchParams.set("power", String(newValue));
    window.history.pushState(null, "", `?${updatedSearchParams.toString()}`);
    updateFilters();
  };

  const changeNameValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue(e.target.value);
    updatedSearchParams.set("name", e.target.value);
    window.history.pushState(null, "", `?${updatedSearchParams.toString()}`);
    updateFilters();
  };

  /*const filteredPowerStations = powerStations.filter(({ name }) =>
    name.toLowerCase().includes(nameValue.toLowerCase())
  );*/

  const updatedSearchParams = new URLSearchParams(
    currentSearchParams.toString()
  );

  const clearFilters = () => {
    setNameValue("");
    setEnergiesValue([""]);
    setOperatorsValue([""]);
    setLocationsValue([""]);
    setPowerOutputValue(powerOutputValueDefault);
    setAgeValue(ageValueDefault);
    updatedSearchParams.delete("name");
    updatedSearchParams.delete("energies");
    updatedSearchParams.delete("operators");
    updatedSearchParams.delete("locations");
    updatedSearchParams.delete("power");
    updatedSearchParams.delete("age");
    window.history.pushState(null, "", `?${updatedSearchParams.toString()}`);
    updateFilters();
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
        break;
      case "energy":
        setEnergiesValue(energiesValue.filter((item) => item !== filter[1]));
        break;
      case "operator":
        setOperatorsValue(operatorsValue.filter((item) => item !== filter[1]));
        break;
      case "location":
        setLocationsValue(locationsValue.filter((item) => item !== filter[1]));
        break;
      case "power":
        setPowerOutputValue(powerOutputValueDefault);
        break;
      case "age":
        setAgeValue(ageValueDefault);
        break;
    }
  };

  const getLabelForFilter = (filter: string[]) => {
    switch (filter[0]) {
      case "name":
        return filter[1];
      case "energy":
        return energyTypes[filter[1]].label;
      case "operator":
        return operators[filter[1]].label;
      case "location":
        return locations[filter[1]].label;
      case "power":
        return `Power output: ${filter[1]} MW`;
      case "age":
        return `Age: ${filter[1]} years`;
    }
  };

  useEffect(() => {
    updateFilters();
  }, [
    nameValue,
    energiesValue,
    operatorsValue,
    locationsValue,
    powerOutputValue,
    ageValue,
  ]);

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
        <InputLabel id="operators-label">Operators</InputLabel>
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
          <Typography gutterBottom>Filter by power output (MW)</Typography>
        </Stack>
        <Slider
          id="power-output"
          value={powerOutputValue}
          onChange={handlePowerOutputChange}
          min={powerOutputValueDefault[0]}
          max={powerOutputValueDefault[1]}
          step={100}
          marks
        />
      </FormControl>
      <FormControl fullWidth>
        <Stack alignItems="center" direction="row" gap={2}>
          <EventIcon />
          <Typography gutterBottom>Filter by age</Typography>
          {ageValue.join(" - ")}
        </Stack>
        <Slider
          id="age"
          value={ageValue}
          onChange={handleAgeChange}
          min={ageValueDefault[0]}
          max={ageValueDefault[1]}
          step={5}
          marks
        />
      </FormControl>
    </Stack>
  );
}

export default Component;
