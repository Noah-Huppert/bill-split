import { FormEvent, useState, useContext } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  CardContent,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import { trpc } from "../../trpc";
import { ToasterCtx } from "../../components/Toaster/Toaster";
import { ROUTES } from "../../routes";

export function CreateBill() {
  const toast = useContext(ToasterCtx);
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
      toast({
        _tag: "error",
        error: {
          userError: "Failed to create bill",
          systemError: String(e),
        },
      });
    }
  };

  return (
    <>
      <Breadcrumbs>
        <Link to={ROUTES.bills.list}>Bills</Link>
        <div>Create</div>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          sx={{
            marginTop: "1rem",
            flexGrow: 1,
            maxWidth: "40rem",
          }}
        >
          <CardContent>
            <Typography variant="h5">New Bill</Typography>

            <Typography variant="subtitle1">
              Create a new bill. Split line items, tip, and tax.
            </Typography>

            <Box
              sx={{
                marginTop: "2rem",
              }}
            >
              <form onSubmit={onSubmit}>
                <TextField
                  label="Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <Box
                  sx={{
                    marginTop: "2rem",
                  }}
                >
                  <Button color="secondary" variant="contained" type="submit">
                    Create
                  </Button>
                </Box>
              </form>
            </Box>
          </CardContent>
        </Paper>
      </Box>
    </>
  );
}
