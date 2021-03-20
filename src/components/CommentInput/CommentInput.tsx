import React, { useState } from 'react'
import { db } from "../../firebase";
import firebase from "firebase/app";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setShowUser } from "../../features/userSlice";
import SendIcon from "@material-ui/icons/Send";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {
  Avatar,
} from "@material-ui/core";

interface Props {
  commentPost: any;
  setDisplayCommentInput: any;
}
const CommentInput: React.FC<Props> = (props) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const newComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    db.collection("training_posts").doc(props.commentPost.id).collection("comments").add({
      avatar: user.photoUrl,
      text: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      username: user.displayName,
    });
    setComment("");
  }
  return (
    <form onSubmit={newComment} className="flex flex-col items-center w-full">
      <div className="flex mt-7 mb-3 items-center">
        <Avatar
          data-testid="avatarSender"
          className="w-14 h-14 mx-4  cursor-pointer"
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
        <ChevronRightIcon
          data-testid="arrow"
          className="text-whiteSmoke"
        />
        <Avatar
          data-testid="avatarRecipient"
          className="w-10 h-10 mx-4 cursor-pointer"
          src={props.commentPost.avatar}
          onClick={() => 
            dispatch(
              setShowUser({
                name: props.commentPost.username,
                avatar: props.commentPost.avatar,
              })
            )
          }
        />
      </div>
      <textarea
        data-testid="commentTextarea"
        className="w-9/12 h-2/5 mt-4 px-4 py-2 text-whiteSmoke outline-none border-none text-lg bg-inputBg rounded-3xl resize-none"
        value={comment}
        autoFocus
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setComment(e.target.value)
        }}
      >
      </textarea>
      <div className="w-9/12 flex justify-between items-center mt-5">
        <button
          data-testid="backButton"
          className="focus:outline-none border-none bg-disableBtn text-whiteSmoke cursor-pointer py-2 px-4 rounded-3xl font-bold"
          onClick={() => props.setDisplayCommentInput(false)}>
            戻る
        </button>
        <button
          data-testid="submitButton"
          type="submit"
          disabled={!comment.length}
          className={comment.length
            ? "focus:outline-none border-none bg-enableBtn text-whiteSmoke rounded-3xl font-bold cursor-pointer py-2 px-4 text-lg"
            : "focus:outline-none border-none bg-disableBtn text-whiteSmoke rounded-3xl font-bold py-2 px-4 text-lg"
          }
        >
          Post {<SendIcon/>}
        </button>
      </div>
    </form>
  )
}

export default CommentInput;
