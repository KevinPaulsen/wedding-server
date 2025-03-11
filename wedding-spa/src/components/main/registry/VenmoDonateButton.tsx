import {Button} from "@mui/material";
import venmo from '../../../assets/venmo.png';

const VenmoDonateButton = () => {
  return (
      <Button
          variant="contained"
          color="primary"
          href="https://venmo.com/kevin-paulsen-11"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            backgroundColor: "#008CFF", // Venmo Blue
            "&:hover": {backgroundColor: "#357ABD"},
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
          }}
      >
        <img
            src={venmo}
            alt="Venmo Icon"
            style={{height: 20}}
        />
      </Button>
  );
};

export default VenmoDonateButton;
