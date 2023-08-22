import { Draft, PayloadAction, createSlice } from "@reduxjs/toolkit";

import { IBill, IImage } from "../../../../api/src/models/bill";
import { Loadable, isLoaded, isLoading, newLoaded, newLoading } from "../../lib/loadable";
import { NotFoundable, isNotFound } from "../../lib/notFoundable";
import { IBillWithoutImages } from "../../../../api/src/endpoints.ts/bill";
import { Errorable, isErrored, newErrored, newSuccess } from "../../lib/errorable";

/**
 * Bill reducer state.
 */
export type BillsState = {
  /**
   * Bills loaded into store.
   * If a bill is not found it shouldn't exist in this object (Instead of using the NotFoundable type).
   */
  bills: { [key: string]: Errorable<Error, Loadable<IBillWithoutImages>> },

   /**
   * Bil images loaded into store.
   * If a bill is not found it shouldn't exist in this object (Instead of using the NotFoundable type).
   */
  billImages: { [key: string]: Errorable<Error, Loadable<IImage[]>> },
};

/**
 * Initial bill state store.
 */
const initBillsState: BillsState = {
  bills: {},
  billImages: {},
};

/**
 * Reducer for fetchBill action. Stores bill.
 * @param state Reducer state
 * @param action fetchBill action
 */
const fetchBill = (
  state: Draft<BillsState>,
  action: PayloadAction<{
    billID: string,
    bill: Errorable<Error, NotFoundable<IBillWithoutImages>>,
  }>,
) => {
  const { billID, bill } = action.payload;

  if (isErrored(bill)) {
    // Error
    state.bills[billID] = bill;
  } else {
    // Bill not found
    if (isNotFound(bill.data)) {
      delete state.bills[billID];
      return;
    } 

    // Loading or loaded
    state.bills[billID] = newSuccess(bill.data);
  }
};

/**
 * Reducer for fetchBillImages action. Stores bill images.
 * @param state Reducer state draft
 * @param action fetchBillImages reducer
 */
const fetchBillImages = (
  state: Draft<BillsState>,
  action: PayloadAction<{
    billID: string,
    images: Errorable<Error, NotFoundable<IImage[]>>,
  }>,
) => {
  const { billID, images } = action.payload;

  if (isErrored(images)) {
    // Errored
    state.billImages[billID] = images;
  } else { 
    // Bill not found
    if (isNotFound(images.data)) {
      delete state.billImages[billID];
      return;
    }
    
    state.billImages[billID] = newSuccess(images.data);
  }
};

/**
 * Bill store slice.
 */
export const billsSlice = createSlice({
  name: "bills",
  initialState: initBillsState,
  reducers: {
    fetchBill,
    fetchBillImages,
  }
});