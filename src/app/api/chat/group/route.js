import { dbConnect } from "@/lib/dbConnect";
import Chat from "@/models/chat";
import User from "@/models/user";
import { NextResponse } from "next/server";

//  Create New Group Chat
export async function POST(request){
    dbConnect();
    const data=await request.json()
    const curr_user=JSON.parse(request.headers.get('user'));
    // //console.log('data create group: ',data);
    // return NextResponse.json({message: "hey there"})
    // dbConnect();
    if (!data.users || !data.name) {
        return NextResponse.json({ message: "Please Fill all the feilds" },{status: 400})
    }
    
    let users = JSON.parse(data.users);
    // //console.log("curr: ",curr_user," users: ",users)
    if (users.length < 2) {
        return NextResponse.json({message: "More than 2 users are required to form a group chat"},{status: 400})
    }
    
    users.push(curr_user._id);
    
      try {
        const groupChat = await Chat.create({
          chatName: data.name,
          users: users,
          isGroupChat: true,
          groupAdmin: curr_user,
        });
    
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
        return NextResponse.json({fullGroupChat},{status: 200})
      } catch (error) {
        //console.log(error)
        return NextResponse.json({message: 'error creating new group chat'},{status: 400})
      }
}