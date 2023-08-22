import { BillsState } from ".";
import { State } from "..";
import { IBillWithoutImages } from "../../../../api/src/endpoints.ts/bill";
import { IImage } from "../../../../api/src/models/bill";
import { NotFoundable, newNotFound } from "../../lib/notFoundable";
import { Errorable, newSuccess } from "../../lib/errorable";

/**
 * Get bills state.
 * @param state Root state
 * @returns Bills state
 */
export const selectBills = (state: State): BillsState => {
  return state.bills;
};

/**
 * Get bill by ID.
 * @param state Root state
 * @param billID Bill ID
 * @returns Bill if found.
 */
export const selectBillByID = (state: State, billID: string): Errorable<Error, NotFoundable<IBillWithoutImages>> => {
  const bills = selectBills(state);
  if (billID in bills) {
    return bills.bills[billID];
  }

  return newSuccess(newNotFound());
};

/**
 * Get bill images by ID.
 * @param state Root state
 * @param billID Bill ID
 * @returns Bill images if found
 */
export const selectBillImagesByID = (state: State, billID: string): Errorable<Error, NotFoundable<IImage[]>> => {
  const bills = selectBills(state);

  if (billID in bills.bills) {
    return bills.billImages[billID];
  }
  
  return newSuccess(newNotFound());
};