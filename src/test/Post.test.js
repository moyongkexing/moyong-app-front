import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import Post from "../components/Post/Post";

const dummyPosts = [
  {
    postId: "post1",
    avatar: "avatar1",
    image: "image1",
    trainingArray: [
      {
        trainingName: "trainingName1",
        trainingWeight: "1kg",
        trainingReps: "1",
      },
      {
        trainingName: "trainingName2",
        trainingWeight: "2kg",
        trainingReps: "2",
      },
      {
        trainingName: "trainingName3",
        trainingWeight: "3kg",
        trainingReps: "3",
      },
    ],
    timestamp: "2021/1/1 00:00:01",
    username: "user1",
    postUid: "postUser1",
  },
  {
    postId: "post2",
    avatar: "avatar2",
    image: "image2",
    trainingArray: [
      {
        trainingName: "trainingName1",
        trainingWeight: "1kg",
        trainingReps: "1",
      },
      {
        trainingName: "trainingName2",
        trainingWeight: "2kg",
        trainingReps: "2",
      },
      {
        trainingName: "trainingName3",
        trainingWeight: "3kg",
        trainingReps: "3",
      },
    ],
    timestamp: "2021/1/2 00:00:01",
    username: "user2",
    postUid: "postUser2",
  },
  {
    postId: "post3",
    avatar: "avatar3",
    image: "image3",
    trainingArray: [
      {
        trainingName: "trainingName1",
        trainingWeight: "1kg",
        trainingReps: "1",
      },
      {
        trainingName: "trainingName2",
        trainingWeight: "2kg",
        trainingReps: "2",
      },
      {
        trainingName: "trainingName3",
        trainingWeight: "3kg",
        trainingReps: "3",
      },
    ],
    timestamp: "2021/1/3 00:00:01",
    username: "user3",
    postUid: "postUser3",
  },
]
afterEach(() => {
  cleanup();
})
describe("レンダリング", () => {
  let store;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer,
      },
    });
  });
  it("要素が正しくレンダリングされること", () => {
    render(
      <Provider store={store}>
        {
          dummyPosts.map((post) => (
            <Post
              key={post.id}
              postId={post.id}
              avatar={post.avatar}
              image={post.image}
              trainingArray={post.trainingArray}
              timestamp={post.timestamp}
              username={post.username}
              postUid={post.uid}
            />
          ))
        }
      </Provider>
    );
    expect(screen.getAllByTestId("avatar")).toBeTruthy();
    expect(screen.getAllByTestId("username")).toBeTruthy();
    expect(screen.getAllByTestId("date")).toBeTruthy();
    expect(screen.getAllByTestId("trainingName")).toBeTruthy();
    expect(screen.getAllByTestId("trainingWeight")).toBeTruthy();
    expect(screen.getAllByTestId("trainingReps")).toBeTruthy();
    expect(screen.getAllByTestId("addCommentButton")).toBeTruthy();
  });
})
