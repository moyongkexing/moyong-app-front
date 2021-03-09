import React from 'react'
import { auth } from "../../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { selectProfileUser } from "../../features/profileUserSlice";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {
  Avatar,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    large: {
      width: theme.spacing(9),
      height: theme.spacing(9),
    },
  }),
);
const User:React.FC = () => {
  const classes = useStyles();
  const user = useSelector(selectUser);
  const profileUser = useSelector(selectProfileUser);
  return (
    <div className="flex items-center">
      <Avatar
        className={classes.large}
        src={profileUser.avatar
          ? profileUser.avatar
          : user.photoUrl
        }
      />
      <h3 className="font-bold text-xl text-white ml-5">
        {profileUser.name
          ? profileUser.name
          : user.displayName
        }
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
