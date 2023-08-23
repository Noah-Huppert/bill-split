import "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

import { ILineItem } from "../../../../../api/src/models/bill";
import { NotFoundable, isNotFound } from "../../../lib/notFoundable";
import { Loadable, isLoaded, isLoading } from "../../../lib/loadable";
import { Loading } from "../../../components/Loading/Loading";
import { LineItem } from "./LineItem";
import { trpc } from "../../../trpc";
import { IBillWithoutImages } from "../../../../../api/src/endpoints.ts/bill";
import { Errorable, isErrored } from "../../../lib/errorable";

export function LineItems({
  billID,
  bill,
}: {
  readonly billID: string,
  readonly bill: Errorable<Error, Loadable<IBillWithoutImages>>
}) {
  return (
    <>
      <Paper
        sx={{
          flexBasis: "66%"
        }}
      >

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Users Split</TableCell>
              </TableRow>
            </TableHead>

            
            <TableBody>
              <LineItemsBody
                billID={billID}
                bill={bill}
              />
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}

function LineItemsBody({
  billID,
  bill,
}: {
  readonly billID: string,
  readonly bill: Errorable<Error, Loadable<IBillWithoutImages>>,
}) {
  if (isErrored(bill)) {
    console.error(`Error loading bill ${billID}: ${bill.error}`);

    return (
      <TableRow>
        <TableCell
          colSpan={4}
          sx={{
            borderBottom: "none",
            padding: "10%",
          }}
        >
          Error loading bill
        </TableCell>
      </TableRow>
    )
  }

  if (isLoading(bill.data)) {
    return (
      <TableRow>
        <TableCell
          colSpan={4}
          sx={{
            borderBottom: "none",
            padding: "10%",
          }}
        >
          <Loading/>
        </TableCell>
      </TableRow>
    )
  }

  if (bill.data.data.lineItems.length === 0) {
    return (
      <TableRow>
        <TableCell
          colSpan={4}
          sx={{
            borderBottom: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "text.default",
              }}
            >
              <ReceiptLongIcon
                sx={{
                  fontSize: "6rem",
                }}
              />
              <Typography variant="h6">No Line Items</Typography>
            </Box>
          </Box>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {bill.data.data.lineItems.map((lineItem) => (
        <LineItem
          key={lineItem._id}
          billID={billID}
          lineItem={lineItem}
        />
      ))}
    </>
  )
}