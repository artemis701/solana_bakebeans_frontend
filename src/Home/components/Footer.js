import * as React from "react";

import { Grid, IconButton, Typography, Box } from "@mui/material";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";

import Modal from "@mui/material/Modal";

import faqs from "../assets/faqs.json";
import QuestionAnswer from "@mui/icons-material/QuestionAnswer";
import Close from "@mui/icons-material/Close";

import { config } from "../../config";
import solIcon from "../assets/solscan.png";
import tgIcon from "../assets/telegram.png";
import dcIcon from "../assets/discord.png";
import twIcon from "../assets/Twitter.png";
import auditIcon from "../assets/Audit.png";
import dappRadarIcon from "../assets/Dappradder.png";
import gitbookIcon from "../assets/gitbook.png";

const FAQButton = styled(Button)({
  backgroundColor: "#e3e3e3 !important",
  border: "3px solid #e3e3e3",
  boxShadow: "none !important",
  borderRadius: "10px !important",
  width: "350px !important",
  color: "black !important",
  fontSize: "23px !important",
  fontWeight: "bold !important",
  fontFamily: "Museo !important"
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "90%",
  maxHeight: "90%",
  bgcolor: "background.paper",
  boxShadow: 24,
  px: 4,
  py: 6,
  borderRadius: 8,
  overflow: "auto !important",
  paddingTop: "48px !important"
};

export default function Footer() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Grid container justifyContent="center" >
        <FAQButton
          variant="contained"
          onClick={handleOpen}
        >
          FAQS
        </FAQButton>
      </Grid>
      <Grid container justifyContent="center" spacing={2} marginTop={4}>
        <Grid item>
          <a href="https://solscan.io/address/D5dQVzkeybDeQLFdGUiH41xbLBPq7Y9BLeEAUqTDxKs3" target="__blank">
            <img src={solIcon} alt="" width={48} height={48} />
          </a>
        </Grid>
        <Grid item>
          <a href="https://t.me/solrewards" target="__blank">
            <img src={tgIcon} alt="" width={48} height={48} />
          </a>
        </Grid>
        <Grid item>
          <a href="https://discord.com/solrewards" target="__blank">
            <img src={dcIcon} alt="" width={48} height={48} />
          </a>
        </Grid>
        <Grid item>
          <a href="https://twitter.com/solrewards" target="__blank">
            <img src={twIcon} alt="" width={48} height={48} />
          </a>
        </Grid>
        <Grid item>
          <a href="https://solrewards.gitbook.io/roadmap/" target="__blank">
            <img src={gitbookIcon} alt="" width={48} height={48} />
          </a>
        </Grid>
      </Grid>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="scrollbox">
          <Grid container spacing={2} direction="column" position="relative">
            {faqs.map((faq, index) => (
              <Grid item key={faq.q}>
                <Typography variant="body2" gutterBottom className="museo-font">
                  <b>{index + 1}: {faq.q}</b>
                </Typography>
                <Typography variant="body2" className="museo-font">{faq.a}</Typography>
                {
                  faq.a1 && <Typography variant="body2" className="museo-font">{faq.a1}</Typography>
                }
                {
                  faq.a2 && <Typography variant="body2" className="museo-font">{faq.a2}</Typography>
                }
                {
                  faq.a3 && <Typography variant="body2" className="museo-font">{faq.a3}</Typography>
                }
                {
                  faq.a4 && <Typography variant="body2" className="museo-font">{faq.a4}</Typography>
                }
                {
                  faq.a5 && <Typography variant="body2" className="museo-font">{faq.a5}</Typography>
                }
                {
                  faq.a6 && <Typography variant="body2" className="museo-font">{faq.a6}</Typography>
                }
              </Grid>
            ))}
            <IconButton
              color="primary"
              style={{ position: "absolute", right: -20, top: -24 }}
              onClick={handleClose}
            >
              <Close />
            </IconButton>
          </Grid>
        </Box>
      </Modal>

    </div>
  );
}
