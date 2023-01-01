import { type Orders } from "@prisma/client";
import crypto from "crypto";
import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";



const verification = async(req: NextApiRequest ,res: NextApiResponse) => {


    const SECRET = '2EDGf7q27T4uY8e'   

    const shasum = crypto.createHmac('sha256',SECRET)
    shasum.update(JSON.stringify(req.body))
    const digest = shasum.digest('hex')
    
    console.log(req.body)
    console.log(req.body.payload)
    console.log(digest,req.headers['x-razorpay-signature'])

    if(digest === req.headers['x-razorpay-signature']){
        const {notes,order_id,id} = req.body.payload.payment.entity;
        // make the order
        const cart = await prisma?.cart.findFirst({
            where:{
                id:notes.cartId
            },select:{
                totalPrice:true,
                id:true,
                sessionId:true,
                item:{
                    select:{
                        id:true,
                    }
                }
            }
        })
        if(notes.user){
            const orders:Orders | undefined = await prisma?.orders.create({
                data:{
                    customer:notes.name,
                    address:notes.address,
                    order_id:order_id,
                    payment_id:id,
                    total:cart?.totalPrice || 0,
                    items:{
                        connect:cart?.item.map((i) => ({id:i.id})) || []
                    },
                    status:0,
                    user:{
                        connect:{
                            id:notes.user
                        }
                    }
                }
            })
        } else {
            console.log(notes)
            const orders:Orders | undefined = await prisma?.orders.create({
                data:{
                    customer:notes.name,
                    address:notes.address,
                    order_id:order_id,
                    payment_id:id,
                    total:cart?.totalPrice || 0,
                    items:{
                        connect:cart?.item.map((i) => ({id:i.id})) || []
                    },
                    status:0,
                    session:{
                        connect:{
                            id:cart?.sessionId || ""
                        }
                    }
                }
            })
        }



        const updateCart = await prisma?.cart.update({
            where:{
                id:cart?.id
            },
            data:{
                item:{
                    disconnect:cart?.item.map((i) => ({id:i.id})) || []
                }
            }
        })
        const deleteCart = await prisma?.cart.delete({
            where:{
                id:cart?.id
            }
        })

        res.json({status:'ok'})
    } else {
        console.log("bad request")
        res.status(400).json({code:"bad request"})
    }
}

export default verification

