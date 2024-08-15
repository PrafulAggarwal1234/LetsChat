import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user";
import { NextResponse } from "next/server";
import jsonwebtoken from "jsonwebtoken";

export async function POST(request){
    dbConnect();
    //console.log("db connection success!")
    const {email, password } = await request.json();
    try{
        //console.log("here in login")
        const user = await User.findOne({email});
        if (!user) {
            return NextResponse.json({ message: "email not registered" },{status: 400});
        }
        if(password!==user.password){
            return NextResponse.json({ message: "Invalid Password!" },{status: 400});
        }
        const token=jsonwebtoken.sign({_id: (user._id),'email':email,'name': (user.name)},process.env.JWT_SECRET)
        return NextResponse.json({message: "Login Success",'token': token},{status: 200});
    }catch(err){
        //console.log(err)
        return NextResponse.json({ message: "Error logging in!" },{status: 500});
    }
}