// app/reducers/index.ts
import { combineReducers } from "@reduxjs/toolkit";
import stepCounterReducer from "./stepCounterReducer";

const rootReducer = combineReducers({
  stepCounter: stepCounterReducer,
  // Aggiungi altri reducer qui
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
