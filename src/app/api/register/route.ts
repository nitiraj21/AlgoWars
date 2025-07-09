import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import { prisma } from '@/src/lib/prisma'

export async function POST(req : Request){
    try{
    const {email,  username,  password} = await req.json();

    if(!email || !username || !password){
        return NextResponse.json({
            error: 'Missing Fields'
        });}

        const existingUser = await prisma.user.findUnique({where : {email}});

        if(existingUser){
            return NextResponse.json({
                error :"user already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data : {
                email,
                username,
                password : hashedPassword,
                isAdmin : false
            }
        })

        return NextResponse.json({
            success: true, user
        })
    }
    catch (error: any) {
        console.error('Registration error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
      }
}