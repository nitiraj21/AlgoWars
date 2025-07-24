import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/src/lib/auth";
import { prisma } from '@/src/lib/prisma'
import { connect } from "http2";
import Email from "next-auth/providers/email";
import { customAlphabet } from "nanoid";

const generateRoomCode = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

export async function POST (req :Request){
    const session = await getServerSession();
    if(!session?.user?.email){
        return NextResponse.json({error : "Unauthorized"}, {status :401});
    }

    const body = await req.json();

    const {name, isPrivate = false} = body;

    const user  = await prisma.user.findUnique({
        where :{ email : session.user.email}
    })

    if(!user){
        return NextResponse.json({error : 'User not Found'}, {status : 404});
    }

    const problems = await prisma.problem.findMany({
        take : 3,
        orderBy :{difficulty : 'asc'}
    })
    console.log("[DEBUG] Problems fetched from DB:", problems);
    // --- END OF DEBUG LOG ---

    if (problems.length === 0) {
        return NextResponse.json({ error: 'No problems found in the database to create a room.' }, { status: 500 });
    }

    const roomcode = generateRoomCode();

    const room  = await prisma.room.create({
        data:{
            name,
            isPrivate,
            code : roomcode || null,
            hostId : user.id,
            questions :{
                connect : problems.map(p =>({id : p.id}))
            }
        },
        include:{
            questions : true
        }
    })

    await prisma.matchParticipant.create({
        data :{
            userId : user.id,
            roomId : room.id,
            role : "host"
            
        }
    })

    return NextResponse.json({room, roomcode}, {status : 201});
}