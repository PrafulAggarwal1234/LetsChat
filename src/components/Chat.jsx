import { ChatState } from '@/context/AppContext';
import React from 'react';

const Chat = ({ chat }) => {
    const { user, selectedChat, setSelectedChat,typingChats } = ChatState();
    const chatName = chat.isGroupChat 
        ? chat.chatName 
        : chat.users.find((u) => u._id !== user._id).name;

    const chatPic = chat.isGroupChat 
        ? "https://cdn.pixabay.com/photo/2017/11/10/05/46/group-2935521_1280.png"  // Default group image
        : chat.users.find((u) => u._id !== user._id).pic;

    return (
        <div 
            key={chat._id} 
            className={`flex items-center p-3 mb-2 rounded-lg shadow-md cursor-pointer transition-colors duration-200 ${
                selectedChat && selectedChat._id === chat._id 
                ? 'bg-teal-600 text-white' 
                : 'bg-white hover:bg-gray-100 text-gray-900'
            }`}
            onClick={() => setSelectedChat(chat)}
        >
            <img 
                src={chatPic} 
                alt={`${chatName} profile`} 
                className="w-12 h-12 rounded-full mr-4 border-2 border-gray-300"
            />
            <div className="flex-1">
                <h2 className={`text-lg font-semibold ${selectedChat && selectedChat._id === chat._id ? 'text-white' : 'text-gray-900'}`}>
                    {chatName}
                </h2>
                {(!selectedChat || selectedChat._id !== chat._id) && (

                    typingChats.has(chat._id) ?<p className="text-green-400 text-sm truncate">typing...</p> :<p className="text-sm text-gray-600 truncate">
                        {chat.latestMessage ? chat.latestMessage.content : 'No messages yet'}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Chat;
