import React, { useState } from "react";
import { storage, db } from "../../firebase";
import styles from "./TrainingInput.module.scss";
import firebase from "firebase/app";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import SendIcon from '@material-ui/icons/Send';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  Avatar,
  IconButton,
  makeStyles,
  createStyles,
  Theme,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
} from "@material-ui/core";

interface TrainingRecord {
  trainingName: string;
  trainingWeight: string;
  trainingReps: string;
}

const weightList = [
  {value: 'none', label: 'なし'},
  {value: '10lbs | 4.5kg', label: '10lbs | 4.5kg'},
  {value: '20lbs | 9kg', label: '20lbs | 9kg'},
  {value: '30lbs | 14kg', label: '30lbs | 14kg'},
  {value: '40lbs | 18kg', label: '40lbs | 18kg'},
  {value: '50lbs | 23kg', label: '50lbs | 23kg'},
  {value: '60lbs | 27kg', label: '60lbs | 27kg'},
  {value: '70lbs | 32kg', label: '70lbs | 32kg'},
  {value: '80lbs | 36kg', label: '80lbs | 36kg'},
  {value: '90lbs | 41kg', label: '90lbs | 41kg'},
  {value: '100lbs | 45kg', label: '100lbs | 45kg'},
  {value: '110lbs | 50kg', label: '110lbs | 50kg'},
  {value: '120lbs | 54kg', label: '120lbs | 54kg'},
  {value: '130lbs | 59kg', label: '130lbs | 59kg'},
  {value: '140lbs | 64kg', label: '140lbs | 64kg'},
  {value: '150lbs | 68kg', label: '150lbs | 68kg'},
  {value: '160lbs | 73kg', label: '160lbs | 73kg'},
  {value: '170lbs | 77kg', label: '170lbs | 77kg'},
  {value: '180lbs | 82kg', label: '180lbs | 82kg'},
  {value: '190lbs | 86kg', label: '190lbs | 86kg'},
  {value: '200lbs | 91kg', label: '200lbs | 91kg'},
];
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    small: {
      width: theme.spacing(4),
      height: theme.spacing(4),
    },
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    button: {
      margin: theme.spacing(1),
    },
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      margin: theme.spacing(4, 0, 2),
    },
  }),
);
const TrainingInput: React.FC = () => {
  const classes = useStyles();
  const user = useSelector(selectUser);
  const [ image, setImage] = useState<File | null>(null);
  const [ trainingRecord, setTrainingRecord ] = useState<TrainingRecord>({
    trainingName: "",
    trainingWeight: "10lbs | 4.5kg",
    trainingReps: "",
  })
  const [ trainingRecords, setTrainingRecords ] = useState<TrainingRecord[]>([]);
  const saveTrainingRecord = () => {
    setTrainingRecords([...trainingRecords, trainingRecord]);
    setTrainingRecord({
      trainingName: "",
      trainingWeight: "10lbs | 4.5kg",
      trainingReps: "",
    })
  };
  const deleteTrainingRecord = (index: number) => {
    let newTrainingRecords = [...trainingRecords]
    newTrainingRecords.splice(index, 1);
    setTrainingRecords(newTrainingRecords);
  }
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setImage(e.target.files![0]);
      e.target.value = "";
    }
  };
  const postTrainingRecords = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (image) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + image.name;
      const uploadImg = storage.ref(`images/${fileName}`).put(image);
      uploadImg.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {},
        (err) => {
          alert(err.message);
        },
        async () => {
          await storage
            .ref("images")
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              await db.collection('training_posts').add({
                avatar: user.photoUrl,
                image: url,
                training_array: trainingRecords,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                username: user.displayName,
                uid: user.uid
              });
            });
        }
      );
    } else {
      db.collection('training_posts').add({
        avatar: user.photoUrl,
        image: "",
        training_array: trainingRecords,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        username: user.displayName,
        uid: user.uid
      });
    }
    setImage(null);
    setTrainingRecords([]);
  };
  return (
    <form onSubmit={postTrainingRecords} className="flex flex-col items-center">
      <Avatar
        className="w-14 h-14 mt-7"
        src={user.photoUrl}
      />
      <div className="w-9/12">
        <input
          className="w-full mt-4 bg-inputBg text-whiteSmoke px-4 py-2 rounded-3xl outline-none border-none text-lg"
          placeholder="トレーニング名"
          type="text"
          value={trainingRecord.trainingName}
          onChange={(e) => setTrainingRecord({...trainingRecord, trainingName: e.target.value})}
        />
        <select
          className="w-full mt-4 bg-inputBg text-whiteSmoke px-4 py-2 rounded-3xl outline-none border-none text-lg"
          value={trainingRecord.trainingWeight}
          onChange={(e) => setTrainingRecord({...trainingRecord, trainingWeight: e.target.value})}
        >
          {weightList.map((weight) => (
            <option key={weight.value} value={weight.value}>
              {weight.label}
            </option>
          ))}
        </select>
        <input
          className="w-9/12 mt-4 bg-inputBg text-whiteSmoke px-4 py-2 rounded-3xl outline-none border-none text-lg appearance-none no-spin::-webkit-inner-spin-button o-spin::-webkit-outer-spin-button"
          min="0"
          placeholder="reps"
          type="number"
          value={trainingRecord.trainingReps}
          onChange={(e) => setTrainingRecord({...trainingRecord, trainingReps: e.target.value})}
        />
        <IconButton
          disabled={!trainingRecord.trainingName}
          className="focus:outline-none"
        >
          <AddCircleIcon
            onClick={() => saveTrainingRecord()}
            fontSize="large"
            className={
              trainingRecord.trainingName
              ? "text-enableBtn cursor-pointer"
              : "text-disableBtn cursor-pointer"
            }
          />
        </IconButton>
      </div>
      <List dense={true} className="w-11/12 h-2/5 m-0">
        <div className={styles.scroll}>
          {trainingRecords.map((record, index) => (
            <ListItem key={index}>
              <ListItemAvatar>
                <Avatar className={classes.small}>
                  <FitnessCenterIcon/>
                </Avatar>
              </ListItemAvatar>
              <div className="flex flex-col text-whiteSmoke font-bold w-full">
                <p>{record.trainingName}</p>
                <p className="text-sm">{record.trainingWeight} × {record.trainingReps}回</p>
              </div>
              <ListItemSecondaryAction>
                <IconButton className="focus:outline-none" edge="end" aria-label="delete" onClick={() => deleteTrainingRecord(index)}>
                  <DeleteIcon className="cursor-pointer text-whiteSmoke"/>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </div>
      </List>
      <div className="w-9/12 flex justify-between items-center mb-5">
        <IconButton className="focus:outline-none">
          <label>
            <AddPhotoAlternateIcon
              fontSize="large"
              className={
                image
                ? "text-whiteSmoke cursor-pointer"
                : "text-disableBtn cursor-pointer"
              }
            />
            <input
              className="hidden"
              type="file"
              onChange={onChangeImageHandler}
            />
          </label>
        </IconButton>
        <button
          type="submit"
          disabled={!trainingRecords.length}
          className={trainingRecords.length
            ? "focus:outline-none border-none bg-enableBtn text-whiteSmoke rounded-3xl font-bold cursor-pointer py-2 px-4 text-lg"
            : "focus:outline-none border-none bg-disableBtn text-whiteSmoke rounded-3xl font-bold py-2 px-4 text-lg"
          }
        >
          Post {<SendIcon/>}
        </button>
      </div>
    </form>
  );
}
export default TrainingInput;
