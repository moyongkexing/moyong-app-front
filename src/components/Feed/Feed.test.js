import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userReducer from '../../features/userSlice';
import profileUserReducer from '../../features/profileUserSlice';
import Feed from "./Feed";

afterEach(() => {
  cleanup();
});

describe("Rendering", () => {
  let store;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer,
        profileUser: profileUserReducer,
      },
    });
  });
  it("Should render all the elements correctly", () => {
    render(
      <Provider store={store}>
        <Feed />
      </Provider>
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
