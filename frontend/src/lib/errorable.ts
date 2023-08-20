import { Loadable } from "./loadable";
import { NotFoundable } from "./notFoundable";

/**
 * Indicates loading data failed.
 */
export type Errored = {
  _tag: "error",
};

export type ErrorableData = {
  _tag: string,
};

/**
 * Data type which can encounter error loading.
 * @typeParam D Type of data when loaded
 */
export type Errorable<D extends ErrorableData> = Errored | D;

/**
 * Creates a new Errored.
 * @returns New Errored
 */
function newErrored(): Errored {
  return {
    _tag: "error",
  };
}

/**
 * Type guard for Errored.
 * @typeParam D Data type
 * @param errorable To check
 * @returns True if Errored
 */
function isErrored<D extends ErrorableData>(errorable: Errorable<D>): errorable is Errored {
  return errorable._tag === "error";
}