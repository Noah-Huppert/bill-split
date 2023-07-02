import { useEffect, useState, useContext } from "react";

import { trpc } from "../App";
import { ErrorReporter } from "../components/ErrorBoundary";

export function Home() {
  const [bills, setBills] = useState<ReturnType<trpc.billList.query>[]>([]);
  const showError = useContext(ErrorReporter);

  const fetchBills = async () => {
    setBills(await trpc.billList.query());
  };
  useEffect(() => {
    fetchBills().catch((e) => showError({
		userError: "Failed to get bills",
		systemError: e,
	}));
  }, [fetchBills]);
  return <>Bills: {JSON.stringify(bills)}</>;
}
