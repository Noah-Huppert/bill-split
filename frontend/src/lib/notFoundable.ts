import { Loadable, Loaded, isLoading, newLoaded, newLoading } from "./loadable";

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

/**
 * Creates a NotFoundable which when Loaded takes its value from a child key in the parent.
 * @typeParam P Parent data type
 * @typeParam K Keys of parent
 * @param parent Parent NotFoundable
 * @param key Key in Loaded parent from which Loaded data will be retrieved
 * @returns NotFoundable which accesses a key in the parent when Loaded
 */
export function newNotFoundableFromKey<P, K extends keyof P>(parent: NotFoundable<P>, key: K): NotFoundable<P[K]> {
  if (isNotFound(parent)) {
    return newNotFound();
  } else if (isLoading(parent)) {
    return newLoading();
  }

  return newLoaded<P[K]>(parent.data[key]);
}

/**
 * Forcefully converts a NotFoundable to a Loadable. If is NotFound then throws an error. Use when Typescript type narrowing cannot detect that the type will never be NotFound.
 * @param notFoundable The NotFoundable
 * @returns NotFoundable as Loadable
 */
export function notFoundableAsLoadable<D>(notFoundable: NotFoundable<D>): Loadable<D> {
  if (isNotFound(notFoundable)) {
    throw new Error("Not found");
  }

  return notFoundable;
}