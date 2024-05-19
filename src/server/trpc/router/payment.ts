import { TRPCError } from "@trpc/server";
import shortid from "shortid";
import { z } from "zod";
import { env } from "../../../env/server.mjs";
import { instanceFunction } from "../../../utils/razorpay";
import { publicProcedure, router } from "../trpc";


export const paymentRouter = router({
    checkOut: publicProcedure
    .input(z.object({
        amount:z.number()
    }))
    .mutation(async ({ctx,input}) => {
      
        const payment_capture = 1;
        const amount:number = input.amount;
        const currency = "INR";
        const options = {
          amount: (amount * 100).toString(),
          currency,
          receipt: shortid.generate(),
          payment_capture,
        };
        const instance = await instanceFunction(env.RAZORPAY_KEY_ID,env.RAZORPAY_KEY_SECRET)
        try {
          const response = await instance.orders.create(options);
          return {
            id:response.id,
            amount:response.amount,
            currency:response.currency
          }
        } catch (err) {
          console.log(err);
          throw new TRPCError({code:"INTERNAL_SERVER_ERROR",message:"payment could not be processed"})
        } 
    }),
    getRazorpayKey:publicProcedure
    .query(()=>{
        const key = env.RAZORPAY_KEY_ID;
        console.log(key)
        return key
    })
})