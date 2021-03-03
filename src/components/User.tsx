import React from 'react'
import { auth } from "../firebase";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {
  Avatar,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";

interface PROPS {
  profileUserName: string;
  profileUserAvatar: string;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    large: {
      width: theme.spacing(9),
      height: theme.spacing(9),
    },
  }),
);
const User:React.FC<PROPS> = (props) => {
  const classes = useStyles();
  return (
    <div className="flex items-center">
      <Avatar className={classes.large} src={props.profileUserAvatar}/>
      <h3 className="font-bold text-xl text-white ml-5">
        {props.profileUserName}
      </h3>
      <button
        className="cursor-pointer bg-transparent border-none outline-none text-white"
        onClick={async () => {
          await auth.signOut();
        }}
      >
        <ExitToAppIcon/>
      </button>
    </div>
  )
}

export default User
