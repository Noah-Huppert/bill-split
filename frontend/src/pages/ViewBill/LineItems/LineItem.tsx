import { useContext, useEffect, useState } from "react";
import { TextField, TableCell, TableRow } from "@mui/material";
import { useDebounce } from "usehooks-ts";
import { ILineItem } from "../../../../../api/src/models/bill";
import { ToasterCtx } from "../../../components/Toaster/Toaster";

export function LineItem({
  lineItem,
  remoteUpdate,
}: {
  readonly lineItem: ILineItem,
  readonly remoteUpdate: (lineItem: ILineItem) => Promise<ILineItem>,
}) {
  const toast = useContext(ToasterCtx);

  const [localLineItem, setLocalLineItem] = useState(lineItem);
  const debouncedLocalLineItem = useDebounce(localLineItem, 500);

  const doUpdate = async (updatedLineItem: ILineItem): Promise<void> => {
    // Send update to server
    const newLineItem = await remoteUpdate(updatedLineItem);

    // Set line item to display as the version returned by the server
    setLocalLineItem(newLineItem);
  };

  useEffect(() => {
    // Send updates about local line item to server
    doUpdate(debouncedLocalLineItem).catch((e) => toast({
      _tag: "error",
      error: {
        userError: "Failed to save line item",
        systemError: e.toString(),
      },
    }));
  }, [debouncedLocalLineItem]);

  return (
    <TableRow>
      <TableCell>
        <TextField
          value={localLineItem.name}
          onChange={(e) => setLocalLineItem({
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