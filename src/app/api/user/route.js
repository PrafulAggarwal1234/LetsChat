import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(request){
    dbConnect();
    const { searchParams } = new URL(request.url);
    // //console.log('request: ',searchParams.get('query'))
    // const data=await request.json();
    // //console.log('data: ',data)

    const query=searchParams.get('query')
 
    const keyword=query ?
    {$or: [
        {name: {$regex: query, $options: "i"}},
        {email: {$regex: query, $options: "i" }},
    ]} : {}
    const users = (await User.find(keyword,{name: 1,pic: 1, email: 1})).filter(user => user._id.toString() !== JSON.parse(request.headers.get('user'))._id);
    // const users = (await User.find(keyword,{name: 1,pic: 1, email: 1}));
    return NextResponse.json({users},{status: 201})
    
}