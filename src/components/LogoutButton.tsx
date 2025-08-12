"use client"

import { signOut } from "next-auth/react"
import Button from "./button"

export default function LogoutButton(){
    return (
        <Button
            text="Logout"
            onClick={()=>signOut({callbackUrl : "/"})}
            Class="bg-[#222627] mt-3"
        />
    )
}