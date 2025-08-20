import { getServerSession } from "next-auth";
import { prisma } from "../../lib/prisma";

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

      let grade = "⚡Rookie";
      if(win>40 && win <70){
        grade = "🛡️Warrior"
      }
      else if(win > 70){
        grade = "👑Champion"
      }



  return (
    <div className='w-full bg-gradient-to-r from-gray-500/15 to-gray-500/15 backdrop-blur-xl rounded-xl shadow-xl '>
        <div className='flex items-center justify-center mt-3'>
            <h1 className='font-semibold text-xl'>Win Percentage</h1>
        </div>
        <div className='rounded-3xl bg-[#121315] overflow-hidden mx-5 my-3 shadow-xl'>
            <div  className="h-5 bg-[#4ade80]" style={{width : `${win}%`}}>
              <span className="text-md font-semibold ml-34 shadow-md">{win}%</span>
            </div>
        </div>
        <div className="mt-3 ">
          <div className="flex items-center justify-center">
            <h1 className='font-semibold text-xl'>Grade</h1>
          </div>
          <div className="flex items-center justify-center mb-2">
            <h2 className={`${ grade === "🛡️Warrior"
              ? "bg-[#f97316]": grade === "👑Champion"? "bg-[#facc15] text-slate-700": "bg-[#9ca3af]" } 
              font-semibold text-lg   px-5 mx-10 rounded-xl shadow-xl mt-2 `}>{grade}</h2>
          </div>
        </div>
    </div>
  )
}

export default UserStatsCard