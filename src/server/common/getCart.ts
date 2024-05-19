import { type Cart, type Items } from "@prisma/client";
import { type NextApiRequest, type NextApiResponse } from "next";




export async function getCart(
    ctx: { prisma: any; req?: NextApiRequest;
    res?: NextApiResponse<any>; },
    qty:number,
    price:number,
    cart:Cart,
    createdItem:Items | null,
    items:Items | null
    ){
        if(createdItem){
            console.log(createdItem)
            const cartUpdate = await ctx.prisma.cart.update({
                data:{
                    qty:cart.qty ? ++ cart.qty : 1,
                    totalPrice:cart.totalPrice + (price * qty),
                    item:{
                        connect:{
                            id:createdItem.id
                        }         
                    },
                },where:{
                    id:cart.id
                },
            })
            return cartUpdate
        }
        if(items){
            console.log(" the price is price ------------- " + price)
            const difference = qty - items?.qty;
            console.log(difference)
            const cartUpdate = await ctx.prisma.cart.update({
                data:{
                    totalPrice: cart.totalPrice + ( ( price * qty) - items.totalPrice ),
                },where:{
                    id:cart.id
                }
            })
            return cartUpdate
        }
}