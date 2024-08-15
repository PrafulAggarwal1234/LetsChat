import { dbConnect } from "@/lib/dbConnect";
import Chat from "@/models/chat";
import Message from "@/models/message";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(request,{params}){
    dbConnect();
    try {
        const messages = await Message.find({ chat: params.chatId })
        .populate("sender", "name pic email")
        .populate("chat");
        return NextResponse.json(messages,{status: 200})
    } catch (error) {
        return NextResponse.json({'error':'error feteching message for the chat'},{status: 400})
    }
}