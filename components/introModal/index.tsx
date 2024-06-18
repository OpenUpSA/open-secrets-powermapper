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

type Props = {
  introModalOpen: boolean;
  closeIntroModal: Function;
  showUseToolButton: boolean;
};

export function IntroModal({
  introModalOpen,
  closeIntroModal,
  showUseToolButton,
}: Props) {
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
          title="Power Mapper by Open Secrets graphic"
        />
        <CardContent className="content">
          <Typography
            gutterBottom
            variant="h5"
            component="h1"
            className="title"
          >
            Meet South Africa&#8217;s energy profiteers
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The PowerMapper Is an interactive database which maps and profiles
            the &#8216;power players&#8217; who benefit from the climate crisis and the
            transition to renewables. The database uses the conceptual framework
            developed in Open Secrets&#8217; Who Has the Power? South Africa&#8217;s Energy
            Profiteers investigative report. The report shows who holds the
            power in South Africa&#8217;s energy sector and spotlights the key private
            players in the coal, gas, oil and renewable energy industries—who we
            call &#8216;energy profiteers&#8217;. We identify the private corporations that
            stand to benefit from maintaining the status quo, i.e. a reliance on
            fossil fuels, in South Africa&#8217;s energy sector. We also identify the
            corporations that stand to benefit from South Africa&#8217;s transition to
            new energy sources.
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
            href="https://www.opensecrets.org.za/energy-profiteers/"
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
