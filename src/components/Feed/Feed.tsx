import React, { useState, useEffect } from 'react'
import type { VFC } from "react";
import styles from './Feed.module.scss';
import { db } from "../../firebase";
import TrainingInput from '../TrainingInput/TrainingInput';
import CommentInput from '../CommentInput/CommentInput';
import Post from '../Post/Post';
import User from '../User/User';

interface POST {
  id: string;
  avatar: string;
  image: string;
  trainingArray: [];
  timestamp: Date;
  username: string;
  uid: string;
}
interface CommentPost {
  id: string;
  username: string;
  avatar: string;
}
const Feed: VFC = () => {
  const [ posts, setPosts] = useState<POST[]>([]);
  const [ displayCommentInput, setDisplayCommentInput ] = useState<boolean>(false);
  const [ commentPost, setCommentPost ] = useState<CommentPost>();
  const openCommentInput = (id:string, username:string, avatar:string) => {
    setDisplayCommentInput(true);
    setCommentPost({
      id: id,
      username: username,
      avatar: avatar,
    })
  }
  // データベースから投稿一覧を取得してstateに入れる
  useEffect(() => {
    const unSub = db
    .collection("training_posts")
    .orderBy("timestamp", "desc")
    .onSnapshot((snapshot) => setPosts(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        avatar: doc.data().avatar,
        image: doc.data().image,
        trainingArray: doc.data().training_array,
        timestamp: doc.data().timestamp,
        username: doc.data().username,
        uid: doc.data().uid
      }))
    ));
    return () => {
      unSub();
    };
  }, []);
  return (
    <div className="grid grid-rows-3 grid-cols-12 grid-flow-col w-full">
      <div className="row-span-1 col-span-4 w-full flex jusity-center items-center">
        <User />
      </div>
      <div className="row-span-2 col-span-4 w-full">
        <div className={styles.underLeft}>
          {
            displayCommentInput
            ? <CommentInput 
                commentPost={commentPost}
                setDisplayCommentInput={setDisplayCommentInput}
              />
            : <TrainingInput/>
          }
        </div>
      </div>
      <div className="row-span-3 col-span-8">
        <div className={styles.scroll}>
          {posts.length &&
            <>
              {posts.map((post) => (
                <Post
                  key={post.id}
                  postId={post.id}
                  avatar={post.avatar}
                  image={post.image}
                  trainingArray={post.trainingArray}
                  timestamp={post.timestamp}
                  username={post.username}
                  postUid={post.uid}
                  openCommentInput={openCommentInput}
                />
              ))}
            </>
          }
        </div>
      </div>
    </div>
  );
}
export default Feed
