import { Alert } from "@mui/material";
import { useState, createContext, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";

/**
 * User friendly error message.
 */
export interface UserError {
  /**
   * Message to show to users.
   */
  userError: string;

  /**
   * Internal error message with technical details.
   */
  systemError: string;
}

/**
 * Default value for Toast.autoHideAfter.
 */
const DEFAULT_TOAST_AUTO_HIDE_AFTER_MS = 5000;

/**
 * A toast to display.
 */
export type Toast = {
  /**
   * If true then the toast will self close after {@link autoHideAfter}.
   * If not set then defaults to true.
   */
  autoHide?: boolean,

  /**
   * Number of milliseconds after toasts shows when it will close.
   * If autoHide=true and this is not set then defaults to {@link DEFAULT_TOAST_AUTO_HIDE_AFTER_MS}.
   */
  autoHideAfter?: number,
} & ({
  _tag: "error",
  error: UserError
} | {
  _tag: "warning",
  message: string,
} | {
  _tag: "info",
  message: string,
} | {
  _tag: "success",
  message: string,
});

/**
 * Given a toast get the user facing message.
 * @param toast The toast to get user facing text for
 * @returns User facing message for toast
 */
function getToastText(toast: Toast) {
  if (toast._tag === "error") {
    return toast.error.userError;
  }

  return toast.message;
}

/**
 * Show toast context provider.
 */
export const ToasterCtx = createContext((_: Toast) => {});

/**
 * Implements context provider.
 */
export function Toaster({
  children,
}: {
  readonly children: ReactNode,
}) {
  const [toasts, setToasts] = useState<{[key: string]: Toast}>({});

  const showToast = (toast: Toast) => {
    if (toast._tag === "error") {
      console.error(`${toast.error.userError}: ${toast.error.systemError}`);
    }
    const uuid = uuidv4();

    setToasts({
      ...toasts,
      [uuid]: toast,
    });

    let autoHide = toast.autoHide;
    if (autoHide === undefined) {
      autoHide = true;
    }
    let autoHideAfter = toast.autoHideAfter;
    if (autoHide === true && autoHideAfter === undefined) {
      autoHideAfter = DEFAULT_TOAST_AUTO_HIDE_AFTER_MS;
    }

    setTimeout(() => {
      if (uuid in toasts) {
        const toastsCopy = {...toasts};
        delete toastsCopy[uuid];
        setToasts(toastsCopy);
      }
    }, autoHideAfter);
  };

  return (
    <ToasterCtx.Provider value={showToast}>
      {Object.keys(toasts).map((uuid) => (
          <Alert
            key={uuid}
            severity={toasts[uuid]._tag}
            onClose={() => {
              const toastsCopy = {...toasts};
              delete toastsCopy[uuid];
              setToasts(toastsCopy);
            }}
          >
            {getToastText(toasts[uuid])}
          </Alert>
        ))}
      {children}
    </ToasterCtx.Provider>
  );
}