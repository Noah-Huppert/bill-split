import { useState, useContext, useCallback, useEffect } from "react";
import { Breadcrumbs, Paper, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import { ROUTES } from "../../routes";
import { trpc } from "../../trpc";
import { ToasterCtx } from "../../components/Toaster/Toaster";
import { IImage } from "../../../../api/src/models/bill";
import { ImageUploadDetails, Images } from "../../components/Images/Images";
import { IBillWithoutImages } from "../../../../api/src/endpoints.ts/bill";
import {
  isLoading,
  newLoading,
} from "../../lib/loadable";
import {
  NotFoundable,
  isNotFound,
  newLoadedOrNotFound,
} from "../../lib/notFoundable";

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

  const [bill, setBill] = useState<NotFoundable<IBillWithoutImages>>(
    newLoading()
  );
  const [billImages, setBillImages] = useState<NotFoundable<IImage[]>>(
    newLoading()
  );

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
    fetchBillImages().catch((e) =>
      toast({
        _tag: "error",
        error: {
          userError: "Failed to get bill images",
          systemError: e,
        },
      })
    );
  }, [fetchBillImages, toast]);

  const onImageUpload = async (images: ImageUploadDetails[]): Promise<void> => {
    setBillImages(newLoadedOrNotFound(await trpc.billUploadImages.mutate({
      id: id,
      images: images,
    })));
  };

  const onImageDelete = async (imageID: string): Promise<void> => {
    setBillImages(newLoadedOrNotFound(await trpc.billDeleteImage.mutate({
      billID: id,
      imageID: imageID,
    })));
  };

  if (isNotFound(bill) || isNotFound(billImages)) {
    return <Typography variant="h5">Bill Not Found</Typography>;
  }

  return (
    <>
      <Breadcrumbs
        sx={{
          marginBottom: "1rem",
        }}
      >
        <Link to={ROUTES.bills.list}>Bills</Link>
        {isLoading(bill) ? "..." : <div>{bill.data.name}</div>}
      </Breadcrumbs>

      <Images onUpload={onImageUpload} onDelete={onImageDelete} images={billImages} />
    </>
  );
}
