import { Schema, model, Types } from "mongoose";

/**
 * A receipt to be split between users.
 */
export interface IBill {
  /**
   * Unique identifier.
   */
  id: Types.ObjectId;

  /**
   * Name of bill.
   */
  name: string;

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
 * Label to categorize line items.
 */
export interface ITag {
  /**
   * Unique ID.
   */
  id: Types.ObjectId;

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
  id: Types.ObjectId;

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
  tags: Types.ObjectId[];

  /**
   * How much each user owes for this item.
   * Keys are user IDs, values are [0, 1] percentage split the user will pay.
   */
  usersSplit: {
    id: Types.ObjectId;
    userID: Types.ObjectId;
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
  id: Types.ObjectId;

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
  id: Types.ObjectId;

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
  users: [
    {
      id: { type: Types.ObjectId, alias: "_id", required: true },
      name: { type: String, required: true },
    },
  ],
  tags: [
    {
      id: { type: Types.ObjectId, alias: "_id", required: true },
      name: { type: String, required: true },
    },
  ],
  lineItems: [
    {
      id: { type: Types.ObjectId, alias: "_id", required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      tags: [{ type: Types.ObjectId, required: true }],
      usersSplit: [
        {
          id: { type: Types.ObjectId, alias: "_id", required: true },
          userID: { type: Types.ObjectId, required: true },
          proportion: { type: Number, required: true },
        },
      ],
    },
  ],
  proportionalCharges: [
    {
      id: { type: Types.ObjectId, alias: "_id", required: true },
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