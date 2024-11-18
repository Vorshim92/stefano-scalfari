// app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = (dispatch: AppDispatch, getState: () => RootState) => ReturnType;
export type RootState = ReturnType<typeof store.getState>;
