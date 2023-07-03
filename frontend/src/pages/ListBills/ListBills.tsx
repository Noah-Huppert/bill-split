import { useEffect, useState, useContext, useCallback } from "react";
import KayakingIcon from "@mui/icons-material/Kayaking";
import { Box, Button, IconButton, List, ListItemButton, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import ListAltIcon from '@mui/icons-material/ListAlt';
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
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell>Items</TableCell>
						<TableCell>People</TableCell>
						<TableCell width="10"></TableCell>
					</TableRow>
				</TableHead>	
				<TableBody>
					{bills.map((bill) => (
						<BillItem key={bill._id} bill={bill} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
  );
}

function BillItem({ bill }: { readonly bill: IBill }) {
  const navigate = useNavigate();
	const onClick = () => navigate(ROUTES.bills.getById(bill._id));

  return (
    <TableRow hover={true} onClick={onClick} sx={{
			":hover": {
				cursor: "pointer",
			},
		}}>
			<TableCell>{bill.name}</TableCell>
			<TableCell>{bill.lineItems.length}</TableCell>
			<TableCell>{bill.users.length}</TableCell>
			<TableCell>
				<IconButton
					onClick={onClick}>
					<ListAltIcon fontSize="small" />
					<Typography sx={{
						marginLeft: "0.3rem",
					}}>
						View
					</Typography>
				</IconButton>
			</TableCell>
    </TableRow>
  );
}
