import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddCommentIcon from '@material-ui/icons/AddComment';
import DeleteIcon from "@material-ui/icons/Delete";
interface PROPS {
  postId: string;
  avatar: string;
  image: string;
  trainingArray: any;
  timestamp: any;
  username: string;
  postUid: string;
  updateProfile: any;
  openCommentInput: any;
}
interface COMMENT {
  id: string;
  avatar: string;
  text: string;
  timestamp: any;
  username: string;
}
const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  }
}))
// -----------Postコンポーネント-----------
const Post: React.FC<PROPS> = (props) => {
  const user = useSelector(selectUser);
  const classes = useStyles();
  const [openComments, setOpenComments] = useState(false);
  const [comments, setComments] = useState<COMMENT[]>([]);
  
  // 投稿削除
  const deletePost = () => {
    if (user.uid === props.postUid) {
      db.collection("training_posts").doc(props.postId).delete();
    } else {
      console.log("failed to delete!")
    }
  };
  // データベースから投稿に紐づくコメント一覧を取得してstateに入れる
  useEffect(() => {
    const unSub = db
      .collection("training_posts")
      .doc(props.postId)
      .collection("comments")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setComments(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            avatar: doc.data().avatar,
            text: doc.data().text,
            username: doc.data().username,
            timestamp: doc.data().timestamp,
          }))
        );
      });
    return () => {
      unSub();
    };
  }, [props.postId]);
  return (
    <div className="flex ml-16 pb-3">
      <div className="p-5">
        <Avatar
          src={props.avatar}
          className="cursor-pointer"
          onClick={() => props.updateProfile(props.username, props.avatar)}/>
      </div>
      <div className="flex-1 p-4">
        <div>
          <div className="mb-1">
            <h3>
              <span
                className="text-lg font-bold text-whiteSmoke cursor-pointer mr-3"
                onClick={() => props.updateProfile(props.username, props.avatar)}
              >{props.username}</span>
              <span className="text-gray-500 text-sm">
                {new Date(props.timestamp?.toDate()).toLocaleString()}
              </span>
            </h3>
          </div>
          <div className="mb-3">
            {props.trainingArray.map((record: any, index: number) => (
              <div className="text-whiteSmoke font-semibold" key={index}>
                <td className="mr-1">{record.trainingName}</td>
                <td className="mr-1">
                  {
                    record.trainingWeight == "none"
                    ? ""
                    : record.trainingWeight
                  }
                  </td>
                <td className="mr-1">{record.trainingReps}回</td>
              </div>
            ))}
          </div>
        </div>
        {props.image && (
          <div className="flex justify-center items-center">
            <img className="object-contain rounded-2xl max-h-60" src={props.image} alt="tweet" />
          </div>
        )}
        <AddCommentIcon
          className="cursor-pointer text-whiteSmoke"
          onClick={() => props.openCommentInput(props.postId, props.avatar)}
        />
        {
          user.uid === props.postUid &&
          <DeleteIcon
          className="cursor-pointer text-whiteSmoke"
          onClick={deletePost}
        />
        }
        {
          comments.map((com) => (
            <div key={com.id} className="flex items-center break-all m-3">
              <Avatar src={com.avatar} className={classes.small}/>
              <span className="font-semibold text-whiteSmoke mr-3">@{com.username}</span>
              <span className="text-sm text-whiteSmoke mr-3">{com.text}</span>
              <span className="text-gray-500 text-sm">{new Date(com.timestamp?.toDate()).toLocaleString()}</span>
            </div>
          ))
        }
      </div>
    </div>
  )
}
export default Post
