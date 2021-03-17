import React, { useState, useEffect } from 'react'
import { auth, db } from "../../firebase";
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
import { useSelector } from "react-redux";
import { selectShowUser } from "../../features/userSlice";

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
interface commitData {
  dt: string,
  ct: number,
};
const User:React.FC = () => {
  const classes = useStyles();
  const [ commits, setCommits ] = useState<Commit[]>([]);
  const showUser = useSelector(selectShowUser);
  useEffect(() => {
    const unSub = db
    .collection("training_posts")
    .where("username", "==", showUser.name)
    .onSnapshot((querySnapshot) => {
      // const dummyData = [
      //   { dt: "2021-3-17", ct: 4 },
      //   { dt: "2021-3-16", ct: 2 },
      //   { dt: "2021-2-15", ct: 1 },
      //   { dt: "2021-3-14", ct: 3 },
      //   { dt: "2021-1-13", ct: 2 },
      //   { dt: "2021-3-17", ct: 4 },
      //   { dt: "2021-3-11", ct: 2 },
      //   { dt: "2021-3-10", ct: 1 },
      //   { dt: "2021-1-10", ct: 6 },
      //   { dt: "2021-2-10", ct: 3 },
      //   { dt: "2021-3-10", ct: 4 },
      //   { dt: "2021-1-10", ct: 2 },
      //   { dt: "2021-2-15", ct: 3 },
      //   { dt: "2021-2-16", ct: 3 },
      //   { dt: "2021-2-18", ct: 2 },
      //   { dt: "2021-2-10", ct: 4 },
      // ]
      let commitData: commitData[] = [];
      querySnapshot.docs.map((doc) => {
        commitData.push({
          dt: doc.data().timestamp.toDate().toLocaleDateString().replace(/\u002f/g, '-'),
          ct: doc.data().training_array.length,
        })
      });
      const result = Array.from(new Set(commitData.map(data => data.dt))).map((d) => {
        return {
          dt: d,
          ct: commitData.filter((obj) => obj.dt === d ).reduce(function(sum, element) {
            return sum + element.ct;
          }, 0)
        }
      })
      setCommits(
        result.map((obj) => ({
          date: obj.dt,
          count: obj.ct,
        }))
      );
    });
    return () => {
      unSub();
    };
  }, [showUser.name])
  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <Avatar
          data-testid="avatar"
          className={classes.large}
          src={showUser.avatar}
        />
        <h3 data-testid="profileUsername" className="font-bold text-xl text-white ml-5">
          {showUser.name}
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
        <div className="container w-full">
          <div>
            <CalendarHeatmap
              startDate={new Date(new Date().setDate(new Date().getDate() - 120))}
              endDate={new Date()}
              values={commits}
              classForValue={(value) => {
                if (!value) {
                  return "color-empty";
                } else if (value.count > 4) {
                  return `color-scale-4`
                }
                return `color-scale-${value.count}`;
              }}
              tooltipDataAttrs={(value:any) => {
                if (!value || !value.date) {
                  return null;
                }
                return {
                  "data-tip": `${value.count} trainings on ${value.date}`,
                };
              }}
            />
          </div>
          <ReactTooltip />
        </div>
      </div>
    </div>
  )
}

export default User;
