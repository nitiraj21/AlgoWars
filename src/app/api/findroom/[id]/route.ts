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
            constraints : true,
            tags : true
          },
        },
        
      },
    });
  
    
    
    if (!room) {
      return NextResponse.json({ 
       error: 'Room not Found',
      }, { status: 404 });
    }
    room.questions.forEach(q => {
      if (typeof q.testCases === 'string') {
        q.testCases = JSON.parse(q.testCases);
      }
      if (typeof q.starterCode === 'string') {
        q.starterCode = JSON.parse(q.starterCode);
      }
      if (typeof (q as any).driverCode === 'string') {
        (q as any).driverCode = JSON.parse((q as any).driverCode);
      }
      // Handle constraints field - it might be JSON string or plain string
      if (typeof q.constraints === 'string') {
        try {
          // Try to parse as JSON first
          q.constraints = JSON.parse(q.constraints);
        } catch (e) {
          // If parsing fails, keep it as string (it's probably plain text)
          // No need to do anything, q.constraints is already a string
        }
      }
    });
    
    return NextResponse.json(room);
  }