import { BillsState } from ".";
import { State } from "..";
import { IBillWithoutImages } from "../../../../api/src/endpoints.ts/bill";
import { IImage } from "../../../../api/src/models/bill";
import { NotFoundable, newNotFound } from "../../lib/notFoundable";
import { Errorable, newSuccess, isErrored, isSuccess, Errored, Success } from "../../lib/errorable";
import { createSelector } from "@reduxjs/toolkit";
import { Loadable, Loaded, Loading, isLoaded, isLoading } from "../../lib/loadable";

/**
 * Get bills state.
 * @param state Root state
 * @returns Bills state
 */
export const selectBills = (state: State): BillsState => {
  return state.bills;
};

/**
 * Retrieve a bill from the store.
 * createSelector (and the associated weird functions) are required to memoize and prevent re-renders.
 * @param billID ID of bill to get from the bills store
 * @returns Error or success of bill fetch, NotFound if bill not in store, Loading or Loaded depending on fetch status
 */
export const selectBillByID = (billID: string) => createSelector([
  runSelectorOnBillID(billID, selectByErrored),
  runSelectorOnBillID(billID, selectBySuccessLoading),
  runSelectorOnBillID(billID, selectBySuccessLoaded),
], (errored, loading, loaded): Errorable<Error, NotFoundable<IBillWithoutImages>> => {
  return errored || loading || loaded || newSuccess(newNotFound());
});

/**
 * A selector which runs on a single bill entry in the bills store.
 * @typeParam O Output type of selector
 */
type SingleBillSelector<O> = (input: Errorable<Error, Loadable<IBillWithoutImages>>) => O;

/**
 * Given a bill's ID run a selector on that bill in the store. If the bill doesn't exist in the store returns null.
 * @param billID ID of bill in store to run selector on
 * @param selector Selector to run on bill
 * @returns Selector's result after being run on bill, or null if bill did not exist in the store
 */
const runSelectorOnBillID = <O,>(billID: string, selector: SingleBillSelector<O>) => (state: State) => {
  const bills = selectBills(state);
  const bill = selectByKey(billID)(bills.bills);
  return whenNotNull(selector)(bill);
}

/**
 * Retrieve a bill's images from the store.
 * createSelector (and the associated weird functions) are required to memoize and prevent re-renders.
 * @param billID ID of bill to get from the bills store
 * @returns Error or success of bill fetch, NotFound if bill not in store, Loading or Loaded depending on fetch status
 */
export const selectBillImagesByID = (billID: string) => createSelector([
  runSelectorOnBillIDImages(billID, selectByErrored),
  runSelectorOnBillIDImages(billID, selectBySuccessLoading),
  runSelectorOnBillIDImages(billID, selectBySuccessLoaded),
], (errored, loading, loaded): Errorable<Error, NotFoundable<IImage[]>> => {
  return errored || loading || loaded || newSuccess(newNotFound());
});

/**
 * A selector which runs on a bill's images entry in the bills store.
 * @typeParam O Output type of selector
 */
type BillImagesSelector<O> = (input: Errorable<Error, Loadable<IImage[]>>) => O;

/**
 * Given a bill's ID run a selector on that bill's images in the store. If the bill's images don't exist in the store returns null.
 * @param billID ID of bill in store to run selector on
 * @param selector Selector to run on bill
 * @returns Selector's result after being run on bill's images, or null if bill's images did not exist in the store
 */
const runSelectorOnBillIDImages = <O,>(billID: string, selector: BillImagesSelector<O>) => (state: State) => {
  const bills = selectBills(state);
  const images = selectByKey(billID)(bills.billImages);
  return whenNotNull(selector)(images);
}

/**
 * Runs a function if the input isn't null, if input is null returns null.
 * @param fn Function to run
 * @returns Function run result, or null if input was null
 */
const whenNotNull = <I, O,>(fn: (input: I) => O) => (nullableInput: I | null) => {
  if (nullableInput !== null) {
    return fn(nullableInput)
  }

  return null;
}

/**
 * Retrieves a key from an object, or returns null if the key doesn't exist.
 * @param key Key in object to retrieve
 * @returns Value under key in object, or null if key not in object
 */
const selectByKey = (key: string) => <D,>(obj: {[key: string]: D}) => {
  if (key in obj) {
    return obj[key];
  } 

  return null;
}

/**
 * Grab the Errored state from an Errorable<F, S> or return null if not Errored.
 * @param errorable Errorable to select from
 * @returns Errored state or null if not Errored
 */
const selectByErrored = <F, S,>(errorable: Errorable<F, S>): Errored<F> | null => {
  if (isErrored(errorable)) {
    return errorable;
  }

  return null;
}

/**
 * Grab the Success state from an Errorable<F, S> or return null if not Success.
 * @param errorable Errorable to select from
 * @returns Success state or null if not Success
 */
const selectBySuccess = <F, S,>(errorable: Errorable<F, S>): Success<S> | null => {
  if (isSuccess(errorable)) {
    return errorable;
  }

  return null;
}

/**
 * Grab Success<Loading> from Errorable<F, Loadable<D>> or return null if not in that state.
 * @param errorable Errorable with success being a Loadable
 * @returns Success<Loading> if errorable in that state, null otherwise
 */
const selectBySuccessLoading = <F, D,>(errorable: Errorable<F, Loadable<D>>): Success<Loading> | null => {
  const success = selectBySuccess(errorable);
  if (success !== null) {
    const loading = selectByLoading(success.data)

    if (loading !== null) {
      return newSuccess(loading);
    }
  }

  return null;
}

/**
 * Grab Success<Loaded<D>> from Errorable<F, Loadable<D>> or return null if not in that state.
 * @param errorable Errorable with success being Loadable
 * @returns Success<Loaded<D>> if errorable in that state, null otherwise
 */
const selectBySuccessLoaded = <F, D,>(errorable: Errorable<F, Loadable<D>>): Success<Loaded<D>> | null => {
  const success = selectBySuccess(errorable);
  if (success !== null) {
    const loaded = selectByLoaded(success.data);

    if (loaded !== null) {
      return newSuccess(loaded);
    }
  }

  return null;
}

/**
 * Get Loading from Loadable<D> or null if not in that state.
 * @param loadable Loadable to select from
 * @returns Loading if in Loading state, null otherwise
 */
const selectByLoading = <D,>(loadable: Loadable<D>) => {
  if (isLoading(loadable)) {
    return loadable;
  }

  return null;
}

/**
 * Get Loaded<D> from Loadable<D> or null if not in that state.
 * @param loadable Loadable to select from
 * @returns Loaded<D> if in Loaded state, null otherwise
 */
const selectByLoaded = <D,>(loadable: Loadable<D>) => {
  if (isLoaded(loadable)) {
    return loadable;
  }

  return null;
}