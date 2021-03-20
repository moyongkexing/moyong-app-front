import React, { useState, useEffect } from 'react'
import { auth, db } from "../../firebase";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Avatar } from "@material-ui/core";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import ReactTooltip from "react-tooltip";
import "./User.tsx.scss";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setShowUser, selectShowUser } from "../../features/userSlice";
interface Commit {
  date: string;
  count: number;
}
interface commitData {
  dt: string,
  ct: number,
};
const User:React.FC = () => {
  const [ commits, setCommits ] = useState<Commit[]>([]);
  const showUser = useSelector(selectShowUser);
  const loginUser = useSelector(selectUser);
  const dispatch = useDispatch();
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
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center w-full relative">
        { showUser.name !== loginUser.displayName &&
          <Avatar
            className="w-8 h-8 absolute -left-11 cursor-pointer"
            src={loginUser.photoUrl}
            onClick={() => 
              dispatch(
                setShowUser({
                  name: loginUser.displayName,
                  avatar: loginUser.photoUrl,
                })
              )
            }
          />
        }
        <Avatar
          data-testid="avatar"
          className="w-20 h-20"
          src={showUser.avatar}
        />
        <div className="flex justify-between w-full">
          <h3
            data-testid="profileUsername"
            className="font-bold text-xl text-white ml-5"
          >
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
      </div>
      <div className="mt-5 text-whiteSmoke w-4/5">
        <div className="container">
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
