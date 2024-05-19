import { type Orders } from "@prisma/client"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { trpc } from "../../src/utils/trpc"

const OrdersAdmin = ({order}:{order:Orders[] | undefined}) => {

    const router = useRouter()
    const {mutate,data} = trpc.order.nextStep.useMutation()

    useEffect(()=>{
        if(data !== undefined){
            router.replace(router.asPath)
        }
    },[data])
    
    return (
        <>
            <div>
                {
                    order && order.reverse().map((item:Orders)=> (
                        <div key={item.id}>
                            <h1>{item.customer}</h1>
                            <h1>{item.status}</h1>
                            <button onClick={() => mutate({orderId:item.id,step:item.status + 1})}>next step</button>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default OrdersAdmin