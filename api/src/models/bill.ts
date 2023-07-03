import { Schema, model, Types } from "mongoose";

/**
 * A receipt to be split between users.
 */
export interface IBill {
  /**
   * Unique identifier.
   */
  _id: string;

  /**
   * Name of bill.
   */
  name: string;

  /**
   * Images of receipt.
   */
  images: IImage[];

  /**
   * Users which will split the items.
   */
  users: IUser[];

  /**
   * Labels which categorize line items.
   */
  tags: ITag[];

  /**
   * Items which comprise the cost.
   */
  lineItems: ILineItem[];

  /**
   * Costs based on a propotion of the line items.
   */
  proportionalCharges: IProportionalCharge[];
}

/**
 * Image of receipt.
 */
export interface IImage {
  /**
   * Unique ID.
   */
  _id: string;

  /**
   * MIME type of image.
   */
  mimeType: string;

  /**
   * Base 64 encoded data of image.
   */
  base64Data: string;
}

/**
 * Label to categorize line items.
 */
export interface ITag {
  /**
   * Unique ID.
   */
  _id: string;

  /**
   * User facing title.
   */
  name: string;
}

/**
 * Item on receipt which cost money.
 */
export interface ILineItem {
  /**
   * Unique ID.
   */
  _id: string;

  /**
   * User facing title.
   */
  name: string;

  /**
   * Financial charge associated with item.
   */
  price: number;

  /**
   * IDs of tags for item.
   */
  tags: string[];

  /**
   * How much each user owes for this item.
   * Keys are user IDs, values are [0, 1] percentage split the user will pay.
   */
  usersSplit: {
    _id: string;
    userID: string;
    proportion: number;
  }[];
}

/**
 * User who will split bill.
 */
export interface IUser {
  /**
   * Unique ID.
   */
  _id: string;

  /**
   * Name of user.
   */
  name: string;
}

/**
 * A cost that must be split based on the proportion of the bill.
 * Example: tax or tip.
 */
export interface IProportionalCharge {
  /**
   * Unique Id.
   */
  _id: string;

  /**
   * User facing title.
   */
  name: string;

  /**
   * IDs of tags which line items must have to be included in the total cost from which the proportion will be calculated.
   * Null if all items should be taken into account.
   */
  filterTags: string[] | null;

  /**
   * Number from [0, 1] indicating how much of total cost of the line items will make up the charge.
   */
  proportion: number;
}

/**
 * Mongoose schema representation of {@link IBill}.
 */
const BillSchema = new Schema<IBill>({
  name: { type: String, required: true },
  images: [
    {
      _id: { type: Types.ObjectId, required: true },
      mimeType: { type: String, required: true },
      base64Data: { type: String, required: true },
    },
  ],
  users: [
    {
      _id: { type: Types.ObjectId, required: true },
      name: { type: String, required: true },
    },
  ],
  tags: [
    {
      _id: { type: Types.ObjectId, required: true },
      name: { type: String, required: true },
    },
  ],
  lineItems: [
    {
      _id: { type: Types.ObjectId, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      tags: [{ type: Types.ObjectId, required: true }],
      usersSplit: [
        {
          _id: { type: Types.ObjectId, required: true },
          userID: { type: Types.ObjectId, required: true },
          proportion: { type: Number, required: true },
        },
      ],
    },
  ],
  proportionalCharges: [
    {
      _id: { type: Types.ObjectId, required: true },
      name: { type: String, required: true },
      filterTags: {
        type: [
          {
            type: String,
          },
        ],
        default: null,
      },
      proportion: { type: Number, required: true },
    },
  ],
});

/**
 * Model repository for {@link IBill}.
 */
export const Bill = model<IBill>("Bill", BillSchema);