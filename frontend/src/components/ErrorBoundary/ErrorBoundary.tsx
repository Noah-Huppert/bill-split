import { Alert } from "@mui/material";
import React, { Component, ErrorInfo, ReactNode } from "react";
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

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  nonFatalErrors: { [key: string]: string };
}

/**
 * Context for showing errors to the user.
 */
export const ErrorReporter = React.createContext((_: UserError) => {});

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    nonFatalErrors: {},
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
      nonFatalErrors: {},
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <h1>Sorry.. there was an error</h1>;
    }

    const showErr = (err: UserError) => {
      console.error(`${err.userError}: ${err.systemError}`);
      const uuid = uuidv4();

      this.setState({
        nonFatalErrors: {
          ...this.state.nonFatalErrors,
          [uuid]: err.userError,
        },
      });

      setTimeout(() => {
        if (uuid in this.state.nonFatalErrors) {
          const newErrs = this.state.nonFatalErrors;
          delete this.state.nonFatalErrors[uuid];
          this.setState({
            nonFatalErrors: newErrs,
          });
        }
      }, 5000);
    };

    return (
      <ErrorReporter.Provider value={showErr}>
        {Object.keys(this.state.nonFatalErrors).map((uuid) => (
          <Alert
            key={uuid}
            severity="error"
            onClose={() => {
              const newErrs = this.state.nonFatalErrors;
              delete this.state.nonFatalErrors[uuid];
              this.setState({
                nonFatalErrors: newErrs,
              });
            }}
          >
            {this.state.nonFatalErrors[uuid]}
          </Alert>
        ))}
        {this.props.children}
      </ErrorReporter.Provider>
    );
  }
}

export default ErrorBoundary;
