import React from 'react'
import type { VFC } from "react";
import { TextField, Mordal, IconButton } from "@material-ui/core";
import { SendIcon } from "@material-ui/icon";

const Mordal: VFC = () => {
  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)}>
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

export default Mordal;

          
