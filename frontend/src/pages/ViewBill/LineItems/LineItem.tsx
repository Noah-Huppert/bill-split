import { useState } from "react";
import { ILineItem } from "../../../../../api/src/models/bill";
import { TextField, TableCell, TableRow } from "@mui/material";

export function LineItem({
  lineItem,
  onUpdate,
}: {
  readonly lineItem: ILineItem,
  readonly onUpdate: (lineItem: ILineItem) => Promise<void>,
}) {
  const [localLineItem, setLocalLineItem] = useState(lineItem);

  const localOnUpdate = async (updatedLineItem: ILineItem): Promise<void> => {
    // Send update to server
    await onUpdate(updatedLineItem);

    // Once successfully updated use new version of parent's line item
    setLocalLineItem(lineItem);
  };

  return (
    <TableRow>
      <TableCell>
        <TextField
          value={localLineItem.name}
          onChange={(e) => localOnUpdate({
            ...localLineItem,
            name: e.target.value,
          })}
        />
      </TableCell>
      <TableCell>{localLineItem.price}</TableCell>
      <TableCell>{localLineItem.tags}</TableCell>
      <TableCell>{JSON.stringify(lineItem.usersSplit)}</TableCell>
    </TableRow>
  );
}