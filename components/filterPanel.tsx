import "./filterPanel.scss";
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
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputAdornment from "@mui/material/InputAdornment";
import Slider from "@mui/material/Slider";

import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import StorageRounded from "@mui/icons-material/StorageRounded";
import SearchIcon from "@mui/icons-material/Search";
import BoltIcon from "@mui/icons-material/Bolt";
import SpeedIcon from "@mui/icons-material/Speed";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import PersonIcon from "@mui/icons-material/Person";
import EngineeringIcon from "@mui/icons-material/Engineering";
import ExploreIcon from "@mui/icons-material/Explore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InfoIcon from "@mui/icons-material/Info";

import { ItemLabel, Marks, PowerStation } from "@/types";
import Button from "@mui/material/Button";

type Props = {
  showIntroModal: Function;
  showDataSourcesModal: Function;
  setFilteredPowerStations: Function;
  filteredPowerStations: PowerStation[];
  panelOpen: boolean;
  setPanelOpen: Function;
};

const StyledSlider = styled(Slider)({
  color: "#dFdFdF",
  height: 16,
  "& .MuiSlider-track": {
    border: "none",
    color: "#FFCB14",
    borderRadius: 0,
  },
  "& .MuiSlider-thumb": {
    height: 44,
    width: 12,
    borderRadius: 6,
    border: "none",
    backgroundColor: "#FFCB14",
    borderRight: "solid 4px #fff",
    borderLeft: "solid 4px #fff",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&::before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#52af77",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&::before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});

const StyledSwitch = styled(Switch)(() => ({
  "& .MuiSwitch-switchBase": {
    color: "#80660a",
  },
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#FFCB14",
  },
  "& .MuiSwitch-track": {
    backgroundColor: "#999",
  },
  "& .MuiSwitch-track.Mui-checked": {
    backgroundColor: "#FFCB14",
  },
}));

function truncateString(str: string, num: number) {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
}

function Component(props: Props) {
  const currentSearchParams = useSearchParams();

  const showByControversiesParam = currentSearchParams.get("show-by-controversies") === "true";

  const initialized = useRef(false);
  const {
    setFilteredPowerStations,
    setPanelOpen,
    panelOpen,
    showIntroModal,
    showDataSourcesModal,
  } = props;
  const [powerStations, setPowerStations] = useState<PowerStation[]>([]);
  const [availableEnergyTypes, setAvailableEnergyTypes] = useState<ItemLabel>({});
  const [availableOperators, setAvailableOperators] = useState<ItemLabel>({});
  const [availableOwners, setAvailableOwners] = useState<ItemLabel>({});
  const [availableLocations, setAvailableLocations] = useState<ItemLabel>({});

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

  
  const getFilteredDataset = (
    stations: PowerStation[],
    excludeFilter?: string
  ): PowerStation[] => {
    const nameParam = currentSearchParams.get("name")?.toLowerCase() || "";
    const regionParam = excludeFilter === "locations" ? [] : currentSearchParams.get("locations")?.split(",") || [];
    const fuelTypeParam = excludeFilter === "energies" ? [] : currentSearchParams.get("energies")?.split(",") || [];
    const operatorParam = excludeFilter === "operators" ? [] : currentSearchParams.get("operators")?.split(",") || [];
    const ownerParam = excludeFilter === "owners" ? [] : currentSearchParams.get("owners")?.split(",") || [];
    const powerParam = excludeFilter === "power" ? null : currentSearchParams.get("power")?.split(",").map(Number);

    return stations.filter(
      (station) =>
        station.name.toLowerCase().includes(nameParam) &&
        (showByControversiesParam ? Boolean(station.controversies && station.controversies.trim()) : true) &&
        (regionParam.length === 0 ||
          regionParam.includes(station.region.name)) &&
        (fuelTypeParam.length === 0 ||
          fuelTypeParam.includes(station.fuelType.shorthand)) &&
        (
          operatorParam.length === 0 ||
          station.operator?.some(op => operatorParam.includes(op.name))
        ) &&
        (
          ownerParam.length === 0 ||
          station.owner?.some(ow => ownerParam.includes(ow.name))
        ) &&
        (!powerParam ||
          !station.powerOutput ||
          (station.powerOutput >= powerParam[0] &&
            station.powerOutput <= powerParam[1]))
    );
  };

  
  const buildFilterOptions = (stations: PowerStation[]) => {
    const energyTypesData = stations.reduce(
      (acc: ItemLabel, cur: PowerStation) => {
        if (cur.fuelType) {
          acc[cur.fuelType.shorthand] = { label: cur.fuelType.name };
        }
        return acc;
      },
      {} as ItemLabel
    );

    const operatorsData = stations.reduce(
      (acc: ItemLabel, cur: PowerStation) => {
        if (Array.isArray(cur.operator)) {
          cur.operator.forEach(op => {
            if (op && op.name) {
              acc[op.name] = { label: op.name };
            }
          });
        }
        return acc;
      },
      {} as ItemLabel
    );

    const ownersData = stations.reduce(
      (acc: ItemLabel, cur: PowerStation) => {
        if (Array.isArray(cur.owner)) {
          cur.owner.forEach(ow => {
            if (ow && ow.name) {
              acc[ow.name] = { label: ow.name };
            }
          });
        }
        return acc;
      },
      {} as ItemLabel
    );

    const locationsData = stations.reduce(
      (acc: ItemLabel, cur: PowerStation) => {
        if (cur.region) {
          acc[cur.region.name] = { label: cur.region.name };
        }
        return acc;
      },
      {} as ItemLabel
    );

    return {
      energyTypes: energyTypesData,
      operators: operatorsData,
      owners: ownersData,
      locations: locationsData,
    };
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
    if (powerStations.length === 0) return;

    
    const filteredStations = getFilteredDataset(powerStations);
    setFilteredPowerStations(filteredStations);

    
    const availableForEnergyTypes = getFilteredDataset(powerStations, "energies");
    const availableForOperators = getFilteredDataset(powerStations, "operators");
    const availableForOwners = getFilteredDataset(powerStations, "owners");
    const availableForLocations = getFilteredDataset(powerStations, "locations");

    const energyOptions = buildFilterOptions(availableForEnergyTypes);
    const operatorOptions = buildFilterOptions(availableForOperators);
    const ownerOptions = buildFilterOptions(availableForOwners);
    const locationOptions = buildFilterOptions(availableForLocations);

    setAvailableEnergyTypes(energyOptions.energyTypes);
    setAvailableOperators(operatorOptions.operators);
    setAvailableOwners(ownerOptions.owners);
    setAvailableLocations(locationOptions.locations);

  }, [currentSearchParams, powerStations, setFilteredPowerStations, showByControversiesParam]);

  const clearFilters = () => {
    const newParams = new URLSearchParams(currentSearchParams.toString());
    newParams.delete("name");
    newParams.delete("locations");
    newParams.delete("energies");
    newParams.delete("operators");
    newParams.delete("owners");
    newParams.delete("power");
    newParams.delete("show-by-controversies");
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

      case "show-by-controversies":
        newParams.delete("show-by-controversies");
        break;
    }
    window.history.pushState(null, "", `?${newParams.toString()}`);
  };

  const getLabelForFilter = (filter: string[]) => {
    switch (filter[0]) {
      case "name":
        return filter[1];
      case "energy":
        return availableEnergyTypes
          ? availableEnergyTypes[filter[1] as keyof typeof availableEnergyTypes]?.label || filter[1]
          : filter[1];
      case "operator":
        return availableOperators
          ? availableOperators[filter[1] as keyof typeof availableOperators]?.label || filter[1]
          : filter[1];
      case "owner":
        return availableOwners
          ? availableOwners[filter[1] as keyof typeof availableOwners]?.label || filter[1]
          : filter[1];
      case "location":
        return availableLocations
          ? availableLocations[filter[1] as keyof typeof availableLocations]?.label || filter[1]
          : filter[1];
      case "power":
        return `${filter[1]} MW`;

      default:
        return filter[1];
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

      const initialOptions = buildFilterOptions(powerStationsData.powerStations);
      setAvailableEnergyTypes(initialOptions.energyTypes);
      setAvailableOperators(initialOptions.operators);
      setAvailableOwners(initialOptions.owners);
      setAvailableLocations(initialOptions.locations);

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
    }

    if (!initialized.current) {
      getData();
    }
  }, []);

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

    return newFilters;
  };

  const handleControversiesSwitch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newParams = new URLSearchParams(currentSearchParams.toString());
    if (event.target.checked) {
      newParams.set("show-by-controversies", "true");
    } else {
      newParams.delete("show-by-controversies");
    }
    window.history.pushState(null, "", `?${newParams.toString()}`);
  };

  return (
    <Stack spacing={2} className={`filterPanel ${panelOpen ? "" : "closed"}`}>
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
        <button
          onClick={() => showIntroModal(false)}
          className="aboutThisToolMobile"
        >
          <Stack alignItems="center" direction="row" gap={1}>
            <InfoOutlinedIcon fontSize="small" />
          </Stack>
        </button>
        <button
          onClick={() => showDataSourcesModal()}
          className="dataSourcesMobile"
        >
          <Stack alignItems="center" direction="row" gap={1}>
            <StorageRounded fontSize="small" />
          </Stack>
        </button>
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="toggleFilterPanel"
        >
          <CloseIcon fontSize="small" />
        </button>
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
              {filter[0] === "name" && <SearchIcon fontSize="small" />}
              {filter[0] === "energy" && <BoltIcon fontSize="small" />}
              {filter[0] === "operator" && <EngineeringIcon fontSize="small" />}
              {filter[0] === "owner" && <PersonIcon fontSize="small" />}
              {filter[0] === "location" && <ExploreIcon fontSize="small" />}
              {filter[0] === "power" && <SpeedIcon fontSize="small" />}
              <span className="chipTitle">
                {truncateString(getLabelForFilter(filter), 35)}
              </span>
              <CloseIcon className="closeIcon" fontSize="small" />
            </Stack>
          </div>
        ))}
        {chipFilters().length === 0 && (
          <div className="chipFilter noFiltersApplied">
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
      <FormControlLabel
        label={
          <Typography fontSize={12}>
            Only show stations with controversies
          </Typography>
        }
        labelPlacement="start"
        control={
          <StyledSwitch
            className="showBySizeSwitch"
            size="small"
            checked={showByControversiesParam}
            onChange={handleControversiesSwitch}
          />
        }
      />
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
          size="small"
          labelId="energies-label"
          id="energies"
          label="Energy type"
          value={currentSearchParams.get("energies")?.split(",") || [""]}
          onChange={handleEnergiesChange}
          renderValue={(selected) => (
            <Stack alignItems="center" direction="row" gap={1}>
              <BoltIcon fontSize="small" />
              <ListItemText
                className="overflowElipsisHidden"
                primary={
                  selected
                    .map((value) => {
                      return availableEnergyTypes?.[value]?.label || value;
                    })
                    .join(", ") || "Select energy type(s)"
                }
              />
            </Stack>
          )}
          multiple
        >
          {availableEnergyTypes &&
            Object.entries(availableEnergyTypes)
              .sort((a, b) => a[1].label.localeCompare(b[1].label))
              .map(([value, { label }]) => (
                <MenuItem key={value} value={value}>
                  <ListItemText primary={label} />
                  {currentSearchParams
                    .get("energies")
                    ?.split(",")
                    .includes(value) && <CheckIcon />}
                </MenuItem>
              ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="operators-label" size="small">
          Operator
        </InputLabel>
        <Select
          size="small"
          labelId="operators-label"
          id="operators"
          label="Operators"
          value={currentSearchParams.get("operators")?.split(",") || [""]}
          onChange={handleOperatorsChange}
          renderValue={(selected) => (
            <Stack alignItems="center" direction="row" gap={2}>
              <EngineeringIcon fontSize="small" />
              <ListItemText
                className="overflowElipsisHidden"
                primary={
                  selected
                    .map((value) => {
                      return availableOperators?.[value]?.label || value;
                    })
                    .join(", ") || "Select operator(s)"
                }
              />
            </Stack>
          )}
          multiple
        >
          {availableOperators &&
            Object.entries(availableOperators)
              .sort((a, b) => a[1].label.localeCompare(b[1].label))
              .map(([value, { label }]) => (
                <MenuItem key={value} value={value}>
                  <ListItemText primary={label} />
                  {currentSearchParams
                    .get("operators")
                    ?.split(",")
                    .includes(value) && <CheckIcon />}
                </MenuItem>
              ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="owners-label" size="small">
          Owner
        </InputLabel>
        <Select
          size="small"
          labelId="owners-label"
          id="owners"
          label="Owners"
          value={currentSearchParams.get("owners")?.split(",") || [""]}
          onChange={handleOwnersChange}
          renderValue={(selected) => (
            <Stack alignItems="center" direction="row" gap={2}>
              <PersonIcon fontSize="small" />
              <ListItemText
                className="overflowElipsisHidden"
                primary={
                  selected
                    .map((value) => {
                      return availableOwners?.[value]?.label || value;
                    })
                    .join(", ") || "Select owner(s)"
                }
              />
            </Stack>
          )}
          multiple
        >
          {availableOwners &&
            Object.entries(availableOwners)
              .sort((a, b) => a[1].label.localeCompare(b[1].label))
              .map(([value, { label }]) => (
                <MenuItem key={value} value={value}>
                  <ListItemText primary={label} />
                  {currentSearchParams
                    .get("owners")
                    ?.split(",")
                    .includes(value) && <CheckIcon />}
                </MenuItem>
              ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel size="small" id="locations-label">
          Location
        </InputLabel>
        <Select
          size="small"
          labelId="locations-label"
          id="locations"
          value={currentSearchParams.get("locations")?.split(",") || [""]}
          onChange={handleLocationsChange}
          renderValue={(selected) => (
            <Stack alignItems="center" direction="row" gap={2}>
              <ExploreIcon fontSize="small" />
              <ListItemText
                className="overflowElipsisHidden"
                primary={
                  selected
                    .map((value) => {
                      return availableLocations?.[value]?.label || value;
                    })
                    .join(", ") || "Select province(s)"
                }
              />
            </Stack>
          )}
          multiple
          label="Select province(s)"
        >
          {availableLocations &&
            Object.entries(availableLocations)
              .sort((a, b) => a[1].label.localeCompare(b[1].label))
              .map(([value, { label }]) => (
                <MenuItem key={value} value={value}>
                  <ListItemText primary={label} />
                  {currentSearchParams
                    .get("locations")
                    ?.split(",")
                    .includes(value) && <CheckIcon />}
                </MenuItem>
              ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <Stack alignItems="center" direction="row" gap={2}>
          <SpeedIcon fontSize="small" />
          <Typography className="sliderTitle" fontSize="small">
            Filter by power output (MW):
          </Typography>
        </Stack>
        <Stack alignItems="center" direction="row" gap={2}>
          <div className="sliderValues first">
            {currentSearchParams.get("power")?.split(",").map(Number)[0] ||
              powerOutputMarks[0].value}
          </div>
          <StyledSlider
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
          />
          <div className="sliderValues last">
            {currentSearchParams.get("power")?.split(",").map(Number)[1] ||
              powerOutputMarks[1].value}
          </div>
        </Stack>
      </FormControl>
      <Button onClick={() => showIntroModal(false)} className="aboutThisTool">
        <Stack alignItems="center" direction="row" gap={1}>
          <InfoIcon fontSize="small" />
          <div>About this tool</div>
        </Stack>
      </Button>
      <Button
        onClick={() => showDataSourcesModal()}
        className="dataSourcesButton"
      >
        <Stack alignItems="center" direction="row" gap={1}>
          <StorageRounded fontSize="small" />
          <div>Data sources</div>
        </Stack>
      </Button>
    </Stack>
  );
}

export default Component;