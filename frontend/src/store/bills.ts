import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { Loadable } from "../lib/loadable";
import { IBill } from "../../../api/src/models/bill";

type BillsState = {
  bills: {[key: string]: Loadable<IBill>}
};

const initBillsState: BillsState = {
  bills: {},
};

export const billsSlice = createSlice({
  name: "bills",
  initialState: initBillsState,
  reducers: {
    fetchBill: (state, action: PayloadAction<{
      billID: string,
      bill: Loadable<IBill>,
    }>) => {
      state.bills[action.payload.billID] = action.payload.bill;
    }
  }
});

export const { fetchBill } = billsSlice.actions;