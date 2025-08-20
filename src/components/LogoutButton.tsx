"use client"

import { signOut } from "next-auth/react"
import Button from "./button"

export default function LogoutButton(){
    return (
        <Button
            text="Logout"
            onClick={()=>signOut({callbackUrl : "/"})}
            Class="bg-gradient-to-r from-gray-500/15 to-gray-500/15 backdrop-blur-xl mt-3 mr-3"
        />
    )
}