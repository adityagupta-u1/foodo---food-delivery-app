import { type Items, type Prisma, type PrismaClient, type Session } from "@prisma/client";
import { type NextApiRequest, type NextApiResponse } from "next";



export async function getItems(
    ctx: { prisma: any; req?: NextApiRequest;
    res?: NextApiResponse<any>; }
    ,qty:number,id:string,price:number,items:Items | null,size:string,options:{text:string,price:number} []){
    if(items){
        console.log("i am in update items")
        const updatedItem = await ctx.prisma.items.update({
            data:{
                qty: qty,
                totalPrice:qty * price,
            },
            where:{
                id:items.id
            }
        })

        return updatedItem
    }
    const createItem = await ctx.prisma.items.create({
        data:{
            qty: qty,
            productId:id,
            totalPrice:qty*price,
            size:size,
            extraOptions:{
                createMany:{
                    data:options
                }
            }
        },
    })
    return createItem
}