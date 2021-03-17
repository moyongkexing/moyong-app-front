import React, { useState, useEffect } from 'react'
import { auth, db } from "../../firebase";
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
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import ReactTooltip from "react-tooltip";
import "./User.tsx.scss";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    large: {
      width: theme.spacing(9),
      height: theme.spacing(9),
    },
  }),
);
interface Commit {
  date: string;
  count: number;
}
const User:React.FC = () => {
  const classes = useStyles();
  const user = useSelector(selectUser);
  const profileUser = useSelector(selectProfileUser);
  const [ commits, setCommits ] = useState<Commit[]>([]);
  const [ commitUser, setCommitUser ] = useState("");

  useEffect(() => {
    const unSub = db
    .collection("training_posts")
    .where("username", "==", "たらお@redux難しい")
    .onSnapshot((querySnapshot) => {
      interface commitData {
        dt: string,
        ct: number,
      };
      let commitData: commitData[] = [];
      querySnapshot.docs.map((doc) => {
        commitData.push({
          dt: doc.data().timestamp.toDate().toLocaleDateString(),
          ct: doc.data().training_array.length,
        })
      });
      const result = Array.from(new Set(commitData.map(data => data.dt)))
      const res = result.map((d) => {
        return {
          dt: d,
          ct: commitData.filter((obj) => obj.dt === d ).reduce(function(sum, element) {
            return sum + element.ct;
          }, 0)
        }
      })
      setCommits(
        res.map((obj) => ({
          date: obj.dt,
          count: obj.ct,
        }))
      );
    });
    return () => {
      unSub();
    };
  }, [])
  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <Avatar
          data-testid="avatar"
          className={classes.large}
          src={profileUser.avatar
            ? profileUser.avatar
            : user.photoUrl
          }
        />
        <h3 data-testid="profileUsername" className="font-bold text-xl text-white ml-5">
          {profileUser.name
            ? profileUser.name
            : user.displayName
          }
        </h3>
        <button
          data-testid="signOut"
          className="cursor-pointer bg-transparent border-none outline-none text-white"
          onClick={async () => {
            await auth.signOut();
          }}
        >
          <ExitToAppIcon/>
        </button>
      </div>
      <div className="mt-5 text-whiteSmoke">
        <CalendarHeatmap
          startDate={new Date(new Date().setDate(new Date().getDate() - 120))}
          endDate={new Date()}
          values={commits}
          classForValue={(value) => {
            if (!value) {
              return "color-empty";
            }
            return `color-scale-${value.count}`;
          }}
          tooltipDataAttrs={(value:any) => {
            if (!value || !value.date) {
              return null;
            }
            return {
              "data-tip": `${value.date} has count: ${
                value.count
              }`,
            };
          }}
        />
        <ReactTooltip/>
      </div>
      <div>
        {commits.map((cm) => (
          <>
            <p>{cm.date}</p>
            {/* <p>{cm.count}</p> */}
          </>
        ))}
      </div>
    </div>
  )
}

export default User
