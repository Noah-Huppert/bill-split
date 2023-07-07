import "react";
import { ILineItem } from "../../../../../api/src/models/bill";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { NotFoundable, isNotFound } from "../../../lib/notFoundable";
import { isLoaded, isLoading } from "../../../lib/loadable";
import { Loading } from "../../../components/Loading/Loading";

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
                <Loading />
              ) : isNotFound(lineItems) ? (
                <>
                  Not found
                </>
              ) : lineItems.data.map((lineItem) => (
                <TableRow key={lineItem._id}>
                  <TableCell>{lineItem.name}</TableCell>
                  <TableCell>{lineItem.price}</TableCell>
                  <TableCell>{lineItem.tags}</TableCell>
                  <TableCell>{JSON.stringify(lineItem.usersSplit)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}