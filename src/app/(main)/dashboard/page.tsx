import LogoutButton from "@/src/components/LogoutButton";
import { getServerSession } from "next-auth/next";


export default async function Dashboard(){

    const session = await getServerSession();
    return(
        <div>
            <h1>welcome to Dashboard</h1>
            <h1>{session?.user?.name}</h1>
            <LogoutButton/>
        </div>
    )    
}