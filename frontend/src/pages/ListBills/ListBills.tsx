import { useEffect, useState, useContext, useCallback } from "react";
import KayakingIcon from "@mui/icons-material/Kayaking";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { Link, useNavigate } from "react-router-dom";

import { trpc } from "../../trpc";
import { ToasterCtx } from "../../components/Toaster/Toaster";
import { IBill } from "../../../../api/src/models/bill";
import { ROUTES } from "../../routes";
import "./ListBills.scss";
import { Loading } from "../../components/Loading/Loading";
import { IBillSummary } from "../../../../api/src/endpoints.ts/bill";

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
  const [bills, setBills] = useState<IBillSummary[] | null>(null);
  const toast = useContext(ToasterCtx);

  const fetchBills = useCallback(async () => {
    setBills(await trpc.billList.query());
  }, [setBills]);
  useEffect(() => {
    fetchBills().catch((e) =>
      toast({
        _tag: "error",
        error: {
          userError: "Failed to get bills",
          systemError: e,
        },
      })
    );
  }, [toast, fetchBills]);

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
            <BillItem key={bill._id} billSummary={bill} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function BillItem({ billSummary }: { readonly billSummary: IBillSummary }) {
  const navigate = useNavigate();
  const onClick = () => navigate(ROUTES.bills.getById(billSummary._id));

  return (
    <TableRow
      hover={true}
      onClick={onClick}
      sx={{
        ":hover": {
          cursor: "pointer",
        },
      }}
    >
      <TableCell>{billSummary.name}</TableCell>
      <TableCell>{billSummary.lineItemsCount}</TableCell>
      <TableCell>{billSummary.usersCount}</TableCell>
      <TableCell>
        <IconButton onClick={onClick}>
          <ListAltIcon fontSize="small" />
          <Typography
            sx={{
              marginLeft: "0.3rem",
            }}
          >
            View
          </Typography>
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
