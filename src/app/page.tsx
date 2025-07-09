import { get } from "http";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { authOptions } from "../lib/auth";


export default async function Home() {
  const session  = await getServerSession(authOptions);
  console.log(session?.user?.name);
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="grid grid-rows-2 justify-center items-center">
        <div>Code Clash</div>
        <div>{session?.user?.name}</div>
      </div>
    </div>
  );
}
