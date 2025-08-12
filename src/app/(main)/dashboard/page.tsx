import { DashBoardCard } from "@/src/components/DashBoardCard";
import { DashboardLayout } from "@/src/components/DashboardLayout";
import LogoutButton from "@/src/components/LogoutButton";
import MatchHistory from "@/src/components/MatchHistory";
import { prisma } from "@/src/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";


export default async function Dashboard(){



   
    return(
        <DashboardLayout>
        <div className="w-full text-white">
            <div className="flex justify-between items-center mb-10 ml-4 mr-4">
                <h1 className="text-5xl ">Code Clash</h1>
                <div className="flex justify-end">
                <LogoutButton/>
                </div>
            </div>
            <div className="grid grid-row-2 mx-5 md:mx-20 gap-10">
                <div>
                    <DashBoardCard/>
                </div>
                <MatchHistory/>
            </div>
            
        </div>
        </DashboardLayout>
    )    
}