// app/actions/stepCounterActions.ts
import { createAction } from "@reduxjs/toolkit";

export const incrementSteps = createAction<number>("INCREMENT_STEPS");
export const setSteps = createAction<number>("SET_STEPS");
