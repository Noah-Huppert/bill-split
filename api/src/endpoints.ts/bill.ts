import { publicProcedure } from "../trpc";
import { Bill, IBill } from "../models/bill";

export const endpoints = {
  billList: publicProcedure.query(async (): Promise<IBill[]> => {
    return await Bill.find({});
  }),
};
