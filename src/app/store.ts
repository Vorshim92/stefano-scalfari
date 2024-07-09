import { configureStore, ThunkAction, Action, createSlice } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

const tempSlice = createSlice({
  name: "temp",
  initialState: {},
  reducers: {},
});

const rootReducer = combineReducers({
  temp: tempSlice.reducer,

  // Aggiungi altri reducer qui
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
