import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../features/userSlice';
import TrainingInput from "./TrainingInput";

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
        <TrainingInput/>
      </Provider>
    );
    expect(screen.getByTestId("avatar")).toBeTruthy();
    expect(screen.getByTestId("trainingNameInput")).toBeTruthy();
    expect(screen.getByTestId("trainingWeightInput")).toBeTruthy();
    expect(screen.getByTestId("trainingRepsInput")).toBeTruthy();
    expect(screen.getByTestId("saveButton")).toBeTruthy();
    expect(screen.getByTestId("trainingRecordsList")).toBeTruthy();
    expect(screen.getByTestId("uploadButton")).toBeTruthy();
    expect(screen.getByTestId("submitButton")).toBeTruthy();
  })
})
