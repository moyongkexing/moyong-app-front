import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import Feed from "../components/Feed/Feed";

afterEach(() => {
  cleanup();
});

describe("Rendering", () => {
  let store;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer,
      },
    });
  });
  it("Should render all the elements correctly", () => {
    render(
      <Provider store={store}>
        <Feed />
      </Provider>
    );
  });
});
