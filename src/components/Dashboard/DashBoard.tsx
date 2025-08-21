import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { DashboardLayout } from "./DashboardLayout";
import ClientButtons from "./ClientButtons";
import LogoutButton from "../LogoutButton";
import { DashBoardCard } from "./DashBoardCard";
import UserStatsCard from "./UserStatsCard";
import MatchHistory from "./MatchHistory";
import Badges from "./Badges";
import GlobalRanking from "./GlobalRanking";

export default async function DashBoard() {
  const session = await getServerSession();
  if (!session) redirect("/api/auth/signin/1");

  return (
    <DashboardLayout>
      <div className="w-full text-white px-4 md:px-8 lg:px-12">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 mt-4 gap-4">
          <div className="flex">
          <img src={"./LogoHero.png"} width={90} height={90} className=""/>
          <h1 className="text-3xl mt-1 md:text-5xl font-bold text-center cursor-pointer md:text-left">
            AlgoWars
          </h1>
          </div>
          <div className="flex justify-center md:justify-end gap-4">
            <ClientButtons />
            <LogoutButton />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row justify-center gap-10">
          {/* Left Section */}
          <div className="flex-1">
            <div className="grid gap-6 md:grid-cols-2">
              <DashBoardCard />
              <UserStatsCard />
            </div>
            <div className="mt-6">
              <MatchHistory />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex-1 flex flex-col ">
            <Badges />
            <GlobalRanking />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
