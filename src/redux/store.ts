// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from"./authslice"

// Define the root state type
export type RootState = ReturnType<typeof store.getState>;

// Define the dispatch type
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});