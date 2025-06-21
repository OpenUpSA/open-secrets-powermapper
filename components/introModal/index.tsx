import React, { useEffect, useState } from "react";

import "./index.scss";
import intro from "@/public/images/intro.png";

import { Modal } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import Markdown from 'react-markdown';
import { About } from "@/types";

type Props = {
  introModalOpen: boolean;
  closeIntroModal: Function;
  showUseToolButton: boolean;
};

export function IntroModal({
  introModalOpen,
  closeIntroModal,
  showUseToolButton
}: Props) {

  const [aboutData, setAboutData] = useState<About | null>(null);

  useEffect(() => {
    async function getAbout() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/about`
      );
      const data = await res.json();
      if (data) {
        setAboutData(data);
      } else {
        console.error("No about data found");
      }
    }
    getAbout();
  }, []); 

  return (
    <Modal
      open={introModalOpen}
      onClose={() => closeIntroModal()}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card className="modalCard">
        <CardMedia
          className="media"
          image={intro.src}
          title="PowerMapper by Open Secrets graphic"
        />
        <CardContent className="content">
          <Typography
            gutterBottom
            variant="h5"
            component="h1"
            className="title"
          >
            {aboutData?.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <Markdown>{aboutData?.body}</Markdown>
          </Typography>
        </CardContent>
        <CardActions className="actions">
          {showUseToolButton && (
            <Button
              className="primary"
              size="small"
              variant="contained"
              onClick={() => closeIntroModal()}
            >
              Use the tool
            </Button>
          )}
          <a
            href={aboutData?.reportUrl}
            rel="noopener"
            target="_blank"
            className="button secondary"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 11.75V14H5V11.75H3.5V14C3.5 14.825 4.175 15.5 5 15.5H14C14.825 15.5 15.5 14.825 15.5 14V11.75H14ZM13.25 8.75L12.1925 7.6925L10.25 9.6275V3.5H8.75V9.6275L6.8075 7.6925L5.75 8.75L9.5 12.5L13.25 8.75Z"
                fill="#1D192B"
              />
            </svg>
            <div>Download the report</div>
          </a>
          <button className="closeModal" onClick={() => closeIntroModal()}>
            <CloseIcon fontSize="medium" />
          </button>
        </CardActions>
      </Card>
    </Modal>
  );
}