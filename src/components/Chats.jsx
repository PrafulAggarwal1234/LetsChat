'use client'
import { ChatState } from '@/context/AppContext'
import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import Chat from './Chat'

const Chats = ({ fetchAgain }) => {
    const { user, chats, setChats, selectedChat,chatIndex,notification } = ChatState();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const { data } = await axios.get("/api/chat", {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                //console.log("chats: ", data.chats);
                setChats(data.chats);
            } catch (err) {
                //console.log(err);
            }
        };
        if (user && user.token) {
            fetchChats();
        }
    }, [fetchAgain, user]);

    return (
        <div className="bg-white h-screen p-4 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Chats</h1>
            <div className="flex flex-col gap-4">
                {chats && chats.map((chat) => (
                    (chatIndex==0 || (chat.isGroupChat)) && <Chat 
                        key={chat._id} 
                        chat={chat} 
                        className={`p-4 rounded-lg cursor-pointer ${selectedChat === chat ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-gray-50 hover:bg-gray-100'}`} 
                    />
                ))}
            </div>
        </div>
    )
}

export default Chats;
