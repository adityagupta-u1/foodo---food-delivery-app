
import { type Product } from "@prisma/client";
import { type GetServerSidePropsContext } from "next";
import Image from "next/legacy/image";
import Link from "next/link.js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { env } from "../../env/server.mjs";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { getUsername } from "../../utils/get-username";
import { getSession } from "../../utils/next-session-store";
import { initializeRazorpay } from "../../utils/razorpay";
import { trpc } from "../../utils/trpc";

interface item{
    id: string;
    productId: string | null;
    cartId: string | null;
    qty: number | null;
    totalPrice: number;
    product:Product;
    size:string;
    extraOptions:{
        id:string,
        text:string,
        price:number
    }[]
}

interface cart{
    id:string,
    totalPrice: number
    item:item[]
}

function Cart({cart}:{cart:cart}) {
    const [order,setOrder] = useState<{id:string,amount:number,currency:string}>();

    const router = useRouter()

    const {mutate,data} = trpc.cart.deleteCart.useMutation() 
    
    const [disable,setDisable] = useState(false)
    useEffect(() => {
        if(data !== undefined){
            setDisable(false);
            router.replace(router.asPath)
        }
    },[data]);


        if(!cart){
            return (
                <>
                    <h1>no cart</h1>
                </>
            )
        }
        return (
            <>
                <main className="mx-40 my-20">
                    <h1>total price is {cart.totalPrice}</h1>
                   <div className="grid grid-cols-3 gap-14">
                        {
                            cart.item.map((item:item)=> {
                                const {id,image,title}:Product = item.product;
                                const size = item.size;
                                console.log(item)
                                return (
                                    <div key={item.id} className="bg-red-300 w-4/5  flex flex-col-reverse border-black border-2 justify-end rounded-lg">
                                        <button className="bg-red-500 px-4 py-2 w-fit h-fit cursor-pointer" 
                                            onClick={()=>{
                                                mutate({id:id })
                                                setDisable(true)
                                            }}
                                            disabled={disable}
                                        >
                                            delete
                                        </button>
                                        <div className="w-full min-h-fit px-4 py-6">
                                            <h2 className="text-2xl font-medium mb-2 capitalize">{title}</h2>
                                            <h3 className="text-base font-medium">{item.qty}</h3>
                                            <h3 className="text-base font-medium">{item.totalPrice}</h3>
                                            <h3 className="text-base font-medium">{size}</h3>
                                            {   
                                                item.extraOptions.map((options)=>(
                                                    <div key={options.id}>
                                                        <h4>{options.text}</h4>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <div className="w-full h-60 relative rounded-md">
                                            <Image 
                                            src={image || ''} 
                                            alt="product-image"
                                            layout="fill"
                                            objectFit="cover"
                                            className="h-full w-full"
                                            />
                                        </div>
                                  </div>
                                )
                            })
                        }
                   </div>
                   <div>
                    {cart.totalPrice}
                   </div>
                   <button className="cursor-pointer">
                        <Link href="/orders/checkout">
                            pay
                        </Link> 
                    </button>
                </main>
            </>
        )

}

export default Cart

export async function getServerSideProps(ctx:GetServerSidePropsContext){
    const session = await getSession(ctx.req,ctx.res);
    const sessionUser = await getServerAuthSession(ctx);
    const props = await getUsername(sessionUser,prisma)
    const user = props.props.user;
    if(user){
        const cart = await prisma?.cart.findFirst({
            where:{
                userId:user.id
            },
            select:{
                id:true,
                totalPrice:true,
                item:{
                    select:{
                        id:true,
                        qty:true,
                        totalPrice:true,
                        size:true,
                        extraOptions:true,
                        product:{
                            select:{
                                id:true,
                                title:true,
                                descripton:true,
                                image:true
                            }
                        }
                    }
                }
            }
        })
        console.log(cart)
        return {
            props:{
                cart:cart,
            }
        }
    }
    if(session.cart){
        const cart = await prisma?.cart.findFirst({
            where:{
                id:session.cart.id
            },
            select:{
                totalPrice:true,
                item:{
                    select:{
                        id:true,
                        qty:true,
                        totalPrice:true,
                        size:true,
                        extraOptions:true,
                        product:{
                            select:{
                                id:true,
                                title:true,
                                descripton:true,
                                image:true
                            }
                        }
                    }
                }
            }
        })
        console.log(cart)
        return {
            props:{
                cart:cart,
            }
        }
    }
    return {
        props:{
            cart:null,
        }
    }
}