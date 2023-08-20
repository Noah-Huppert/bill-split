import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { IBill, IImage } from "../../../../api/src/models/bill";
import { Loadable, newLoaded, newLoading } from "../../lib/loadable";
import { NotFoundable, isNotFound } from "../../lib/notFoundable";
import { IBillWithoutImages } from "../../../../api/src/endpoints.ts/bill";

export type BillsState = {
  bills: {
    [key: string]: {
      bill: Loadable<IBillWithoutImages>,
      images: Loadable<IImage[]>,
    },
  },
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
      bill: NotFoundable<IBillWithoutImages>,
    }>) => {
      const { billID, bill } = action.payload;

      // Bill not found
      if (isNotFound(bill)) {
        delete state.bills[billID];
        return;
      }

      // Update state entry for bill
      const billState = billID in state.bills ? state.bills[billID] : {
        bill,
        images: newLoaded([]),
      };
      billState.bill = bill;

      state.bills[billID] = billState;
    },

    fetchBillImages: (state, action: PayloadAction<{
      billID: string,
      images: NotFoundable<IImage[]>,
    }>) => {
      const { billID, images } = action.payload;

      // Bill not found
      if (isNotFound(images)) {
        delete state.bills[billID];
        return;
      }

      // Update state entry for bill
      const billState = billID in state.bills ? state.bills[billID] : {
        bill: newLoading(),
        images,
      };
      
      state.bills[billID] = billState;
    },
  }
});