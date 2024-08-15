"use client";

import { getSender, getSenderFull } from '@/configs/ChatLogics';
import { ChatState } from '@/context/AppContext';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileModal from './frontend_modals/ProfileModal';
import UpdateGroupChatModal from './frontend_modals/UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import Lottie from "react-lottie";
import animationData from "@/components/animations/animation.json";
import { socket } from '@/socket';

var selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const { user, selectedChat, setSelectedChat, notification, setNotification,chats,setChats,typingChats,setTypingChats } = ChatState();

  const toast = useToast();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
     
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        
        socket.emit("new message", data);
        setMessages([...messages, data]);
     
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === data.chat._id
              ? { ...chat, latestMessage: data }
              : chat
          )
        );

      } catch (error) {
        //console.log(error);
        toast({
          title: "Error Occurred!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
   
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", (chatid) => {
      setTypingChats((prevSet) => {
        const newSet = new Set(prevSet);
        newSet.add(chatid);
        return newSet;
      });
    });
    socket.on("stop typing", (chatid) => {
      setTypingChats((prevSet) => {
        const newSet = new Set(prevSet);
        newSet.delete(chatid);
        return newSet;
      });
    });
  },[user]);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      
      if (
        !selectedChatCompare || 
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        // //console.log('message added');
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <div className="flex justify-between items-center w-full py-3 px-2 text-2xl font-sans">
            <IconButton
              className="md:hidden flex"
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages && (
              !selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              )
            )}
          </div>
          <div className="flex flex-col justify-end p-3 bg-gray-100 w-full h-full rounded-lg overflow-y-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Spinner size="xl" width={20} height={20} />
              </div>
            ) : (
              <div className="flex flex-col overflow-y-scroll scrollbar-none">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} className="mt-3" isRequired>
              {(typingChats.has(selectedChat._id)) && (
                <div className="mb-3 ml-0">
                  <Lottie options={defaultOptions} height={50} width={70} />
                </div>
              )}
              <Input
                variant="filled"
                className="bg-gray-200"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-full">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </div>
      )}
    </>
  );
};

export default SingleChat;
