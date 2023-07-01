import { publicProcedure } from "../trpc";

export const endpoints = {
  billList: publicProcedure.query(async () => {}),
};
