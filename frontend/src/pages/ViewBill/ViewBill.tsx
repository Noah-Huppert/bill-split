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
import { isLoaded, isLoading, newLoading } from "../../lib/loadable";
import {
  NotFoundable,
  isNotFound,
  newLoadedOrNotFound,
  newNotFound,
  newNotFoundableFromKey,
} from "../../lib/notFoundable";
import { LineItems } from "./LineItems/LineItems";
import { fetchBill, fetchBillImages } from "../../store/bills/actions";
import { selectBillByID, selectBillImagesByID } from "../../store/bills/selectors";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../store";

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

  const bill = useSelector<State>(state => selectBillByID(state, id));
  const billImages = useSelector<State>(state => selectBillImagesByID(state, id));

  const doFetchBill = useCallback(async () => {
    dispatch(fetchBill({
      billID: id,
      bill: newLoading(),
    }));

    const bill = newLoadedOrNotFound(await trpc.billGet.query({ id }));

    dispatch(fetchBill({
      billID: id,
      bill,
    }))


  }, [dispatch, fetchBill, id, newLoadedOrNotFound]);

  const doFetchBillImages = useCallback(async () => {
    dispatch(fetchBillImages({
      billID: id,
      images: newLoading(),
    }));

    const images = newLoadedOrNotFound(await trpc.billGetImages.query({ id }));

    dispatch(fetchBillImages({
      billID: id,
      images,
    }));
  }, [dispatch, fetchBillImages, id, newLoadedOrNotFound]);

  // Get bill when component loads
  useEffect(() => {
    doFetchBill().catch((e) => {
      toast({
        _tag: "error",
        error: {
          userError: "Failed to get bill",
          systemError: e,
        },
      });

      setBill(newNotFound());
    });
  }, [doFetchBill, toast, setBill]);

  // Get bill images when component loads
  useEffect(() => {
    doFetchBillImages().catch((e) => {
      toast({
        _tag: "error",
        error: {
          userError: "Failed to get bill images",
          systemError: e,
        },
      });

      setBillImages(newNotFound());
    });
  }, [doFetchBillImages, toast, setBillImages]);

  const onImageUpload = async (images: ImageUploadDetails[]): Promise<void> => {
    setBillImages(
      newLoadedOrNotFound(
        await trpc.billUploadImages.mutate({
          id: id,
          images: images,
        })
      )
    );
  };

  const onImageDelete = async (imageID: string): Promise<void> => {
    setBillImages(
      newLoadedOrNotFound(
        await trpc.billDeleteImage.mutate({
          billID: id,
          imageID: imageID,
        })
      )
    );
  };

  if (isNotFound(bill) || isNotFound(billImages)) {
    return (
      <>
        <ViewBillBreadcrumbs bill={bill} />
        <Typography variant="h5">Bill Not Found</Typography>
      </>
    );
  }

  const onAddLineItem = async (): Promise<void> => {
    // Can't add line item if bill is loading
    if (isLoading(bill)) {
      return;
    }
    
    const newLineItem = await trpc.billAddLineItem.mutate({
      billID: bill.data._id,
      lineItem: null,
    });

    if (newLineItem === null) {
      throw new Error("Failed to add new line item because bill doesn't exist");
    }

    setBill(newLoadedOrNotFound(newLineItem.bill));
  };

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
            billID={newNotFoundableFromKey(bill, "_id")}
            lineItems={newNotFoundableFromKey(bill, "lineItems")}
          />
        </Box>
        <Images
          onUpload={onImageUpload}
          onDelete={onImageDelete}
          images={billImages}
        />
      </Box>
    </>
  );
}

function ViewBillBreadcrumbs({
  bill,
}: {
  readonly bill: NotFoundable<IBillWithoutImages>;
}) {
  return (
    <Breadcrumbs
      sx={{
        marginBottom: "1rem",
      }}
    >
      <Link to={ROUTES.bills.list}>Bills</Link>
      <div>{!isLoaded(bill) ? "..." : bill.data.name}</div>
    </Breadcrumbs>
  );
}
