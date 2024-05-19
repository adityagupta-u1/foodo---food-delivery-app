import React from "react"

const Nav = ({children}:{children:React.ReactNode[]})=>{
    return(
        <nav className="px-32 py-6 flex flex-row justify-between">
            {children}
        </nav>
    )
}

export default Nav