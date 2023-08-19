import "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

import { ILineItem } from "../../../../../api/src/models/bill";
import { NotFoundable, isNotFound } from "../../../lib/notFoundable";
import { isLoaded, isLoading } from "../../../lib/loadable";
import { Loading } from "../../../components/Loading/Loading";
import { LineItem } from "./LineItem";
import { trpc } from "../../../trpc";

export function LineItems({
  billID,
  lineItems,
}: {
  readonly billID: NotFoundable<string>,
  readonly lineItems: NotFoundable<ILineItem[]>,
}) {
  const doUpdateLineItem = async (lineItem: ILineItem): Promise<ILineItem> => {
    // Bill not loaded
    if (!isLoaded(billID)) {
      throw new Error("Line item not updated because Bill not loaded");
    }

    const updatedLineItem = await trpc.billUpdateLineItem.mutate({
      billID: billID.data,
      lineItem,
    });
    if (updatedLineItem === null) {
      throw new Error("Line item could not be found to update");
    }
    return updatedLineItem;
  };

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
                  <LineItem
                    key={lineItem._id}
                    lineItem={lineItem}
                    remoteUpdate={doUpdateLineItem}
                  />
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