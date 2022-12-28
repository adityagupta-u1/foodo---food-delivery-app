
import { type GetServerSidePropsContext } from "next";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { getUsername } from "../../server/common/get-username";
import { trpc } from "../../utils/trpc";

interface Product  {
    id: string;
    title: string;
    image: string | null;
    size: {
        id: string;
        size: string;
        price: number;
    }[];
    extraOptions: {
        id: string;
        text: string;
        price:number;
    }[]
    descripton: string;
}

const Product = ({product,user}:{product:Product | undefined,user: {id:string,name:string,email:string,role:string} | null})=>{

    const [add,setAdd] = useState(false);
    const [price,setPrice] = useState(product?.size[0]?.price || 0);
    const [size,setSize] = useState("REGULAR");
    const [options,setOptions] = useState<any[]>([])
    const [disable,setDisable] = useState(false)
    const {mutate} = trpc.cart.addCart.useMutation({
        onSuccess: () =>{
            setAdd(true)
            setDisable(false)
        }
    })
    const [counter,setCounter] = useState(1);
    const router = useRouter()
    useEffect(()=>{
        router.replace(router.asPath)
    },[counter,price])

    const handlePrice = (price:number | undefined,size:string)=>{
        if(price){
            setSize(size)
            setPrice(price)
        }
    }

    const handleChange = (e:any,option:{id:string,text:string,price:number})=> {
        const checked = e.target.checked;
        // console.log(price + options.price)
        if(checked){
            setPrice((prev) => {return prev + option.price})
            setOptions((prev) => {
                return [...prev,option]
            })
            console.log(options)
            console.log(price)
        } else {
            setPrice((prev) => prev - option.price)
            setOptions((prev) => { return prev.filter((options) => options.id !== option.id)})
            console.log(options)
            console.log(price)
        }
    }

    if( product){
        return (
            <>
                <div className="bg-red-300 w-full h-96 flex flex-col border-black border-2">
                    <div className="w-full h-3/4 relative ">
                        <Image 
                            src={product?.image || ""} 
                            alt="product-image"
                            layout="fill"
                            objectFit="cover"
                            className="h-full w-full"
                        />
                    </div>
                    <div className="w-full h-1/4 px-4 py-4">
                        <h2>{product?.title}</h2>
                        <h2>{price}</h2>
                        <p>{product?.descripton}</p>
                    </div>
                    <div className="flex flex-row ">
                        {/* //! ADD A FORM HERE */}
                        <button className="text-base mx-1"
                            onClick={()=>{ setCounter((prevValue) => { return prevValue > 1 ? -- prevValue : 1})}}
                        >-</button>
                        <div>{ counter }</div>
                        <button className="text-base mx-1"
                            onClick={()=>{ setCounter((prevValue) => { return ++ prevValue})}}
                        >+</button>
                    </div>
                </div>
                <div className="flex flex-row justify-start align-middle px-5 mt-8">
                    <div>
                        <div onClick={() => handlePrice(product.size[0]?.price,"REGULAR")} className="cursor-pointer">regular</div>
                        <div onClick={() => handlePrice(product.size[1]?.price,"MEDIUM")} className="cursor-pointer">medium</div>
                        <div onClick={() => handlePrice(product.size[2]?.price,"LARGE")} className="cursor-pointer">large</div>
                    </div>
                    <form>
                        <div id="checkbox-group">Checked</div>
                        <div role="group" aria-labelledby="checkbox-group">
                            {
                                product.extraOptions.map((option) => (  
                                    <label key={option.id}>
                                        <input type="checkbox" name="options" value={option.id}  onChange={(e)=> handleChange(e,option)}/>
                                        {option.text}
                                    </label>
                                ))
                            }
                        </div>
                        <button className="bg-blue-500 px-4 py-2 w-fit h-fit cursor-pointer mr-4" 
                            onClick={ (e)=> {
                                e.preventDefault()
                                mutate({id:product?.id,qty:counter,price:price ? price : 0,user: user ? {userId:user.id} : null,size:size ,options:options})
                                setDisable(true)
                            }}
                            disabled={disable}
                        >
                            {add ? "added" : "add to cart"}
                        </button>
                    </form>
                </div>
            </>
        )
    } else {
        return(
            <>
                <h1>not logged in</h1>
            </>
        )
    }

}

export default Product;

export async function getServerSideProps(ctx:GetServerSidePropsContext){

    const session = await getServerAuthSession(ctx);
    const props = await getUsername(session,prisma)
    const param = ctx.params?.id;  
    if(param){
        const product = await prisma?.product.findFirst({
            where:{
                id: typeof param === "string" ? param : param[0],  
            },
            select:{
                id:true,
                descripton:true,
                image:true,
                title:true,
                extraOptions:{
                    select:{
                        price:true,
                        id:true,
                        text:true
                    }
                },
                size:{
                    select:{
                        id:true,
                        price:true,
                        size:true,
                    }
                }

            }
        })
        const items = await prisma?.items.findFirst({
            where:{
                productId:product?.id
            }
        })
        return {
            props:{
                product:product,
                user:props.props.user,
                items:items,
            }
        }  
    } 
    return {
        props:{
            user:props.props.user,
            items:null,
            product:null,
        }
    }
}
  