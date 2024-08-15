import { dbConnect } from "@/lib/dbConnect";
import Chat from "@/models/chat";
import User from "@/models/user";
import { NextResponse } from "next/server";

//  Rename group
export async function PUT(request){
    dbConnect();
    const data=await request.json()
    const {chatId, userId} = data;
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            $addToSet: { users: userId },
        },
        {
            new: true
        }
    ).populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!updatedChat) {
        return NextResponse.json({message: "Chat Not Found"},{status: 404});
    } else {
        return NextResponse.json({updatedChat},{status: 200});
    }
}