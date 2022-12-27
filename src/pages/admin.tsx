import { type Orders, type Product, type User } from "@prisma/client";
import { type GetServerSidePropsContext } from "next";
import Link from "next/link";
import Form from "../../components/admin/form";
import OrdersAdmin from "../../components/admin/orders";
import Products from "../../components/admin/products";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { getUsername } from "../server/common/get-username";



const Admin = ({admin,product,order}:{admin:boolean,product:any,order: Orders[] | undefined})=>{


    if(admin){
      return (
        <>
         <Form />
         <Products products={product}/>
         <OrdersAdmin order={order} />
        </>
      )
    }

    return (
        <>
            <button>
              <Link href="auth/login">
                login to admin
              </Link>
            </button>
        </>
    )
}

export default Admin;


export async function getServerSideProps(ctx:GetServerSidePropsContext){

  const session = await getServerAuthSession(ctx);
  const props = await getUsername(session)
  const order = await prisma?.orders.findMany();
  if(order){
    return {
      props:{
        admin:props.props.admin,
        product:props.props.product,
        order:order
      }
    }
  } 
  return {
    props:{
      admin:props.props.admin,
      product:props.props.product,
      order:null
    }
  }
}

