import { type Items, type Product } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";


import { publicProcedure, router } from "../trpc";



export const productRouter = router({
  createProduct: publicProcedure
    .input(z.object({
        title:z.string(),
        description:z.string(),
        image:z.string(),
        size:z.array(
            z.object({
                size:z.string(),
                price:z.number()
            })
        ),
        options:z.array(
            z.object({
                text:z.string(),
                price:z.number(),
            })
        ).nullish()
    }))
    .mutation( async ({ ctx,input }) => {
        try{
            if(input.options){
                const product:Product = await ctx.prisma.product.create({
                    data:{
                        title:input.title,
                        descripton:input.description,
                        image:input.image,
                        extraOptions:{
                            createMany:{
                                data:input.options
                            }
                        },
                        size:{
                            createMany:{
                                data:input.size
                            }
                        }
                    }
                })
                return product.id
            }
            const product:Product = await ctx.prisma.product.create({
                data:{
                    title:input.title,
                    descripton:input.description,
                    image:input.image,
                    size:{
                        createMany:{
                            data:input.options || [],
                        }
                    }
                }
            })
            return product.id
        }catch(e){
            console.log(e);
            throw new TRPCError({code:"INTERNAL_SERVER_ERROR"})
        }
    }),
    deleteProduct: publicProcedure
        .input(z.object({
            id:z.string()
        }))
        .mutation( async({ctx,input})=>{
            try{
                const item = await ctx.prisma.items.findFirst({
                    where:{
                        productId:input.id
                    },
                    select:{
                        id:true,
                        product:true,
                        qty:true,
                        cartId:true,
                        productId:true,
                        totalPrice:true,
                        size:true
                    }
                })
                console.log(item)
                if(item){
                    const updateCart = await ctx.prisma.cart.updateMany({
                        where:{
                            item:{
                                some:{
                                    productId:input.id
                                }
                            }
                        },
                        data:{
                            qty:{
                                decrement: 1
                            },
                            totalPrice:{
                                decrement: item.totalPrice
                            }
                        }
                    })
                    const product:Product | null = await ctx.prisma.product.delete({
                        where:{
                            id:input.id
                        }
                    })
            
                    return updateCart
                } else {
                    const product = await ctx.prisma.product.delete({
                        where:{
                            id:input.id
                        }
                    })
                    return product
                }
            }catch(e){      
                console.log(e)
                throw new TRPCError({code:"INTERNAL_SERVER_ERROR"})
            }
        }),
        getProduct: publicProcedure
        .query( async({ctx})=>{
            try{
                const product = await ctx.prisma.product.findMany()
                return "done"
            }catch(e){      
                console.log(e)
                throw new TRPCError({code:"INTERNAL_SERVER_ERROR"})
            }
        })
 
});
