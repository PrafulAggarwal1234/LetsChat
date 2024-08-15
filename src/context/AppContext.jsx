"use client"
import React from 'react'
import { createContext,useContext,useState } from 'react'
import { useEffect } from 'react';

const Context=createContext();
const AppContext = ({children}) => {
    const [user,setUser] = useState({});
    const [chats,setChats] = useState([]);
    const [selectedChat,setSelectedChat] = useState('');
    const [notification, setNotification] = useState([]);
    const [chatIndex,setChatIndex]=useState(0);
    const [typingChats,setTypingChats]=useState(new Set())
    useEffect(() => {
      // Filter out notifications that belong to the selected chat
      //console.log('notif: ',notification);
      //console.log('selected: ',selectedChat);
      const filteredNotifications = notification.filter(
        (notif) => notif.chat._id !== selectedChat._id
      );
      //console.log('filtered: ',filteredNotifications)
      setNotification(filteredNotifications);
      //console.log('notif after change: ',notification)
    }, [selectedChat]);
    //console.log("context")
  return (
    <Context.Provider value={{user,setUser,chats,setChats,selectedChat,setSelectedChat,notification,setNotification,chatIndex,setChatIndex,typingChats,setTypingChats}}>
        {children}
    </Context.Provider>

  )
}

export const ChatState = () => {
    return useContext(Context)
}

export default AppContext