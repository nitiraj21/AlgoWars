import { DashBoardCard } from "@/src/components/DashBoardCard";
import { DashboardLayout } from "@/src/components/DashboardLayout";
import LogoutButton from "@/src/components/LogoutButton";
import MatchHistory from "@/src/components/MatchHistory";
import UserStatsCard from "@/src/components/UserStatsCard";
import { authOptions } from "@/src/lib/auth"; // 👈 import your next-auth config
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  // ✅ Check session on server
  const session = await getServerSession();

  if (!session) {
    redirect("api/auth/signin"); // 👈 redirect if not logged in
  }

  return (
    <DashboardLayout>
      <div className="w-full text-white ">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl ">Code Clash</h1>
          <div className="flex justify-end shadow-lg">
            <LogoutButton />
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="ml-3 mr-3 md:mx-10  gap-10">
            <div className="grid my-4 gap-6 md:grid-cols-2">
              <DashBoardCard />
              <UserStatsCard />
            </div>
            <MatchHistory />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
