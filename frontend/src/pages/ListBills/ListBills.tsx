import { useEffect, useState, useContext, useCallback } from "react";
import KayakingIcon from "@mui/icons-material/Kayaking";
import { Box, Button, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { Link, useNavigate } from "react-router-dom";

import { trpc } from "../../trpc";
import { ErrorReporter } from "../../components/ErrorBoundary/ErrorBoundary";
import { IBill } from "../../../../api/src/models/bill";
import { ROUTES } from "../../routes";
import "./ListBills.scss";
import { Loading } from "../../components/Loading/Loading";

export function ListBills() {
  return (
    <>
      <div className="list-bills-header">
        <Typography variant="h5">Bills</Typography>
        <Link to={ROUTES.bills.create}>
          <Button
            variant="contained"
            className="create-button"
            color="secondary"
          >
            <AddBusinessIcon fontSize="medium" />
            <div>New Bill</div>
          </Button>
        </Link>
      </div>

      <div className="margin-top-1">
        <BillsList />
      </div>
    </>
  );
}

function BillsList() {
  const [bills, setBills] = useState<IBill[] | null>(null);
  const showError = useContext(ErrorReporter);

  const fetchBills = useCallback(async () => {
    setBills(await trpc.billList.query());
  }, [setBills]);
  useEffect(() => {
    fetchBills().catch((e) =>
      showError({
        userError: "Failed to get bills",
        systemError: e,
      })
    );
  }, [fetchBills]);

  if (!bills) {
    return <Loading />;
  }

  if (bills.length == 0) {
    return (
      <div className="bills-not-found">
        <KayakingIcon
          sx={{
            fontSize: "5rem",
          }}
        />
        <Typography variant="h5">No Bills</Typography>
      </div>
    );
  }

  return (
		<Box sx={{
			boxShadow: 10,
		}}>
			<List>
				{bills.map((bill) => (
					<BillItem key={bill._id} bill={bill} />
				))}
			</List>
		</Box>
  );
}

function BillItem({ bill }: { readonly bill: IBill }) {
  const navigate = useNavigate();

  return (
    <ListItemButton
      divider={true}
      onClick={() => navigate(ROUTES.bills.getById(bill._id))}
    >
      <ListItemText
        primary={bill.name}
        secondary={`${bill.lineItems.length} item(s) between ${bill.users.length} people`}
      />
    </ListItemButton>
  );
}
