import { prisma } from "../server/db/client";

export const getUsername = async (session:any)=>{

    const products = await prisma?.product.findMany();
    if(session){
        const user = await prisma?.user.findFirst({
            where:{
            email:session?.user?.email
            },
            select:{
                id:true,
                email:true,
                name:true,
                role:true
            }
        })
        if(user?.role === "ADMIN"){
            return {
                props:{
                    user:user,
                    admin:true,
                    product:products ? products : null
                }
            }
        }
        return {
            props:{
                user:user,
                admin:false,
                product:products ? products : null
            }
        }
    } else {
        return {
            props:{
                user:null,
                admin:false,
                product:products
            }
        }
    }

}