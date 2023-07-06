/**
 * Represents a piece of data which is either loading or loaded.
 * @typeParam D The type of the loaded data
 */
export type Loadable<D> = Loading | Loaded<D>;

/**
 * Indicates data is loading.
 */
export type Loading = {
  _tag: "loading",
};

/**
 * Indicates data is loaded.
 * @typeParam D The type of the loaded data
 */
export type Loaded<D> = {
  _tag: "loaded",
  data: D,
};

/**
 * Type guard to check if Loadable is Loading.
 * @param loadable The loadable to type guard
 * @returns True if Loading
 */
export function isLoading(loadable: { _tag: string }): loadable is Loading {
  return loadable._tag === "loading";
}

/**
 * Type guard to check if Loadable is Loaded.
 * @param loadable The loadable to type guard
 * @typeParam D The type of the loaded data
 * @returns True if Loaded
 */
export function isLoaded<D>(loadable: { _tag: string, data?: D }): loadable is Loaded<D> {
  return loadable._tag === "loaded";
}

/**
 * Create a new Loading object.
 * @returns New Loading object
 */
export function newLoading(): Loading {
  return {
    _tag: "loading",
  };
}

/**
 * Create a new Loaded object.
 * @param data The loaded data
 * @typeParam D The type of the loaded data
 * @returns New Loaded object
 */
export function newLoaded<D>(data: D): Loaded<D> {
  return {
    _tag: "loaded",
    data,
  };
}