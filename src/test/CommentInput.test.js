import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import CommentInput from "../components/CommentInput/CommentInput";

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
    const dummyCommentPost = {
      id: "1",
      username: "user",
      avatar: "avatar",
    }
    render(
      <Provider store={store}>
        <CommentInput commentPost={dummyCommentPost}/>
      </Provider>
    );
    expect(screen.getByTestId("avatarSender")).toBeTruthy();
    expect(screen.getByTestId("arrow")).toBeTruthy();
    expect(screen.getByTestId("avatarRecipient")).toBeTruthy();
    expect(screen.getByTestId("commentTextarea")).toBeTruthy();
    expect(screen.getByTestId("backButton")).toBeTruthy();
    expect(screen.getByTestId("submitButton")).toBeTruthy();
  })
})
