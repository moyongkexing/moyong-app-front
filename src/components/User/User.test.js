import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../features/userSlice';
import profileUserReducer from '../../features/profileUserSlice';
import User from "./User";

afterEach(() => {
  cleanup();
})
describe("レンダリング", () => {
  let store;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer,
        profileUser: profileUserReducer,
      },
    });
  });
  it("要素が正しくレンダリングされること", () => {
    render(
      <Provider store={store}>
        <User/>
      </Provider>
    );
    expect(screen.getByTestId("avatar")).toBeTruthy();
    expect(screen.getByTestId("profileUsername")).toBeTruthy();
    expect(screen.getByTestId("signOut")).toBeTruthy();
  })
})
