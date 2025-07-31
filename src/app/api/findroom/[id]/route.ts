import { prisma } from '@/src/lib/prisma'
import { error } from 'console';
import next from 'next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const { id: roomCode } = await params;
    
    const room = await prisma.room.findUnique({
      where: { code: roomCode },
      include: {
        host: {
          select: {
            id: true,
            username: true,
          },
        },
        participants: {
          select: {
            id: true,  
            role: true,
            score : true,
            user: { 
              select: {
                id: true,
                username: true,
              }
            }
          }
        },
        questions: {
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            starterCode: true,
            difficulty: true,
            testCases: true,
          },
        },
        
      },
    });
  
    
    
    if (!room) {
      return NextResponse.json({ 
       error: 'Room not Found',
      }, { status: 404 });
    }
    
    return NextResponse.json(room);
  }