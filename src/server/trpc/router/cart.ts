
import { Product, Size, type Cart, type Items } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Session } from "next-session/lib/types";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { getSession } from "../../../utils/next-session-store";
import { getItems } from "../../common/get-item";
import { getCart } from "../../common/getCart";
import { publicProcedure, router } from "../trpc";

interface sessionCart {
    totalPrice:number;
    items:sessionItems []
}

interface sessionItems {
        id:string;
        qty:number;
        totalPrice:number;
        product:{ id: string; image: string | null; title: string; } | null;
        size:string
}


export const cartRouter = router({
    addCart: publicProcedure
    .input(z.object({
        id:z.string(),
        qty:z.number(),
        price:z.number(),
        user:z.object({
            userId:z.string()
        }).nullable(),
        size:z.string(),
        options:z.array(
            z.object({
                text:z.string(),
                price:z.number()
            })
        )
    }))
    .mutation(async ({input,ctx})=>{
        try {
            const {id,qty,price,user} = input
            console.log(price)
            const products = await ctx.prisma.product.findFirst({
                where:{
                    id:input.id
                }
            })
            console.log(products)
            if(products){
                if(user){
                    const cart:Cart | null = await ctx.prisma.cart.findFirst({
                        where:{
                            userId:user.userId
                        }
                    });
                    if(cart){
                        const items = await ctx.prisma.items.findFirst({
                            where:{
                                productId:id,
                                cartId:cart.id,
                                size:input.size,
                            },select:{
                                id:true,
                                qty:true,
                                size:true,
                                totalPrice:true,
                                productId:true,
                                orderId:true,
                                cartId:true,
                                extraOptions:{
                                    select:{
                                        text:true,
                                        price:true
                                    }
                                }
                            }
                        })
                        const same = JSON.stringify(items?.extraOptions) === JSON.stringify(input.options)
                        if(items && same){
                            //? UPDATE ITEMS
                            const updatedItem:Items= await getItems(ctx,qty,id,price,items,input.size,input.options);
                            //? UPDATE CART
                            if(updatedItem){
                                const createdItem = null
                                const cartUpdate:Cart = await getCart(ctx,qty,price,cart,createdItem,items)
                                return cartUpdate.id
                            }
                        } 
                        else {
                            //? CREATE ITEMS
                            const items = null
                            console.log("i am here ..........................")
                            const createdItem:Items = await getItems(ctx,qty,id,price,items,input.size,input.options)
                            //? UPDATE CART
                            if(createdItem){
                                const cartUpdate:Cart = await getCart(ctx,qty,price,cart,createdItem,items)
                                return cartUpdate.id
                            }
                        }
                    }    
                    //? CREATE ITEM 
                    const items =null
                    const createdItem:Items = await getItems(ctx,qty,id,price,items,input.size,input.options)
                    //? CREATE CART
                    const createdCart:Cart = await ctx.prisma.cart.create({
                        data:{
                            qty:1,
                            totalPrice:input.price * input.qty,
                            item:{
                                connect:{
                                    id:createdItem.id
                                }
                            },
                            user:{
                                connect:{
                                    id:user.userId
                                }
                            }
                        }
                    })
                    return createdCart.id
                }

                //* IF SESSION
                
                    const session : Session = await getSession(ctx.req,ctx.res) ;

                    if(session.cart){
                        console.log("cart is already resent")
                        const oldCart:sessionCart = session.cart;

                        oldCart.items.map( (item:sessionItems ) => {
                            const product =  ctx.prisma.product.findFirst({
                                where:{
                                    id:item.product?.id
                                },
                                select:{
                                    id:true,
                                    image:true,
                                    title:true,
                                }
                            })
                            if(item.product?.id === input.id && item.size === input.size){
                                item.qty = input.qty + item.qty ;
                                item.totalPrice = item.totalPrice + (input.qty * input.price);
                                console.log(session.cart)
                                return session.cart
                            }
                            const newCart:sessionCart = {
                                totalPrice:oldCart.totalPrice+(item.qty*input.price),
                                items:[ ... oldCart.items , {id:uuidv4(),qty:input.qty,totalPrice:input.qty*input.price,product:product,size:input.size} ]
                            }
                            console.log("new cart is " + newCart)
                            session.cart = newCart
                            return newCart
                        })
                        console.log(session.cart)
                        return session.cart
                    }
                    const product:{ id: string; image: string | null; title: string; } | null  = await ctx.prisma.product.findFirst({
                        where:{
                            id:input.id
                        },
                        select:{
                            id:true,
                            image:true,
                            title:true,
                        }
                    })
                    const newCart:sessionCart = {
                        totalPrice:input.qty*input.price,
                        items:[
                            {
                                id:uuidv4(),
                                qty:input.qty,
                                totalPrice:input.price,
                                product:product,
                                size:input.size
                            }
                        ]
                    }
                    console.log("hey i am here 3")
                    session.cart = newCart
                    console.log("the new cart is " + session.cart)
                    // console.log(session.id)
                    // const cart:Cart | null = await ctx.prisma.cart.findFirst({
                    //     where:{
                    //         sessionId:session.id
                    //     }
                    // });
                    
                    // if(cart){
                    //     const items = await ctx.prisma.items.findFirst({
                    //         where:{
                    //             productId:id,
                    //             cartId:cart.id,
                    //             size:input.size,
                    //         },select:{
                    //             id:true,
                    //             qty:true,
                    //             size:true,
                    //             totalPrice:true,
                    //             productId:true,
                    //             orderId:true,
                    //             cartId:true,
                    //             extraOptions:{
                    //                 select:{
                    //                     text:true,
                    //                     price:true
                    //                 }
                    //             }
                    //         }
                    //     })
                    //     console.log(input.options)
                    //     const same = JSON.stringify(items?.extraOptions) === JSON.stringify(input.options)
                    //     console.log(items)
                    //     console.log(same)
                    //     if(items && same){
                    //         //? UPDATE ITEMS
                    //         const updatedItem:Items = await getItems(ctx,qty,id,price,items,input.size,input.options);
                    //         //? UPDATE CART
                    //         if(updatedItem){
                    //             const createdItem = null
                    //             const cartUpdate:Cart = await getCart(ctx,qty,price,cart,createdItem,items)
                    //             session.cart = cartUpdate;
                    //             return cartUpdate.id
                    //         }
                    //     } 
                    //     else {
                    //         //? CREATE ITEMS
                    //         const items = null
                    //         const createdItem:Items = await getItems(ctx,qty,id,price,items,input.size,input.options)
                    //         //? UPDATE CART
                    //         if(createdItem){
                    //             const cartUpdate:Cart = await getCart(ctx,qty,price,cart,createdItem,items)
                    //             session.cart = cartUpdate;
                    //             return cartUpdate.id
                    //         }
                    //     }
                    // }    
                    // //? CREATE ITEM 
                    // const items =null
                    // const createdItem:Items = await getItems(ctx,qty,id,price,items,input.size,input.options)
                    // //? CREATE CART
                    // const createdCart:Cart = await ctx.prisma.cart.create({
                    //     data:{
                    //         qty:1,
                    //         totalPrice:input.price * input.qty,
                    //         item:{
                    //             connect:{
                    //                 id:createdItem.id
                    //             }
                    //         },
                    //         sessionId:session.id
                    //     }
                    // })
                    // session.cart = createdCart
                    // return createdCart.id
            }
            return null 
        } catch(e){
            console.log(e)
            throw new TRPCError({code:"INTERNAL_SERVER_ERROR"})
        }  
    }),
    deleteCart:publicProcedure
    .input(z.object({
        id:z.string()
    }))
    .mutation(async({ctx,input})=>{

        const item:Items | null = await ctx.prisma.items.findFirst({
            where:{
                productId:input.id
            }
        })
        if(item){
            const cart = await ctx.prisma.cart.update({
                where:{
                    id:item?.cartId || ''
                },
                data:{
                    qty:{
                        decrement:1
                    },
                    totalPrice:{
                        decrement:item?.totalPrice
                    }
                }
            })
            const deletedItem = await ctx.prisma.items.delete({
                where:{
                    id:item.id
                }
            })
            
            return cart && deletedItem
        } else {
            throw new TRPCError({code:"BAD_REQUEST",message:"item not found"})
        }
    })
})