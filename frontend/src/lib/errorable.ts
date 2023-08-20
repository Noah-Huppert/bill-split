import { Either, Left, Right, isLeft, isRight, left, right } from "fp-ts/lib/Either";

/**
 * Data which can either be in an error state or a success state.
 * @typeParam F Error data type
 * @typeParam S Success data type
 */
export type Errorable<F, S> = Either<F, S>;

/**
 * Indicates data is an error state.
 * @typeParam F Error data type
 */
export type Errored<F> = Left<F>;

/**
 * Indicates data is a success state.
 * @typeParam S Success data type
 */
export type Success<S> = Right<S>;

/**
 * Create a new errored state of an Errorable.
 * @typeParam F Error data type
 * @typeParam S Success data type
 * @param error Error data
 * @returns New error state errorable
 */
export const newErrored = <F, S,>(error: F): Errorable<F, S> => left(error);

/**
 * Create a new success state of an Errorable.
 * @typeParam F Error data type
 * @typeParam S Success data type
 * @param success Success data
 * @returns New success state errorable
 */
export const newSuccess = <F, S,>(success: S): Errorable<F, S> => right(success);

/**
 * Type guard to determine if errorable is an error.
 * @typeParam F Error data type
 * @typeParam S Success data type
 */
export const isErrored = <F, S,>(e: Errorable<F, S>): e is Errored<F> => isLeft(e);

/**
 * Type guard to determine if errorable is a success.
 * @typeParam F Error data type
 * @typeParam S Success data type
 */
export const isSuccess = <F, S,>(e: Errorable<F, S>): e is Success<S> => isRight(u);