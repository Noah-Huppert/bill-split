import { Draft, PayloadAction, createSlice } from "@reduxjs/toolkit";

import { IBill, IImage } from "../../../../api/src/models/bill";
import { Loadable, newLoaded, newLoading } from "../../lib/loadable";
import { NotFoundable, isNotFound } from "../../lib/notFoundable";
import { IBillWithoutImages } from "../../../../api/src/endpoints.ts/bill";
import { Errorable, isErrored } from "../../lib/errorable";

/**
 * Bill reducer state.
 */
export type BillsState = {
  /**
   * Bills loaded into store.
   * If a bill is not found it shouldn't exist in this object (Instead of using the NotFoundable type).
   */
  bills: {
    [key: string]: {
      /**
       * The bill without images.
       */
      bill: Errorable<Error, Loadable<IBillWithoutImages>>,

      /**
       * The bill's images.
       */
      images: Errorable<Error, Loadable<IImage[]>>,
    },
  },
};

/**
 * Initial bill state store.
 */
const initBillsState: BillsState = {
  bills: {},
};

const fetchBill = (state: Draft<BillsState>, action: PayloadAction<{
  billID: string,
  bill: Errorable<Error, NotFoundable<IBillWithoutImages>>,
}>) => {
  const { billID, bill } = action.payload;

  if (isErrored(bill)) {
    state.bills[billID] = bill;
  }

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
};

/**
 * Bill store slice.
 */
export const billsSlice = createSlice({
  name: "bills",
  initialState: initBillsState,
  reducers: {
    fetchBill,

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