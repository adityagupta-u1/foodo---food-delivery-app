import { type Orders } from "@prisma/client";
import { type GetServerSidePropsContext } from "next";
import { useState } from "react";
import { number, set } from "zod";
import { prisma } from "../../server/db/client";

const Order = ({order}:{order:Orders | null}) => {
    
    const [preparing,setPreparing] = useState<boolean>(false);
    const [onWay,setOnWay] = useState<boolean>(false);
    const [delivered,setDelivered] = useState<boolean>(false);

    if(order){
        switch(order?.status){
            case 0:
                if(!preparing) setPreparing(true)
            break;
            case 1:
                if(!onWay) setOnWay(true)
            break;
            case 2:
                if(!delivered) setDelivered(true)
            break;
        }
        return (
            <>
                <h1>{order.customer}</h1>
                <h1>{order.address}</h1>
                <h1>{order.total}</h1>
                <h3 className={ preparing ? "text-blue-600" : ""}>preparing</h3>
                <h3 className={ onWay ? "text-blue-600" : ""}>on way</h3>
                <h3 className={ delivered ? "text-blue-600" : ""}>delivered</h3>
            </>
        )
    }
    return (
        <h1>order</h1>
    )
}

export default Order

export async function getServerSideProps(ctx:GetServerSidePropsContext){
    const id = ctx.params?.id;
    if(id){
        const order = await prisma?.orders.findFirst({
            where:{
                order_id: typeof id === "string" ? id : id[0],
            }
        })
        console.log(order)
        return {
            props:{
                order:order
            }
        }
    }
    return {
        props:{
            order:null
        }
    }
}