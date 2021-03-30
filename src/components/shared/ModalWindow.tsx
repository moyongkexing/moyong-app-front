import React, { useState } from "react";
import type { VFC } from "react";
import {
  TextField,
  Modal,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { auth } from "../../firebase";

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}
const useStyles = makeStyles((theme) => ({
  modal: {
    outline: "none",
    position: "absolute",
    width: 400,
    borderRadius: "10",
    backgroundColor: "white",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10)
  }
}));
interface PROPS {
  isOpen: boolean;
  setIsOpenModal: any;
}
const ModalWindow: VFC<PROPS> = (props) => {
  const classes = useStyles();
  const { isOpen, setIsOpenModal } = props;
  const [resetEmail, setResetEmail] = useState<string>("");
  
  const sendResetEmail = async (e: React.MouseEvent<HTMLElement>) => {
    await auth
      .sendPasswordResetEmail(resetEmail)
      .then(() => {
        setIsOpenModal(false);
        setResetEmail("");
      })
      .catch((err) => {
        alert(err.message);
        setResetEmail("");
      })
  };
  return (
    <Modal open={isOpen} onClose={() => setIsOpenModal(false)}>
      <div style={getModalStyle()} className={classes.modal}>
        <div className="text-center">
          <TextField
            InputLabelProps={{
              shrink: true,
            }}
            type="email"
            name="email"
            label="Reset E-mail"
            value={resetEmail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setResetEmail(e.target.value);
            }}
          />
          <IconButton onClick={sendResetEmail}>
            <SendIcon/>
          </IconButton>
        </div>
      </div>
    </Modal>
  );
}
export default ModalWindow;

          
