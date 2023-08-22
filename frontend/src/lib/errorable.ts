/**
 * Data which can either be in an error state or a success state.
 * @typeParam F Error data type
 * @typeParam S Success data type
 */
export type Errorable<F, S> = Errored<F> | Success<S>;

/**
 * Indicates data is an error state.
 * @typeParam F Error data type
 */
export type Errored<F> = {
  _tag: "errored",
  error: F,
}

/**
 * Indicates data is a success state.
 * @typeParam S Success data type
 */
export type Success<S> = {
  _tag: "success",
  data: S,
}

/**
 * Create a new errored state of an Errorable.
 * @typeParam F Error data type
 * @typeParam S Success data type
 * @param error Error data
 * @returns New error state errorable
 */
export const newErrored = <F, S,>(error: F): Errorable<F, S> => {
  return {
    _tag: "errored",
    error,
  };
}

/**
 * Create a new success state of an Errorable.
 * @typeParam F Error data type
 * @typeParam S Success data type
 * @param success Success data
 * @returns New success state errorable
 */
export const newSuccess = <F, S,>(success: S): Errorable<F, S> => {
  return {
    _tag: "success",
    data: success,
  };
}

/**
 * Type guard to determine if errorable is an error.
 * @typeParam F Error data type
 * @typeParam S Success data type
 */
export const isErrored = <F, S,>(e: Errorable<F, S>): e is Errored<F> => e._tag === "errored";

/**
 * Type guard to determine if errorable is a success.
 * @typeParam F Error data type
 * @typeParam S Success data type
 */
export const isSuccess = <F, S,>(e: Errorable<F, S>): e is Success<S> => e._tag === "success";

export async function resolveSuccessOrErrored<S>(func: () => Promise<S>): Promise<Errorable<Error, S>> {
  try {
    return newSuccess(await func());
  } catch (e) {
    return newErrored(new Error(`${e}`));
  }
}