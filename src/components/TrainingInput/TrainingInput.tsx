import React, { useState } from "react";
import { storage, db } from "../../firebase";
import styles from "./TrainingInput.module.scss";
import firebase from "firebase/app";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setShowUser } from "../../features/userSlice";
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import SendIcon from '@material-ui/icons/Send';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  Avatar,
  IconButton,
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
  'none','10lbs','20lbs','30lbs','40lbs','50lbs','60lbs',
  '70lbs','80lbs','90lbs','100lbs','110lbs','120lbs','130lbs',
  '140lbs','150lbs','160lbs','170lbs','180lbs','190lbs','200lbs',
  '4.5kg','9kg','14kg','18kg','23kg','27kg','32kg','36kg','41kg',
  '45kg','50kg','54kg','59kg','64kg','68kg','73kg','77kg','82kg',
  '86kg','91kg',
];
const TrainingInput: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [ image, setImage] = useState<File | null>(null);
  const [ trainingRecord, setTrainingRecord ] = useState<TrainingRecord>({
    trainingName: "",
    trainingWeight: "",
    trainingReps: "",
  })
  const [ trainingRecords, setTrainingRecords ] = useState<TrainingRecord[]>([]);
  const saveTrainingRecord = () => {
    setTrainingRecords([...trainingRecords, trainingRecord]);
    setTrainingRecord({
      trainingName: "",
      trainingWeight: "",
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
                timestamp: firebase.firestore.Timestamp.now(),
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
        timestamp: firebase.firestore.Timestamp.now(),
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
        data-testid="avatar"
        className="w-14 h-14 mt-7 mb-3 cursor-pointer"
        src={user.photoUrl}
        onClick={() => 
          dispatch(
            setShowUser({
              name: user.displayName,
              avatar: user.photoUrl,
            })
          )
        }
      />
      <div className="w-9/12">
        <input
          data-testid="trainingNameInput"
          className="w-full mt-4 bg-inputBg text-whiteSmoke px-4 py-2 rounded-3xl outline-none border-none text-lg"
          placeholder="トレーニング名"
          type="text"
          value={trainingRecord.trainingName}
          onChange={(e) => setTrainingRecord({...trainingRecord, trainingName: e.target.value})}
        />
        <input
          data-testid="trainingWeightInput"
          type="text"
          autoComplete="on"
          list="weightList"
          placeholder="重量"
          className="w-full mt-4 bg-inputBg text-whiteSmoke px-4 py-2 rounded-3xl outline-none border-none text-lg"
          onChange={(e) => setTrainingRecord({...trainingRecord, trainingWeight: e.target.value})}
        />
        <datalist id="weightList">
          {weightList.map((weight) => (
            <option value={weight}>
            </option>
          ))}
        </datalist>
        <input
          data-testid="trainingRepsInput"
          className="w-9/12 mt-4 bg-inputBg text-whiteSmoke px-4 py-2 rounded-3xl outline-none border-none text-lg appearance-none no-spin::-webkit-inner-spin-button o-spin::-webkit-outer-spin-button"
          min="0"
          placeholder="回数"
          type="number"
          value={trainingRecord.trainingReps}
          onChange={(e) => setTrainingRecord({...trainingRecord, trainingReps: e.target.value})}
        />
        <IconButton
          data-testid="saveButton"
          disabled={!trainingRecord.trainingName}
          className="focus:outline-none"
          onClick={() => saveTrainingRecord()}
        >
          <AddCircleIcon
            fontSize="large"
            className={
              trainingRecord.trainingName
              ? "text-enableBtn cursor-pointer"
              : "text-disableBtn cursor-pointer"
            }
          />
        </IconButton>
      </div>
      <List data-testid="trainingRecordsList" dense={true} className="w-11/12 h-2/5 m-0">
        <div className={styles.scroll}>
          {trainingRecords.map((record, index) => (
            <ListItem key={index}>
              <ListItemAvatar>
                <Avatar className="w-6 h-6 mx-4">
                  <FitnessCenterIcon/>
                </Avatar>
              </ListItemAvatar>
              <div className="flex flex-col text-whiteSmoke font-bold w-full">
                <p>{record.trainingName}</p>
                {
                  record.trainingWeight
                  ? <p className="text-sm">{record.trainingWeight} × {record.trainingReps}回</p>
                  : <p>{record.trainingReps}回</p>
                }
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
        <IconButton data-testid="uploadButton" className="focus:outline-none">
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
          data-testid="submitButton"
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
