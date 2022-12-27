import { type Cart } from "@prisma/client";
import { type NextApiRequest, type NextApiResponse } from "next";
import { type Session } from "next-auth";

export async function getDeletedProducts(
    ctx: { prisma: any; session?: Session | null; req?: NextApiRequest; res?: NextApiResponse<any> },
    carts: Cart[],
    item: { id?: string; productId?: string | null; cartId?: string | null; qty?: number; totalPrice: any },
    inputId: string
    ){
    
    let length:number = carts.length;
    carts.forEach( async (cart) => {
        const updateCart = await ctx.prisma.cart.update({
            where:{
                id:cart.id
            },
            data:{
                qty: cart?.qty ? -- cart.qty : cart?.qty,
                totalPrice: cart?.totalPrice ? cart?.totalPrice - item.totalPrice :cart?.totalPrice
            }
        })
        -- length
    }
    );
    if(length === 0){
        return true
    }

}