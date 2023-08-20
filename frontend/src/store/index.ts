import { configureStore } from "@reduxjs/toolkit";
import { billsSlice } from "./bills";

export const store = configureStore({
  reducer: {
    bills: billsSlice.reducer,
  }
});