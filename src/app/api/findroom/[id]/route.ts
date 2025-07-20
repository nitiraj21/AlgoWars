import { prisma } from '@/src/lib/prisma'
import { error } from 'console';
import next from 'next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const { id: roomId } = await params;
    console.log('Received roomId:', roomId);
    console.log('RoomId type:', typeof roomId);
    console.log('RoomId length:', roomId.length);
    
    // First, let's see what rooms exist in the database
    const allRooms = await prisma.room.findMany({
      select: { id: true, name: true }
    });
    
    const room = await prisma.room.findUnique({
      where: { code: roomId },
      include: {
        host: true,
        participants: {
          include: {
            user: true,
          },
        },
        questions: { 
          select: { 
            id: true,
            title: true,
            slug: true,
            description: true,
            StarterCode: true,
            difficulty: true,
            testCases: true,
          },
        },
      },
    });
    
    
    if (!room) {
      const roomCaseInsensitive = await prisma.room.findFirst({
        where: { 
          id: {
            mode: 'insensitive',
            equals: roomId
          }
        }
      });
      
      return NextResponse.json({ 
        error: 'Room not Found',
        debug: {
          searchedId: roomId,
          availableRooms: allRooms,
          roomIdType: typeof roomId,
          roomIdLength: roomId.length
        }
      }, { status: 404 });
    }
    
    return NextResponse.json(room);
  }