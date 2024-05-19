import { type Orders } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";


export const orderRouter = router({
    nextStep:publicProcedure
    .input(
        z.object({
            orderId:z.string(),
            step:z.number()
        })
    )
    .mutation(async ({ctx,input})=>{
        if(input.step <= 2){
            const updateOrder:Orders = await ctx.prisma.orders.update({
                where:{
                    id:input.orderId
                },
                data:{
                    status:input.step
                }
            })
            return updateOrder.status
        }
        return "it is already delivered"
    }),
    saveAddress:publicProcedure
    .input(z.object({
        address:z.string(),
        userId:z.string()
    }))
    .mutation(async({ctx,input})=>{
        try {
            const address = await ctx.prisma.address.create({
                data:{
                    address:input.address,
                    profile:'HOME',
                    user:{
                        connect:{
                            id:input.userId
                        }
                    }
                }
            })

            return address.id
        } catch(e){
            console.log(e)
            throw new TRPCError({code:"INTERNAL_SERVER_ERROR"})
        }
    })
})