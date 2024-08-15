'use client'
import React from 'react'
import axios from 'axios'
import { ChatState } from '@/context/AppContext'
const UserCard = ({curruser}) => {
    const {user,setSelectedChat,chats,setChats}=ChatState();
    const createChat = async () =>{
        //console.log("cliced!")
        try{
            const {data}=await axios.post('api/chat',{userId: curruser._id},{
                headers: {
                  'Authorization': `Bearer ${user.token}`,
                },
              });
              setSelectedChat(data.chat)
              if(!chats.find((c)=>c._id===data.chat._id)){
                setChats([data.chat,...chats])
              }
        }catch(e){
            //console.log(e)
        }
        // //console.log("res: ",res);
    }
  return (
    <div className=" cursor-pointer flex items-center p-4 border rounded-lg" onClick={createChat}>
            <img 
                src={curruser.pic} 
                alt={`${curruser.name}'s profile`} 
                className="w-12 h-12 rounded-full mr-4"
            />
            <p className="text-black text-lg">{curruser.name}</p>
    </div>
  )
}

export default UserCard