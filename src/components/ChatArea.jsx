import { ChatState } from '@/context/AppContext';
import React from 'react';
import SingleChat from './SingleChat';

const ChatArea = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <div
      className={`${
        selectedChat ? 'flex' : 'hidden md:flex'
      } flex-col items-center p-3 bg-white w-full md:w-2/3 rounded-lg border border-gray-200`}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default ChatArea;
