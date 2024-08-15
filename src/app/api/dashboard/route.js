import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user";
import { NextResponse } from "next/server";
import jsonwebtoken from "jsonwebtoken";
import { stringify } from "postcss";

export async function GET(request){
    
    const user=JSON.parse(request.headers.get('user'));
    dbConnect();
    
    // const {email, password } = await request.json();
    // const user=request.user;
   
    return NextResponse.json({message: "dashboard page",user},{status: 201});
}