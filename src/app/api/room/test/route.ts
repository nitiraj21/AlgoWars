import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const data = await req.json();
  
    return NextResponse.json({
      roomcode: "TEST_" + Math.random().toString(36).substring(7),
    });
  }
  