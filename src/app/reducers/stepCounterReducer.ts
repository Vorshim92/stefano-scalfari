// app/reducers/stepCounterReducer.ts
import { createReducer } from "@reduxjs/toolkit";
import { incrementSteps, setSteps } from "../actions/stepCounterActions";

interface StepCounterState {
  steps: number;
}

const initialState: StepCounterState = {
  steps: 0,
};

const stepCounterReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(incrementSteps, (state, action) => {
      state.steps += action.payload || 1;
    })
    .addCase(setSteps, (state, action) => {
      state.steps = action.payload;
    });
});

export default stepCounterReducer;
