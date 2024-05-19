import React from "react"

export const Button = ({children}:{children:React.ReactNode})=>{

    return (
        <button className="px-5 py-3 bg-black text-base capitalize text-white rounded w-fit" type="button">
            {children}
        </button>
    )
}