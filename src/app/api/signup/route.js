import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user";
import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";

// export default async function handler(req, res) {
//     //console.log("yaha!")
//   await dbConnect();
//   //console.log("db connection success!")
//   if (req.method === "POST") {
//     const { name, email, password } = req.body;

//     try {
//       // Check if the user already exists
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({ message: "Email already in use" });
//       }

//       // Hash the password
//     //   const hashedPassword = await bcrypt.hash(password, 10);

//       // Create a new user
//       const newUser = await User.create({
//         name,
//         email,
//         password: password,
//       });

//       res.status(201).json({ message: "User created successfully", user: newUser });
//     } catch (error) {
//       res.status(500).json({ message: "Error creating user", error });
//     }
//   } else {
//     res.status(405).json({ message: "Method not allowed" });
//   }
// }

export async function POST(request) {
    dbConnect();
    const { name, email, password } = await request.json();

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ message: "Email already in use" }, { status: 400 });
      }

      // Hash the password
    //   const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
     
      const newUser = await User.create({
        name,
        email,
        password
      });

      return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });
    } catch (error) {
        // console.error("Error creating user:", error);
        return NextResponse.json({ message: "Error creating user", error }, { status: 500 });
    }
}