import { dbConnect } from "@/lib/dbConnect";
import Chat from "@/models/chat";
import User from "@/models/user";
import { NextResponse } from "next/server";
import Message from "@/models/message";

//fetch all of user chat

export async function GET(request){
    dbConnect();
    try{
        const chats = await Chat.find({users:{$elemMatch: {$eq: JSON.parse(request.headers.get('user'))._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate({
            path: "latestMessage",
            populate: {
                path: "sender",
                select: "-password"
            }
        })
        .sort({updatedAt: -1})
        return NextResponse.json({chats},{status:200});
    }catch(err){
        //console.log(err);
        return NextResponse.json({message: "error fetching chats",err:err},{status: 400});
    }

}


//to acess CHAT Will create new if doesn't exits
export async function POST(request){
    dbConnect();
    // //console.log('requsest: ',request)
    const {userId} = await request.json();
    // //console.log("reqq:",await request.json())
    if(!userId){
        return NextResponse.json({message: "User id not provided"},{status: 400})
    }
    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: JSON.parse(request.headers.get('user'))._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
        .populate("users", "-password")
        .populate("latestMessage");
    
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
        });
    if(isChat.length>0){
        return NextResponse.json({"chat":isChat[0]},{status: 200})
    }else{
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [JSON.parse(request.headers.get('user'))._id, userId],
        };
    
        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
            "users",
            "-password"
            );
            return NextResponse.json({"chat":FullChat},{status: 200})
        } catch (error) {
            return NextResponse.json({"error": error.message},{status: 400})
        }
    }
}