import { NextResponse } from "next/server";
import { getToken} from "next-auth/jwt";
import type { NextRequest} from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(request : NextRequest){
    const token = await getToken({req : request, secret});
    const isAuth = request.nextUrl.pathname.startsWith("/signin") || request.nextUrl.pathname.startsWith("/register");

    if(token && isAuth){
        return NextResponse.redirect(new URL ("/dashboard", request.url));
    }

    if(!token && request.nextUrl.pathname.startsWith("/dashboard")){
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.next();
}