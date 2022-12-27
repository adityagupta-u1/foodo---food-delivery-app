import { type Orders, type User } from "@prisma/client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Nav from "./nav";

const Header = ({admin,user,qty,order}:{admin:boolean,user: User | null,qty:number | null,order:Orders[] | null})=>{
    
    const router = useRouter()
    if(order) console.log(order.length)
    return(
        <>
        <header >
            <Nav>
                <div className="logo">
                    Foodu
                </div>
                <div className="flex flex-row">
                    <div>
                        {
                            user ? (
                                <button onClick={()=> {signOut()}}>sign out {user.name}</button>
                            ) : (
                                <button onClick={()=> {router.push("/auth/login")}}>sign in</button>
                            )
                        }
                    </div>
                    <div className="ml-6">
                        <Link href="/products/cart">
                                {
                                    qty ? `cart ${qty}` : 'cart'
                                }
                        </Link> 
                    </div>
                    <div className="ml-6">
                    {
                        admin ? (
                        <button type="button">
                        <Link href="/admin">
                            Dashboard
                        </Link>
                        </button>
                        ) : ""
                    }
                    </div>
                    <div className="ml-6">
                        <Link href="/orders">
                                {
                                    order?.length ? `orders ${order.length}` : 'orders'
                                }
                        </Link> 
                    </div>
                </div>

            </Nav>
        </header>
        </>
    )
}

export default Header


