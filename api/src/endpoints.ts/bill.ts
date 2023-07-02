import { z } from "zod";

import { publicProcedure } from "../trpc";
import { Bill, IBill } from "../models/bill";

export const endpoints = {
  billList: publicProcedure.query(async (): Promise<IBill[]> => {
    return await Bill.find({});
  }),

  billGet: publicProcedure.input(z.object({
    id: z.string(),
  })).query(async (opts): Promise<IBill | null> => {
    return  await Bill.findById(opts.input.id);
  }),

  billCreate: publicProcedure.input(z.object({
    name: z.string()
  })).mutation(async (opts): Promise<IBill> => {
    return await Bill.create({
      name: opts.input.name,
      users: [],
      lineItems: [],
      tags: [],
      proportionalCharges: [],
    });
  }),
};
