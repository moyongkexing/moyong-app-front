import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import TrainingInput from "../components/TrainingInput/TrainingInput";

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
  });
  it("")
  it("トレーニング名だけ入力した状態でも登録リストに追加できること", () => {
    // const saveTrainingRecord = jest.fn();
    // render(
    //   <Provider store={store}>
    //     <TrainingInput/>
    //   </Provider>
    // );
    // const trainingName = screen.getByTestId("trainingNameInput");
    // userEvent.type(trainingName, "ベンチプレス");
    // userEvent.click(screen.getByTestId("saveButton"));
    // expect(saveTrainingRecord).toHaveBeenCalledTimes(1);
  });
  it("トレーニング名が入力されていない場合登録リストに追加できないこと", () => {
    
  }
})
