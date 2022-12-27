import { router } from "../trpc";
import { authRouter } from "./auth";
import { cartRouter } from "./cart";
import { exampleRouter } from "./example";
import { orderRouter } from "./orders";
import { paymentRouter } from "./payment";
import { productRouter } from "./product";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  product:productRouter,
  cart: cartRouter,
  payment:paymentRouter,
  order:orderRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
