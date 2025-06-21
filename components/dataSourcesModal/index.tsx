import React, { useEffect, useState } from "react";

import "./index.scss";

import { Modal } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import CloseIcon from "@mui/icons-material/Close";
import StorageRounded from "@mui/icons-material/StorageRounded";
import { DataSource } from "@/types";

type Props = {
  dataSourcesModalOpen: boolean;
  closeDataSourcesModal: Function;
};

export function DataSourcesModal({
  dataSourcesModalOpen,
  closeDataSourcesModal,
}: Props) {

  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dataSourcesModalOpen) {
      setLoading(true);
      fetch('/api/data-sources')
        .then(res => res.json())
        .then(data => {
          setDataSources(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data sources:', error);
          setLoading(false);
        });
    }
  }, [dataSourcesModalOpen]);

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
          
          {loading ? (
            <Typography>Loading data sources...</Typography>
          ) : (
            <ul className="tabularList">
              {dataSources.map((dataSource, index) => (
                <li key={index}>
                  <a
                    href={dataSource.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {dataSource.source}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </Modal>
  );
}