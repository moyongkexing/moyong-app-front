import React, { useState, useEffect } from "react";
import type { VFC } from "react";
import styles from "./Post.module.scss";
import { useDispatch } from "react-redux";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import { selectUser, setShowUser } from "../../features/userSlice";
import { Avatar, IconButton } from "@material-ui/core";
import AddCommentIcon from '@material-ui/icons/AddComment';
import DeleteIcon from "@material-ui/icons/Delete";
interface Props {
  postId: string;
  avatar: string;
  image: string;
  trainingArray: any;
  timestamp: any;
  username: string;
  postUid: string;
  openCommentInput: any;
}
interface Comment {
  id: string;
  avatar: string;
  text: string;
  timestamp: string;
  username: string;
}
// -----------Postコンポーネント-----------
const Post: VFC<Props> = (props) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [comments, setComments] = useState<Comment[]>([]);
  
  // 筋トレ記録投稿削除
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
            timestamp: new Date(doc.data().timestamp.toDate()).toLocaleString(),
          }))
        );
      });
    return () => {
      unSub();
    };
  }, [props.postId]);
  return (
    <div className={styles.hvrGlow}>
      <div className="p-5">
        <Avatar
          data-testid="avatar"
          src={props.avatar}
          className="cursor-pointer"
          onClick={() => 
            dispatch(
              setShowUser({
                name: props.username,
                avatar: props.avatar,
              })
            )
          }
        />
      </div>
      <div className="flex-1 p-4">
        <div>
          <div className="mb-1">
            <h3>
              <span
                data-testid="username"
                className="font-bold text-lg text-whiteSmoke cursor-pointer mr-3"
                onClick={() => 
                  dispatch(
                    setShowUser({
                      name: props.username,
                      avatar: props.avatar,
                    })
                  )
                }
              >{props.username}</span>
              <span data-testid="date" className="text-gray-500 text-sm">
                {props.timestamp}
              </span>
            </h3>
          </div>
          <div className="mb-3">
            {props.trainingArray.map((record: any, index: number) => (
              <table className="text-whiteSmoke font-semibold" key={index}>
                <td data-testid="trainingName" className="mr-1">{record.trainingName}</td>
                {
                  record.trainingWeight &&
                  <td data-testid="trainingWeight" className="mr-1">{record.trainingWeight}</td>
                }
                {
                  record.trainingReps &&
                  <td data-testid="trainingReps" className="mr-1">{record.trainingReps}回</td>
                }
              </table>
            ))}
          </div>
        </div>
        {props.image && (
          <div className="flex justify-center items-center">
            <img className="object-contain rounded-2xl max-h-60" src={props.image} alt="tweet" />
          </div>
        )}
        <IconButton data-testid="addCommentButton" className="focus:outline-none">
          <AddCommentIcon
            className="cursor-pointer text-whiteSmoke"
            onClick={() => props.openCommentInput(props.postId, props.username, props.avatar)}
          />
        </IconButton>
        {
          user.uid === props.postUid && user.uid !== "fiNlO1btdyZVIxI0JrZkXRLlutn1" &&
          <IconButton  className="focus:outline-none">
            <DeleteIcon
              className="cursor-pointer text-whiteSmoke"
              onClick={deletePost}
            />
          </IconButton>
        }
        {
          comments.map((com) => (
            <div key={com.id} className="flex items-center break-all m-3">
              <Avatar 
                src={com.avatar}
                className="cursor-pointer w-7 h-7 mr-1"
                onClick={() => 
                  dispatch(
                    setShowUser({
                      name: com.username,
                      avatar: com.avatar,
                    })
                  )
                }
              />
              <span
                className="font-semibold text-whiteSmoke mr-3 cursor-pointer"
                onClick={() => 
                  dispatch(
                    setShowUser({
                      name: com.username,
                      avatar: com.avatar,
                    })
                  )
                }
              >
                @{com.username}
              </span>
              <span className="text-sm text-whiteSmoke mr-3">{com.text}</span>
              <span className="text-gray-500 text-sm">{com.timestamp}</span>
            </div>
          ))
        }
      </div>
    </div>
  )
}
export default Post
