import { useEffect, useState, useContext, useCallback } from "react";

import { trpc } from "../App";
import { ErrorReporter } from "../components/ErrorBoundary";
import { IBill } from "../../../api/src/models/bill";
import { CircularProgress, List, ListItemButton, ListItemText } from "@mui/material";

export function Home() {
  return (
		<>
			<BillsList />
		</>
	);
}

function BillsList() {
	const [bills, setBills] = useState<ReturnType<trpc.billList.query>[]>([]);
  const showError = useContext(ErrorReporter);

  const fetchBills = useCallback(async () => {
    setBills(await trpc.billList.query());
  }, [setBills]);
  useEffect(() => {
    fetchBills().catch((e) => showError({
		userError: "Failed to get bills",
		systemError: e,
	}));
  }, [fetchBills]);

	if (!bills) {
		return (
			<CircularProgress />
		);
	}

	if (bills.length == 0) {
		return <>No bills...</>
	}

	return (
		<List>
		{bills.map(bill => (
			<BillItem bill={bill} />
		))}
		</List>
	)
}

function BillItem({
	bill,
}: {
	readonly bill: IBill,
}) {
	return (
		<ListItemButton>
			<ListItemText primary={bill.name} secondary={`${bill.lineItems.length} item(s) between ${bill.users.length} people`} />
		</ListItemButton>
	)
}