import { z } from "zod";

import { TRPCError } from "@trpc/server";
import { publicProcedure } from "../trpc";
import { Bill, IBill, IImage, ILineItem } from "../models/bill";
import { Types } from "mongoose";

/**
 * Summary of a bill.
 */
export interface IBillSummary {
  /**
   * Unique ID of bill.
   */
  _id: string;

  /**
   * Name of bill.
   */
  name: string;

  /**
   * Number of line items in bill.
   */
  lineItemsCount: number;

  /**
   * Number of users in bill.
   */
  usersCount: number;
}

/**
 * Bill data but without any images.
 * Omitted because image data could be large.
 */
export interface IBillWithoutImages extends Omit<IBill, "images"> {}

/**
 * Line item fields, except ID, represented by Zod.
 */
const ZLineItemWithoutID = z.object({
  name: z.string(),
  price: z.number(),
  tags: z.array(z.string()),
  usersSplit: z.array(z.object({
    userID: z.string(),
    proportion: z.number(),
  })),
});

/**
 * Summary of available bills.
 * @returns List of bill summaries.
 */
const billList = publicProcedure.query(async (): Promise<IBillSummary[]> => {
  return await Bill.aggregate([
    {
      $project: {
        name: true,
        lineItemsCount: { $size: "$lineItems" },
        usersCount: { $size: "$users" },
      },
    },
  ]);
});

/**
 * Get details of specific bill by ID.
 * @prop id ID of bill
 * @returns Bill details (without images) or null if bill with ID is not found.
 */
const billGet = publicProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async (opts): Promise<IBillWithoutImages | null> => {
    return await Bill.findById(opts.input.id, {
      images: false,
    });
  });

/**
 * Get images attached to a bill.
 * Split into a separate endpoint in case images are large.
 * @prop id ID of the bill
 * @returns List of images or null if bill with ID is not found.
 */
const billGetImages = publicProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async (opts): Promise<IImage[] | null> => {
    const bill = await Bill.findById(opts.input.id, {
      images: true,
    });
    if (bill === null) {
      return null;
    }

    return bill.images;
  });

/**
 * Creates a new bill.
 * @props name Name of the new bill
 * @returns Newly created bill (without images).
 */
const billCreate = publicProcedure
  .input(
    z.object({
      name: z.string(),
    })
  )
  .mutation(async (opts): Promise<IBillWithoutImages> => {
    const bill = new Bill({
      name: opts.input.name,
      users: [],
      lineItems: [],
      tags: [],
      proportionalCharges: [],
      images: [],
    });

    await bill.save();

    return {
      _id: bill._id,
      name: bill.name,
      users: bill.users,
      lineItems: bill.lineItems,
      tags: bill.tags,
      proportionalCharges: bill.proportionalCharges,
    };
  });

/**
 * Add images to a bill.
 * @prop id ID of bill
 * @props images The images to upload
 * @returns All images for the bill, including newly uploaded images. Returns null if bill with ID doesn't exist.
 */
const billUploadImages = publicProcedure
  .input(
    z.object({
      id: z.string(),
      images: z.array(
        z.object({
          mimeType: z.string(),
          base64Data: z.string(),
        })
      ),
    })
  )
  .mutation(async (opts): Promise<IImage[] | null> => {
    const newBill = await Bill.findOneAndUpdate(
      {
        _id: opts.input.id,
      },
      {
        $push: {
          images: {
            $each: opts.input.images.map((image) => {
              return {
                ...image,
                _id: new Types.ObjectId(),
              };
            }),
          },
        },
      },
      {
        new: true,
      }
    );

    if (newBill === undefined || newBill === null) {
      return null;
    }

    return newBill.images;
  });

/**
 * Delete an image from a bill.
 * @prop billID ID of bill to which image belongs
 * @prop imageID ID of image to delete
 * @returns New bill images or null if bill or image does not exist
 */
const billDeleteImage = publicProcedure
  .input(
    z.object({
      billID: z.string(),
      imageID: z.string(),
    })
  )
  .mutation(async (opts): Promise<IImage[] | null> => {
    const newBill = await Bill.findOneAndUpdate(
      {
        _id: opts.input.billID,
      },
      {
        $pull: {
          images: {
            _id: opts.input.imageID,
          },
        },
      },
      {
        new: true,
      }
    );

    if (newBill === undefined || newBill === null) {
      return null;
    }

    return newBill.images;
  });

/**
 * Response to adding a line item.
 */
export interface IAddLineItemResponse {
  /**
   * Updated bill with new line item.
   */
  bill: IBill
  
  /**
   * New line item specifically added.
   */
  lineItem: ILineItem
}

/**
 * Adds a line item to a bill.
 * @prop billID ID of bill
 * @prop lineItem The new line item to add, if null initializes empty line item
 * @returns The new line item. Returns null if the bill with billID doesn't exist
 */
const billAddLineItem = publicProcedure
  .input(
    z.object({
      billID: z.string(),
      lineItem: z.nullable(ZLineItemWithoutID),
    })
  )
  .mutation(async (opts): Promise<IAddLineItemResponse | null> => {
    const inputLineItem = opts.input.lineItem || {
      name: "",
      price: 0,
      tags: [],
      usersSplit: [],
    };

    const lineItem = {
      ...inputLineItem,
      _id: new Types.ObjectId().toString(),
      usersSplit: inputLineItem.usersSplit.map((split) => {
        return {
          ...split,
          _id: new Types.ObjectId().toString(),
        };
      }),
    };

    const updatedBill = await Bill.findOneAndUpdate(
      {
        _id: opts.input.billID,
      },
      {
        lineItems: {
          $push: lineItem,
        }
      }
    );

    if (updatedBill === null) {
      return null;
    }

    return {
      bill: updatedBill,
      lineItem,
    };
  });

/**
 * Update a line item in the bill.
 * @prop billID ID of the bill in which to update the line item
 * @prop lineItem The new line item values
 * @returns Updated line item, or null if the bill or line item could not be found
 */
const billUpdateLineItem = publicProcedure
  .input(
    z.object({
      billID: z.string(),
      lineItem: ZLineItemWithoutID.extend({
        _id: z.string(),
      }),
    })
  )
  .mutation(async (opts): Promise<ILineItem | null> => {
    const updatedBill = await Bill.findOneAndUpdate({
      _id: opts.input.billID,
      "lineItems._id": opts.input.lineItem._id,
    }, {
      $set: {
        "lineItems.$": opts.input.lineItem,
      },
    }, {
      new: true,
    });

    if (updatedBill === null) {
      return null;
    }

    const matchedLineItems = updatedBill.lineItems.filter((lineItem) => lineItem._id === opts.input.lineItem._id);
    if (matchedLineItems.length > 1) {
      // There should only ever be one line item with an _id in the array
      console.error(`More than one line item with the same ID found for bill '${opts.input.billID}: ${matchedLineItems}`);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An internal error occurred",
      });
    } else if (matchedLineItems.length == 1) {
      // Updated successfully
      return matchedLineItems[0];
    } else {
      // Line item not found
      return null;
    }
  });

export const endpoints = {
  billList,
  billGet,
  billGetImages,
  billCreate,
  billUploadImages,
  billDeleteImage,
  billAddLineItem,
  billUpdateLineItem,
};
