import { useEffect, useState, useContext, useCallback } from "react";
import KayakingIcon from '@mui/icons-material/Kayaking';
import { Button, CircularProgress, List, ListItemButton, ListItemText } from "@mui/material";
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { Link } from "react-router-dom";

import { trpc } from "../../App";
import { ErrorReporter } from "../../components/ErrorBoundary";
import { IBill } from "../../../../api/src/models/bill";
import { ROUTES } from "../../routes";
import "./ListBills.scss";

export function ListBills() {
  return (
		<>
			<div className="list-bills-header">
				<div className="font-title">
					Bills
				</div>
				<Link to={ROUTES.bills.create}>
					<Button variant="contained" className="create-button" color="secondary">
						<AddBusinessIcon fontSize="medium" />
						<div>
							New Bill
						</div>
					</Button>
				</Link>
			</div>
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
		return <div className="bills-not-found">
			<KayakingIcon sx={{
				fontSize: "5rem",
			}} />
			<p className="font-title">No Bills</p>
		</div>
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