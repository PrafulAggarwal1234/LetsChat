'use client'
import React from 'react'
import Navbar from './Navbar'
import { useState } from 'react'
import SearchResults from './SearchResults'
import { ChatState } from '@/context/AppContext'
import Chats from './Chats'
const Sidebar = ({fetchAgain}) => {
  const [searchedUsers,setSearchedUsers]=useState();
  return (
    <div className="w-[25%]">
        <Navbar setSearchedUsers={setSearchedUsers} />
        <div className="bg-gray-300 w-full h-screen">
          {searchedUsers ? <SearchResults users={searchedUsers}/> : <Chats fetchAgain={fetchAgain}/>}
          {/* <Chats/> */}
        </div>
    </div>
  )
}

export default Sidebar