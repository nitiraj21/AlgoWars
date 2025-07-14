import { NextResponse } from "next/server";
import { prisma } from '@/src/lib/prisma'
import { getServerSession } from "next-auth";
import authOptions from "@/src/lib/auth";
import { error } from "console";

export async function POST(req : Request) {
    const session = await getServerSession();

    if(!session?.user?.email){
        return NextResponse.json({error : "Unauthorized"}, {status : 401});
    }

    const code = await req.json();

    const room = await prisma.room.findUnique({where : code});

    if(!room){
        return NextResponse.json({error : "Room not found"}, {status : 404});
    }

    const user = await prisma.user.findUnique({where : {email : session?.user?.email}});

    const existing = await prisma.matchParticipant.findUnique({
      where: {
        userId_roomId: {
          userId: user?.id ?? (() => { throw new Error("User ID is undefined"); })(),
          roomId: room.id
        }
      }
    })
    
    if (existing) {
      return NextResponse.json({ message: 'Already joined' }, { status: 400 })
    }
    

    await prisma.matchParticipant.upsert({
        where: {
            userId_roomId: {
  
              userId: user?.id ?? (() => { throw new Error("User ID is undefined"); })(),
              roomId: room.id
            }
          },
          update: {},
          create: {
            userId: user?.id ?? (() => { throw new Error("User not found"); })(),
            roomId: room.id,
            role :"PARTICIPANT"
          }
        })
        return NextResponse.json({room}, { status: 200 })
}