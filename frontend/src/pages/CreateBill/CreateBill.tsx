import { FormEvent, useState, useContext } from "react";
import {
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import { trpc } from "../../trpc";
import { ErrorReporter } from "../../components/ErrorBoundary/ErrorBoundary";
import "./CreateBill.scss";
import { ROUTES } from "../../routes";

export function CreateBill() {
  const reportError = useContext(ErrorReporter);
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const bill = await trpc.billCreate.mutate({
        name,
      });

      navigate(ROUTES.bills.getById(bill._id));
    } catch (e) {
      reportError({
        userError: "Failed to create bill",
        systemError: String(e),
      });
    }
  };

  return (
    <>
      <Breadcrumbs>
        <Link to={ROUTES.bills.list}>Bills</Link>
        <div>Create</div>
      </Breadcrumbs>

      <div className="create-bill-container">
        <Paper className="margin-top-1 create-bill-card">
          <CardContent>
            <Typography variant="h5">New Bill</Typography>

            <Typography variant="subtitle1">
              Create a new bill. Split line items, tip, and tax.
            </Typography>

            <form className="margin-top-2" onSubmit={onSubmit}>
              <TextField
                label="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className="margin-top-2">
                <Button color="secondary" variant="contained" type="submit">
                  Create
                </Button>
              </div>
            </form>
          </CardContent>
        </Paper>
      </div>
    </>
  );
}
