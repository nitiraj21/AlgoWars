import { getServerSession } from "next-auth";
import { prisma } from "../lib/prisma";

async function UserStatsCard()  {

  const session = await getServerSession();
      let username = ""
      if( session?.user?.name){
          username = session.user.name;
      }
      const res = await prisma.user.findUnique({
          where : {username : username},
      })
      const user = res
      if(!user){
          return (
              <div>cant fetch the data</div>
          )
      }
      let win = 0
      if(user.matches > 0){
        win = Math.ceil(user.wins/user.matches *100);
      }



  return (
    <div className='w-full   bg-[#222627] rounded-xl shadow-xl '>
        <div className='flex items-center justify-center mt-3'>
            <h1 className='font-semibold text-xl'>Win Percentage</h1>
        </div>
        <div className='rounded-3xl bg-[#121315] overflow-hidden mx-5 my-5 shadow-xl'>
            <div  className="h-5 bg-lime-600" style={{width : `${win}%`}}>
              <span className="text-md font-semibold ml-34 shadow-md">{win}%</span>
            </div>
        </div>
    </div>
  )
}

export default UserStatsCard