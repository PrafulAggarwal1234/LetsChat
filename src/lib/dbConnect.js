// import mongoose from "mongoose";
// import User from "@/models/user";

import mongoose from "mongoose"

export const dbConnect = async () => {
    await mongoose.connect(process.env.MONGO_URI)

    mongoose.connection.on('connected', ()=>{
        //console.log('Connected suceesfully');
    })

    mongoose.connection.on('error',(err)=>{
        //console.log('error connecting to mongodb: ',err)
    })
}

// import mongoose from 'mongoose';

// let isConnected; // Track the connection status

// export const dbConnect = async () => {
//   if (isConnected) {
//     //console.log('Using existing database connection');
//     return;
//   }

//   try {
//     const db = await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     isConnected = db.connections[0].readyState === 1;
//     if (isConnected) {
//       //console.log('Database connected successfully');
//     }
//   } catch (error) {
//     console.error('Error connecting to the database:', error);
//     throw new Error('Failed to connect to the database');
//   }
// };