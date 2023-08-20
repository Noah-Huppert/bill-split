import { configureStore } from "@reduxjs/toolkit";
import { billsSlice, BillsState } from "./bills";

export type State = {
  bills: BillsState,
}

export const store = configureStore<State>({
  reducer: {
    bills: billsSlice.reducer,
  }
});