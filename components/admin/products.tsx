import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { router } from "../../src/server/trpc/trpc";
import { trpc } from "../../src/utils/trpc";


const Products = ({products}:{products:any})=>{

    const router = useRouter()

    const {mutate,data,isLoading} = trpc.product.deleteProduct.useMutation({
        onSuccess:(data)=>{
            console.log(data)
        }
    });
    useEffect(()=>{
        if(data !== undefined){
            router.replace(router.asPath)
        }
    },[data])
    return(
        <>
        <section className="mx-40 my-20">
          <div className="grid grid-cols-1 gap-4">
            {
              products?.map(({id,title,descripton,image,prices}:{id:string,title:string,descripton:string,image:string,prices:number})=>(
                <div key={id} className="bg-red-300 w-full h-32 flex flex-row border-black border-2">
                    <div className="w-1/4 h-ful relative ">
                        <Image 
                            src={image} 
                            alt="product-image"
                            layout="fill"
                            objectFit="cover"
                            className="h-full w-full"
                        />
                    </div>
                    <div className="w-3/4 h-full px-4 py-4">
                        <h2>{title}</h2>
                        <p>{descripton}</p>
                        <h3>{prices}</h3>
                    </div>
                    <div className="flex flex-col justify-center align-middle px-5">
                        <div className="bg-red-500 px-4 py-2 w-fit h-fit cursor-pointer" onClick={()=>{mutate({id:id})}}>
                            delete
                        </div>
                    </div>
                </div>
              ))
            }
          </div>
        </section>
        </>
    )
}

export default Products