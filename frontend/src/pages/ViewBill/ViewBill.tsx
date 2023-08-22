import {
  useContext,
  useCallback,
  useEffect,
} from "react";
import { Box, Breadcrumbs, Button, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Link, useParams } from "react-router-dom";

import { ROUTES } from "../../routes";
import { trpc } from "../../trpc";
import { ToasterCtx } from "../../components/Toaster/Toaster";
import { IBill, IImage } from "../../../../api/src/models/bill";
import { ImageUploadDetails, Images } from "./Images/Images";
import { IBillWithoutImages } from "../../../../api/src/endpoints.ts/bill";
import { Loadable, isLoaded, isLoading, newLoading } from "../../lib/loadable";
import {
  NotFoundable,
  isNotFound,
  newLoadedOrNotFound,
  newNotFound,
  newNotFoundableFromKey,
  notFoundableAsLoadable,
} from "../../lib/notFoundable";
import { LineItems } from "./LineItems/LineItems";
import { fetchBill, fetchBillImages } from "../../store/bills/actions";
import { selectBillByID, selectBillImagesByID } from "../../store/bills/selectors";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../store";
import { Errorable, isErrored, isSuccess, newErrored, newSuccess, resolveSuccessOrErrored } from "../../lib/errorable";

export function ViewBill() {
  const dispatch = useDispatch();

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

  const bill = useSelector((state: State) => selectBillByID(state, id));
  const billImages = useSelector((state: State) => selectBillImagesByID(state, id));

  const doFetchBill = useCallback(async () => {
    // Set loading
    dispatch(fetchBill({
      billID: id,
      bill: newSuccess(newLoading()),
    }));

    dispatch(fetchBill({
      billID: id,
      bill: await resolveSuccessOrErrored(async () => newLoadedOrNotFound(await trpc.billGet.query({ id }))),
    }));
  }, [dispatch, fetchBill, id, newLoadedOrNotFound]);

  const doFetchBillImages = useCallback(async () => {
    // Set loading
    dispatch(fetchBillImages({
      billID: id,
      images: newSuccess(newLoading()),
    }));

    dispatch(fetchBillImages({
      billID: id,
      images: await resolveSuccessOrErrored(async () => newLoadedOrNotFound(await trpc.billGetImages.query({ id }))),
    }));
  }, [dispatch, fetchBillImages, id, newLoadedOrNotFound]);

  // Get bill when component loads
  useEffect(() => {
    doFetchBill();
  }, [doFetchBill]);

  // Get bill images when component loads
  useEffect(() => {
    doFetchBillImages();
  }, [doFetchBillImages]);

  const onImageUpload = async (images: ImageUploadDetails[]): Promise<void> => {
    dispatch(fetchBillImages({
      billID: id,
      images: await resolveSuccessOrErrored(async () => newLoadedOrNotFound(
        await trpc.billUploadImages.mutate({
          id: id,
          images: images,
        })
      ))
    }));
  };

  const onImageDelete = async (imageID: string): Promise<void> => {
    dispatch(fetchBillImages({
      billID: id,
      images: await resolveSuccessOrErrored(async () => newLoadedOrNotFound(
        await trpc.billDeleteImage.mutate({
          billID: id,
          imageID: imageID,
        })
      ))
    }));
  };

  if ((isSuccess(bill) && isNotFound(bill)) || isNotFound(billImages)) {
    return (
      <>
        <ViewBillBreadcrumbs bill={bill} />
        <Typography variant="h5">Bill Not Found</Typography>
      </>
    );
  }

  const onAddLineItem = async (): Promise<void> => {
    // Can't add line item if bill is loading or failed to load
    if (isErrored(bill) || isLoading(bill.data)) {
      return;
    }
    
    dispatch(fetchBill({
      billID: id,
      bill: await resolveSuccessOrErrored(async () => newLoadedOrNotFound(await trpc.billAddLineItem.mutate({
        billID: id,
        lineItem: null,
      }))),
    }));
  };

  if (isSuccess(bill) && isNotFound(bill.data) || isSuccess(billImages) && isNotFound(billImages)) {
    return (
      <>
        <ViewBillBreadcrumbs bill={bill} />

        <Typography variant="h1">
          Bill not found
        </Typography>
      </>
    );
  }

  const foundBill: Errorable<Error, Loadable<IBillWithoutImages>> = isSuccess(bill) ? newSuccess(notFoundableAsLoadable(bill.data)) : bill;
  const foundBillImages: Errorable<Error, Loadable<IImage[]>> = isSuccess(billImages) ? newSuccess(notFoundableAsLoadable(billImages.data)) : billImages;

  return (
    <>
      <ViewBillBreadcrumbs bill={bill} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Button
            sx={{
              display: "flex",
              maxWidth: "20rem",
              alignSelf: "end",
              marginBottom: "1rem",
            }}
            variant="contained"
            onClick={onAddLineItem}
          >
            <AddCircleOutlineIcon
              sx={{
                marginRight: "1rem",
              }}
            />
            Line Item
          </Button>
          <LineItems
            billID={id}
            bill={foundBill}
          />
        </Box>
        <Images
          onUpload={onImageUpload}
          onDelete={onImageDelete}
          images={foundBillImages}
        />
      </Box>
    </>
  );
}

function ViewBillBreadcrumbs({
  bill,
}: {
  readonly bill: Errorable<Error, NotFoundable<IBillWithoutImages>>;
}) {
  return (
    <Breadcrumbs
      sx={{
        marginBottom: "1rem",
      }}
    >
      <Link to={ROUTES.bills.list}>Bills</Link>
      <div>{isSuccess(bill) && isLoaded(bill.data) ? bill.data.data.name : "..."}</div>
    </Breadcrumbs>
  );
}
