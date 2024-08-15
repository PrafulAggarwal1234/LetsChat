import { dbConnect } from "@/lib/dbConnect";
import Chat from "@/models/chat";
import Message from "@/models/message";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request){
    dbConnect();
    const data = await request.json();
   
    const {content,chatId}=data;
    let newMessage={
        sender: JSON.parse(request.headers.get('user'))._id,
        content: content,
        chat: chatId
    }
    try{
        let message=await Message.create(newMessage)
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
          });
        
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

        return NextResponse.json(message,{status: 201})
    }catch(error){
        // //console.log("err: ",error)
        return NextResponse.json({'error':'error sending message'},{status: 400})
    }
}