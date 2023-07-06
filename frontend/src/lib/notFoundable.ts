import { Loadable, Loaded, newLoaded } from "./loadable";

/**
 * Data which could be loading, not found, or loaded.
 * @typeParam D The type of the found data
 */
export type NotFoundable<D> = Loadable<D> | NotFound;

export type NotFound = {
  _tag: "notfound";
};

/**
 * Type guard for NotFound.
 * @param notFoundable NotFoundable to check
 * @returns True if NotFound
 */
export function isNotFound(notFoundable: {
  _tag: string;
}): notFoundable is NotFound {
  return notFoundable._tag === "notfound";
}

/**
 * Creates a new NotFound object.
 * @returns New NotFound
 */
export function newNotFound(): NotFound {
  return {
    _tag: "notfound",
  };
}

/**
 * Creates a new NotFoundable which is Loaded if data is not null or NotFound if data is null.
 * @param data Data which is loaded or NotFound if null
 * @returns Loaded if data not null or NotFound if null
 */
export function newLoadedOrNotFound<D>(data: D | null): Loaded<D> | NotFound {
  if (data === null) {
    return newNotFound();
  }

  return newLoaded(data);
}
