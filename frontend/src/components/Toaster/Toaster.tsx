import { Alert, Box } from "@mui/material";
import { useState, createContext, ReactNode, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Z_INDEXES } from "../../styles";

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
  autoHide?: boolean;

  /**
   * Number of milliseconds after toasts shows when it will close.
   * If autoHide=true and this is not set then defaults to {@link DEFAULT_TOAST_AUTO_HIDE_AFTER_MS}.
   */
  autoHideAfter?: number;
} & (
  | {
      _tag: "error";
      error: UserError;
    }
  | {
      _tag: "warning";
      message: string;
    }
  | {
      _tag: "info";
      message: string;
    }
  | {
      _tag: "success";
      message: string;
    }
);

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
export function Toaster({ children }: { readonly children: ReactNode }) {
  const [toasts, setToasts] = useState<{ [key: string]: Toast }>({});

  const hideToast = (uuid: string) => {
    const toastsCopy = { ...toasts };
    delete toastsCopy[uuid];

    setToasts(toastsCopy);
  };

  const showToast = useCallback(
    (toast: Toast) => {
      if (toast._tag === "error") {
        console.error(`${toast.error.userError}: ${toast.error.systemError}`);
      }
      const uuid = uuidv4();

      const toastsCopy = { ...toasts };
      toastsCopy[uuid] = toast;
      setToasts(toastsCopy);

      // Setup auto-hiding
      let autoHide = toast.autoHide;
      if (autoHide === undefined) {
        autoHide = true;
      }
      let autoHideAfter = toast.autoHideAfter;
      if (autoHide === true && autoHideAfter === undefined) {
        autoHideAfter = DEFAULT_TOAST_AUTO_HIDE_AFTER_MS;
      }

      if (autoHide === true) {
        setTimeout(() => {
          hideToast(uuid);
        }, autoHideAfter);
      }
    },
    [setToasts, hideToast]
  );

  return (
    <ToasterCtx.Provider value={showToast}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",

          zIndex: Z_INDEXES.alerts,
          position: "absolute",

          width: "100%",
          padding: "0.5rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {Object.keys(toasts).map((uuid) => (
            <Alert
              key={uuid}
              severity={toasts[uuid]._tag}
              onClose={() => {
                hideToast(uuid);
              }}
              sx={{
                marginTop: "0.5rem",
                boxShadow: 2,
              }}
            >
              {getToastText(toasts[uuid])}
            </Alert>
          ))}
        </Box>
      </Box>
      {children}
    </ToasterCtx.Provider>
  );
}
