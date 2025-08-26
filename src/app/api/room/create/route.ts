import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from '@/src/lib/prisma'
import { connect } from "http2";
import Email from "next-auth/providers/email";
import { customAlphabet } from "nanoid";
import { use } from "react";

const generateRoomCode = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

function shuffleArray(array : any[]){
    for(let i = array.length-1; i>0; i--){
        let j = Math.floor(Math.random()* (i + 1));
        [array[i], array[j]]  = [array[j], array[i]]
    }
    return array;
}

export async function POST (req :Request){
    const session = await getServerSession();
    if(!session?.user?.email){
        return NextResponse.json({error : "Unauthorized"}, {status :401});
    }

    const body = await req.json();

    const { name, Duration, isPrivate, Questions } = body;

    const user  = await prisma.user.findUnique({
        where :{ email : session.user.email}
    })

    if(!user){
        return NextResponse.json({error : 'User not Found'}, {status : 404});
    }

    const allProblemIDs = await prisma.problem.findMany({
        select : {id : true}
    })

    const shuffledIDs = shuffleArray(allProblemIDs);
    console.log("Questions:", Questions);
    const randomProblemIDs = shuffledIDs.slice(0, Questions).map(p => ({id  : p.id}));

    const roomcode = generateRoomCode();

    const room  = await prisma.room.create({
        data:{
            name,
            isPrivate,
            code : roomcode || null,
            hostId : user.id,
            duration : Duration,
            questions :{
                connect : randomProblemIDs
            }
        },
        include: {
            questions: {
              select: {
                id: true,
                title: true,
                description: true,
                slug: true,
                difficulty: true,
                starterCode: true,
                constraints: true, 
                testCases: true,
                functionName: true,
                tags : true,
              }
            }
          }
        });

    await prisma.matchParticipant.create({
        data :{
            userId : user.id,
            roomId : room.id,
            role : "host"
            
        }
    })

    await prisma.user.update({
        where : {id : user.id},
        data : {
            matches : {increment : 1}
        }
    })

    return NextResponse.json({room, roomcode}, {status : 201});
}