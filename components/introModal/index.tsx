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
            Welcome to the Open Secrets Power Mapper
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
            ultricies rhoncus augue ut efficitur. Sed consectetur consectetur
            enim, in ornare quam. Phasellus lobortis ante quis dui mattis, vitae
            molestie metus gravida. In mattis pulvinar arcu et porttitor.
            Suspendisse eros libero, porta quis tristique eu, porttitor
            malesuada leo. Vivamus congue imperdiet mi, quis sagittis quam
            tincidunt non. Sed pretium lectus vitae turpis blandit, vitae congue
            elit interdum. Nunc condimentum at dolor non semper. Donec tellus
            arcu, condimentum in mi eget, imperdiet fermentum tortor. Nam ut
            mattis dui, a dapibus mi.
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
