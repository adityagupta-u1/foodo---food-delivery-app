import { type Cart, type User } from "@prisma/client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { type GetServerSidePropsContext } from "next";
import Link from "next/link.js";
import { useState } from "react";
import * as Yup from "yup";
import { env } from "../../env/server.mjs";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { prisma } from "../../server/db/client";
import { getUsername } from "../../utils/get-username";
import { getSession } from "../../utils/next-session-store";
import { initializeRazorpay } from "../../utils/razorpay";
import { trpc } from "../../utils/trpc";

declare global {
    interface Window {
      Razorpay: any; // 👈️ turn off type checking
    }
}

const CheckOut = ({cart,razorpayKey,user,session}:{cart:Cart | null,razorpayKey:string | null,user:User | null,session:string | null}) => {
    const [order,setOrder] = useState<{id:string,amount:number,currency:string}>();

    const {mutate:checkOutMutate} = trpc.payment.checkOut.useMutation({
        onSuccess:(data:{ id: any; amount: any; currency: any; })=>{
            setOrder(data)
        }
    })
    const {mutate:saveAdressMutate} = trpc.order.saveAddress.useMutation()
    if(cart){
        console.log(session)
        console.log(user)
        return (
            <>
            {
                !user ? (
                    <button>
                        <Link href="/auth/login">
                            login
                        </Link>
                    </button>
                ) : ""
            }
                <Formik
                    initialValues={{firstName:"",lastName:"",address:"",email:"",phoneNumber:"",picked:""}}
                    validationSchema={Yup.object({
                        firstName:Yup.string().required(),
                        lastName:Yup.string().required(),
                        address:Yup.string().required(),
                        email:Yup.string().email("please provide correct email").required(),
                        phoneNumber:Yup.string().min(10,"no digits should be 10").max(10,"no digits should be 10").required(),
                        picked:Yup.string()
                    })}
                    onSubmit={async(values) => {
                        console.log(cart.id)
                        const res  = await initializeRazorpay();
                        if (!res) {
                        alert("Razorpay SDK Failed to load");
                        return;
                        }
                        
                        // Make API call to the serverless API
                        checkOutMutate({amount:cart.totalPrice})
                            if(order){
                                const options = {
                                    key:razorpayKey, // Enter the Key ID generated from the Dashboard
                                    name: "Foody pizza",
                                    currency: order?.currency,
                                    amount: order?.amount,
                                    order_id: order?.id,
                                    callback_url:`https://foodo-food-delivery-app-ivio.vercel.app/orders/${order.id}`,
                                    description: "Thankyou for your test donation",
                                    notes:{
                                            address:values.address,
                                            cartId:cart.id,
                                            name:values.firstName + " " + values.lastName,
                                            email:values.email,
                                            phoneNumber:values.phoneNumber,
                                            user:user?.id,
                                    },
                                    prefill: {
                                        name: values.firstName + " " + values.lastName,
                                        email: values.email,
                                        contact: values.phoneNumber,
                                    },
                                    theme: {
                                        color: "#E06910",
                                    }
                            }
                            const paymentObject = new window.Razorpay(options);
                            paymentObject.on('payment.failed', function (response:any){
                                alert(response.error.code);
                                alert(response.error.description);
                                alert(response.error.source);
                                alert(response.error.step);
                                alert(response.error.reason);
                                alert(response.error.metadata.order_id);
                                alert(response.error.metadata.payment_id);
                            });
                            paymentObject.open();
                            if(values.picked === "yes" && user){
                                saveAdressMutate({address:values.address,userId:user.id})
                            }
                        }
                    }}
                >
                    <Form>
                        <label
                        htmlFor="firstName"
                        className="uppercase text-sm text-gray-600 font-bold"
                        >
                        First Name 
                        <Field
                            name="firstName"
                            aria-label="enter your title"
                            aria-required="true"
                            type="text"
                            className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                        />
                        </label>
                        <ErrorMessage name="title" ></ErrorMessage>
                        <label
                        htmlFor="lastName"
                        className="uppercase text-sm text-gray-600 font-bold"
                        >
                        Last Name
                        <Field
                            name="lastName"
                            aria-label="enter your title"
                            aria-required="true"
                            type="text"
                            className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                        />
                        </label>
                        <ErrorMessage name="description" ></ErrorMessage>
    
                    <label
                        htmlFor="address"
                        className="uppercase text-sm text-gray-600 font-bold"
                        >
                        address
                        <Field
                            name="address"
                            aria-label="enter your size"
                            aria-required="true"
                            type="text"
                            className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                        />
                    </label>
                    {
                        user ? (
                            <label>
                                <Field type="radio" name="picked" value="yes" />
                                want to save the address
                            </label>
                        ) : ""
                    }
                    <label
                        htmlFor="email"
                        className="uppercase text-sm text-gray-600 font-bold"
                        >
                        email
                        <Field
                            name="email"
                            aria-label="enter your size"
                            aria-required="true"
                            type="email"
                            className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                        />
                        </label>
                    <label
                        htmlFor="phoneNumber"
                        className="uppercase text-sm text-gray-600 font-bold"
                        >
                        phone number
                        <Field
                            name="phoneNumber"
                            aria-label="enter your size"
                            aria-required="true"
                            type="text"
                            className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                        />
                        </label>
                        <button type="submit">
                            continue
                        </button>
                    </Form>

                </Formik>
            </>
        )

    } else {
        return (
            <h1>no cart</h1>
        )
    }
}

export default CheckOut;


export async function getServerSideProps(ctx:GetServerSidePropsContext){
    const session = await getSession(ctx.req,ctx.res);
    const sessionUser = await getServerAuthSession(ctx);
    const props = await getUsername(sessionUser)
    const user = props.props.user;
    const key = env.RAZORPAY_KEY_ID;
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
                user:user,
                session:null,
                cart:cart,
                razorpayKey:key,
            }
        }
    }
    else if(session.cart){
        console.log(" the fucking session is" + session.id)
        const cart = await prisma?.cart.findFirst({
            where:{
                id:session.cart.id
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
        return {
            props:{
                user:null,
                session:session.id,
                cart:cart,
                razorpayKey:key,
            }
        }
    } else {
        return {
            props:{
                user:null,
                cart:null,
                razorpayKey:null,
                session:null
            }
        }
    }
}