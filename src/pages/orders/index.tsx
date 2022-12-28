
import { type GetServerSidePropsContext } from "next";
import Link from "next/link";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { getUsername } from "../../utils/get-username";
import { getSession } from "../../utils/next-session-store";

interface Orders{
    id:string,
    customer:string,
    total:number,
    order_id:string,
    items:{
        id:string,
        text:string,
        price:number
    }[]
}

const Orders = ({orders}:{orders:Orders[] | null}) => {

    return (
        <>
        {
            orders && orders.map((order) => (
                <div key={order.id}>
                    <h1>{order?.customer}</h1>
                    <h1>{order?.total}</h1>
                    <Link href={`orders/${order.order_id}`}> click to view order</Link>
                </div>
            ))
        }
        </>
    )
}

export default Orders

export async function getServerSideProps(ctx:GetServerSidePropsContext){
    const session = await getSession(ctx.req,ctx.res);
    const sessionUser = await getServerAuthSession(ctx);
    const props = await getUsername(sessionUser,prisma)
    const user = props.props.user;
    if(user){
        const orders = await prisma?.orders.findMany({
            where:{
                user:{
                    id:user.id
                }
            },
            select:{
                id:true,
                address:true,
                total:true,
                customer:true,
                items:true,
                status:true,
                order_id:true,      
            }

        })
        console.log(user.id)
        return {
            props:{
                orders:orders
            }
        }
    }
    else if(session){
        const orders = await prisma?.orders.findMany({
            where:{
                sessionId:session.id
            },
            select:{
                id:true,
                address:true,
                customer:true,
                total:true,
                items:true,
                status:true,
                order_id:true,         
            }
        })
        console.log(orders)
        return {
            props:{
                orders:orders
            }
        }
    }
    return {
        props:{
            orders:null
        }
    }
}