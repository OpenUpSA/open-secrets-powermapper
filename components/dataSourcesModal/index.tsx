import "./index.scss";

import { Modal } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import CloseIcon from "@mui/icons-material/Close";
import StorageRounded from "@mui/icons-material/StorageRounded";

type Props = {
  dataSourcesModalOpen: boolean;
  closeDataSourcesModal: Function;
};

export function DataSourcesModal({
  dataSourcesModalOpen,
  closeDataSourcesModal,
}: Props) {
  return (
    <Modal
      open={dataSourcesModalOpen}
      onClose={() => closeDataSourcesModal()}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card className="modalCard">
        <CardContent className="content">
          <Stack
            alignItems="center"
            direction="row"
            gap={2}
            style={{ marginBottom: "1em" }}
          >
            <StorageRounded />
            <Typography
              gutterBottom
              variant="h5"
              component="h1"
              className="title"
            >
              Data sources
            </Typography>
            <button
              className="closeDatasourcesModalButton"
              onClick={() => closeDataSourcesModal()}
            >
              <CloseIcon fontSize="medium" />
            </button>
          </Stack>
          <ul className="tabularList">
            <li>
              <a
                href="https://www.opensecrets.org.za/report-who-has-the-power/"
                target="_blank"
                rel="noreferrer"
              >
                Who Has the Power: South Africa’s Energy Profiteers
              </a>
            </li>
            <li>
              <a
                href="https://globalenergymonitor.org/projects/global-coal-plant-tracker/"
                target="_blank"
                rel="noreferrer"
              >
                Global Coal Plant Tracker, Global Energy Monitor, April 2024
                Supplemental release.
              </a>
            </li>
            <li>
              <a
                href="https://globalenergymonitor.org/projects/global-methane-emitters-tracker/"
                target="_blank"
                rel="noreferrer"
              >
                Global Methane Emitters Tracker, Global Energy Monitor, November
                2023 release.
              </a>
            </li>
            <li>
              <a
                href="https://globalenergymonitor.org/"
                target="_blank"
                rel="noreferrer"
              >
                Global Energy Monitor
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </Modal>
  );
}
