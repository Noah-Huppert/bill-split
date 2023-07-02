import { z } from "zod";

import { publicProcedure } from "../trpc";
import { Bill, IBill } from "../models/bill";

export const endpoints = {
  billList: publicProcedure.query(async (): Promise<IBill[]> => {
    return await Bill.find({});
  }),
  
  billCreate: publicProcedure.input(z.object({
    name: z.string()
  })).mutation(async (opts) => {
    return await Bill.create({
      name: opts.input.name,
      users: [],
      lineItems: [],
      tags: [],
      proportionalCharges: [],
    });
  }),
};
