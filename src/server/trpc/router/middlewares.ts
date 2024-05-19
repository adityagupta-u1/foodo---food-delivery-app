import { type Cart } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { getSession as getUserSession } from "next-auth/react";
import { getSession } from "../../../utils/next-session-store";

import { middleware } from "../trpc";


export const checkSession = middleware( async({ctx,next})=>{
    try{
        const session = await getSession(ctx.req,ctx.res) ;
        const userSession = await getUserSession(ctx);
        if(userSession){
            return next()
        }
        const cart:Cart | null = await ctx.prisma.cart.findFirst({
            where:{
                sessionId:session.id
            }
        });
        if(cart){
            return next()
        } else {
            session.cart = {};
            return next()
        }
    } catch(e){
        console.log(e)
        throw new TRPCError({code:"INTERNAL_SERVER_ERROR"})
    }

})