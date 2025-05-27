// components/LeaderModal.tsx

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";

const LeaderModal = ({
  open,
  leader,
  onClose,
}: {
  open: boolean;
  leader: any; 
  onClose: () => void;
}) => {
  if (!leader) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <img
          src={leader.image[0].url}
          alt={leader.name}
          style={{
            width: 120,
            height: 120,
            borderRadius: "5px",
            objectFit: "cover",
            margin: "0 auto 1em auto",
            display: "block",
          }}
        />
      <DialogTitle>{leader.name}</DialogTitle>
      <DialogContent>
        <Typography mb={1}>
          {leader.role}
        </Typography>
        <Typography mb={1}>
          {leader.description}
        </Typography>
      </DialogContent>
      
    </Dialog>
  );
};

export default LeaderModal;
