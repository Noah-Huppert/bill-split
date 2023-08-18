import { useState } from "react";
import { ILineItem } from "../../../../../api/src/models/bill";
import { Button, TableCell, TableRow } from "@mui/material";

export function LineItem({
  lineItem,
}: {
  readonly lineItem: ILineItem,
}) {
  const [editMode, setEditMode] = useState(false);

  const onViewModeClick = () => {
    setEditMode(true);
  };

  if (editMode === false) {
    return (
      <Button onClick={onViewModeClick}>
        <LineItemViewMode lineItem={lineItem} />
      </Button>
    );
  }


}

function LineItemEditMode({
  initialLineItem: ILineItem,
  onSave,
}: {
  readonly onSave: (lineItem: ILineItem) => Promise<void>
}) {
  return (
    <TableRow>
      <TableCell>{lineItem.name}</TableCell>
      <TableCell>{lineItem.price}</TableCell>
      <TableCell>{lineItem.tags}</TableCell>
      <TableCell>{JSON.stringify(lineItem.usersSplit)}</TableCell>
    </TableRow>
  );
}

function LineItemViewMode({
  lineItem,
}: {
  readonly lineItem: ILineItem,
}) {
  return (
    <TableRow>
      <TableCell>{lineItem.name}</TableCell>
      <TableCell>{lineItem.price}</TableCell>
      <TableCell>{lineItem.tags}</TableCell>
      <TableCell>{JSON.stringify(lineItem.usersSplit)}</TableCell>
    </TableRow>
  );
}