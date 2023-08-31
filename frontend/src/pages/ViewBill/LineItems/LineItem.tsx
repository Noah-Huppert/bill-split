import { useEffect, useState } from "react";
import { TextField, TableCell, TableRow } from "@mui/material";
import { ILineItem } from "../../../../../api/src/models/bill";
import { trpc } from "../../../trpc";
import { useDispatch } from "react-redux";
import { fetchBill } from "../../../store/bills/actions";
import { resolveSuccessOrErrored } from "../../../lib/errorable";
import { newLoadedOrNotFound } from "../../../lib/notFoundable";

export function LineItem({
  billID,
  lineItem,
}: {
  readonly billID: string,
  readonly lineItem: ILineItem,
}) {
  const dispatch = useDispatch();

  const [localLineItem, setLocalLineItem] = useState(lineItem);
  const [updateTimeout, setUpdateTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalLineItem(lineItem);
  }, [setLocalLineItem, lineItem]);

  const onChange = (updatedLineItem: ILineItem) => {
    setLocalLineItem(updatedLineItem);

    // Check if any pending updates
    if (updateTimeout !== null) {
      // Cancel update
      clearTimeout(updateTimeout);
      setUpdateTimeout(null);
    }

    // Schedule update for future
    setUpdateTimeout(setTimeout(async () => {
      dispatch(fetchBill({
        billID,
        bill: await resolveSuccessOrErrored(async () => newLoadedOrNotFound(await trpc.billUpdateLineItem.mutate({
          billID,
          lineItem: updatedLineItem,
        }))),
      }));
    }, 500));
  };

  return (
    <TableRow>
      <TableCell>
        <TextField
          value={localLineItem.name}
          onChange={(e) => onChange({
            ...localLineItem,
            name: e.target.value,
          })}
        />
      </TableCell>
      <TableCell>
        <TextField
          type="number"
          value={localLineItem.price}
          onChange={(e) => onChange({
            ...localLineItem,
            price: parseInt(e.target.value, 10),
          })}
          />
      </TableCell>
      <TableCell>{localLineItem.tags}</TableCell>
      <TableCell>{JSON.stringify(lineItem.usersSplit)}</TableCell>
    </TableRow>
  );
}