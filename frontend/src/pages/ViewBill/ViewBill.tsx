import { useState, useContext, useCallback, useEffect } from "react";
import { Breadcrumbs, Paper, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import { ROUTES } from "../../routes";
import { trpc } from "../../trpc";
import { ToasterCtx } from "../../components/Toaster/Toaster";
import { IImage } from "../../../../api/src/models/bill";
import { Images } from "../../components/Images/Images";
import { IBillWithoutImages } from "../../../../api/src/endpoints.ts/bill";
import { Loadable, isLoaded, isLoading, newLoaded, newLoading } from "../../lib/loadable";
import { NotFoundable, isNotFound, newLoadedOrNotFound } from "../../lib/notFoundable";

export function ViewBill() {
  const { id } = useParams();
  const toast = useContext(ToasterCtx);

  if (!id) {
    toast({
      _tag: "error",
      error: {
        userError: "Invalid URL",
        systemError: "id parameter is undefined",
      },
    });
    return;
  }

  const [bill, setBill] = useState<NotFoundable<IBillWithoutImages>>(newLoading());
  const [billImages, setBillImages] = useState<NotFoundable<IImage[]>>(newLoading());

  const fetchBill = useCallback(async () => {
    setBill(newLoadedOrNotFound(await trpc.billGet.query({ id })));
  }, [setBill, newLoadedOrNotFound]);

  const fetchBillImages = useCallback(async () => {
    setBillImages(newLoadedOrNotFound(await trpc.billGetImages.query({ id })));
  }, [setBillImages, newLoadedOrNotFound]);

  useEffect(() => {
    fetchBill().catch((e) =>
      toast({
        _tag: "error",
        error: {
          userError: "Failed to get bill",
          systemError: e,
        },
      })
    );
  }, [fetchBill, toast]);

  useEffect(() => {
    fetchBillImages().catch((e) => toast({
      _tag: "error",
      error: {
        userError: "Failed to get bill images",
        systemError: e,
      },
    }))
  }, [fetchBillImages, toast]);

  if (isNotFound(bill) || isNotFound(billImages)) {
    return <Typography variant="h5">Bill Not Found</Typography>;
  }

  return (
    <>
      <Breadcrumbs>
        <Link to={ROUTES.bills.list}>Bills</Link>
        {isLoading(bill) ? ("...") : (
          <div>{bill.data.name}</div>
        )}
      </Breadcrumbs>
        
      <Images images={billImages} />
    </>
  );
}
