import "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

import { ILineItem } from "../../../../../api/src/models/bill";
import { NotFoundable, isNotFound } from "../../../lib/notFoundable";
import { isLoading } from "../../../lib/loadable";
import { Loading } from "../../../components/Loading/Loading";
import { LineItem } from "./LineItem";

export function LineItems({
  lineItems,
}: {
  readonly lineItems: NotFoundable<ILineItem[]>,
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
              {isLoading(lineItems) ? (
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
              ) : !isNotFound(lineItems) && lineItems.data.length > 0 ? lineItems.data.map((lineItem) => (
                  <LineItem key={lineItem._id} lineItem={lineItem} />
              )) : (
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
              )}
              </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}