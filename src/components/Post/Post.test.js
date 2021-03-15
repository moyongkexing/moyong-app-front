import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../features/userSlice';
import Post from "./Post";

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
        <Post/>
      </Provider>
    );
    expect(screen.getByTestId("avatar")).toBeTruthy();
    expect(screen.getByTestId("username")).toBeTruthy();
    expect(screen.getByTestId("date")).toBeTruthy();
    expect(screen.getByTestId("trainingName")).toBeTruthy();
    expect(screen.getByTestId("trainingWeight")).toBeTruthy();
    expect(screen.getByTestId("trainingReps")).toBeTruthy();
    expect(screen.getByTestId("addCommentButton")).toBeTruthy();
  });
})
