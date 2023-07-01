/**
 * A reciept to be split between users.
 */
export interface IBill {
    /**
     * Unique identifier.
     */
    id: string;

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
    id: string;

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
    id: string;

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
    usersSplit: {[key: string]: number};
}

/**
 * User who will split bill.
 */
export interface IUser {
    /**
     * Unique ID.
     */
    id: string;

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
    id: string;

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