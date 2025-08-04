import LogoutButton from "@/src/components/LogoutButton";
import { prisma } from "@/src/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";


export default async function Dashboard(){
    function getRank(XP : number | null ) : string{
        if(XP === null)return "";
        if (XP >= 6500) return "Legend";
        if (XP >= 4000) return "Diamond";
        if (XP >= 2500) return "Platinum";
        if (XP >= 1500) return "Gold";
        if (XP >= 1000) return "Silver";
        return "Bronze";
    }
    const session = await getServerSession();
    let username = ""
    if( session?.user?.name){
        username = session.user.name;
    }
    const res = await prisma.user.findUnique({
        where : {username : username},
        

    })

    if(!res){
        return;
    }
    const user = res
    console.log("user = ", user)
    const WinPercentage = Math.ceil(user.wins/ user.matches * 100);
    console.log("XP of user" , user.XP)
    const Rank = getRank(user.XP);
   
    return(
        <div>
            <div className="flex justify-center items-center mb-10">
                <h1>welcome to Dashboard</h1>
                <div className="flex justify-end">
                <LogoutButton/>
                </div>
            </div>
            <div className="flex flex-rows-4 justify-center items-center gap-5"> 
                <h1>{session?.user?.name}</h1>
                <h1> Matches - {user.matches}</h1>
                <h1>Wins - {user.wins}</h1>
                <h1>Win Ratio - {WinPercentage}%</h1>
                <h1>{Rank}</h1>
                
            </div>
        </div>
    )    
}