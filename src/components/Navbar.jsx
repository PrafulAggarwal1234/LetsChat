import React, { useState } from 'react';
import { MdOutlineGroupAdd } from "react-icons/md";
import { RiChatNewLine } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { IoMdNotifications } from "react-icons/io";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { ChatState } from '@/context/AppContext';
import GroupChatModal from './frontend_modals/GroupChatModal';
import { getSender } from '@/configs/ChatLogics';

const Navbar = ({ setSearchedUsers }) => {
    const [search, setSearch] = useState('');
    const [searched, setSearched] = useState(false);
    const { user, setSelectedChat, notification, setNotification, chatIndex, setChatIndex } = ChatState();
    const [showNotification, setShowNotification] = useState(false);
    const [showLogout, setShowLogout] = useState(false);
    const router = useRouter();

    const handleSearch = async () => {
        const res = await axios.get(`/api/user?query=${search}`, {
            headers: {
                'Authorization': `Bearer ${user.token}`,
            },
        });
        setSearchedUsers(res.data.users);
        setSearched(true);
    };

    const handleNotificationClick = () => {
        setShowNotification((prev) => !prev);
    };

    const handleLogout = () => {
        Cookies.remove('authToken'); // Replace 'your-cookie-name' with the actual name of your cookie
        router.push('/auth'); // Redirect to the login page after logout
    };

    return (
        <div className="relative bg-gray-100 shadow-md rounded-lg">
            <div className="flex justify-between items-center bg-white p-3 rounded-t-lg">
                <FaUserCircle className='text-3xl text-gray-700' />
                <ul className="flex gap-5 items-center">
                    <li>
                        <GroupChatModal>
                            <MdOutlineGroupAdd className='text-2xl text-gray-700 hover:text-blue-600 cursor-pointer' />
                        </GroupChatModal>
                    </li>
                    <li className='relative'>
                        <IoMdNotifications className='text-2xl text-gray-700 hover:text-blue-600 cursor-pointer' onClick={handleNotificationClick} />
                        {(notification.length > 0 && !showNotification) && <div className='text-center bg-green-600 w-6 h-6 text-white rounded-full absolute top-[-12px] '>{notification.length}</div>}
                        {showNotification && (
                            <div className="absolute left-[-120px] mt-2 w-72 bg-white text-black p-3 rounded-lg shadow-lg z-50">
                                {!notification.length ? (
                                    <p>No New Messages</p>
                                ) : (
                                    notification.map((notif) => (
                                        <p
                                            key={notif._id}
                                            onClick={() => {
                                                setShowNotification(false);
                                                setSelectedChat(notif.chat);
                                                setNotification(notification.filter((n) => n !== notif));
                                            }}
                                            className="cursor-pointer hover:bg-gray-200 p-2 rounded-lg"
                                        >
                                            {notif.chat.isGroupChat
                                                ? `New Message in ${notif.chat.chatName}`
                                                : `New Message from ${getSender(user, notif.chat.users)}`}
                                        </p>
                                    ))
                                )}
                            </div>
                        )}
                    </li>
                    <li className="relative">
                        <BsThreeDotsVertical className='text-2xl text-gray-700 hover:text-blue-600 cursor-pointer' onClick={() => setShowLogout(!showLogout)} />
                        {showLogout && (
                            <div className="absolute right-0 mt-2 w-32 bg-white text-black p-2 rounded-lg shadow-lg z-50">
                                <p className="cursor-pointer hover:bg-gray-200 p-2 rounded-lg" onClick={handleLogout}>Logout</p>
                            </div>
                        )}
                    </li>
                </ul>
            </div>

            <div className="p-3 bg-gray-50">
                <div className="relative">
                    <input
                        className="border-2 border-gray-300 rounded-lg w-full py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:border-blue-500"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                        placeholder="Search users..."
                    />
                    {searched ? (
                        <ImCross
                            className="text-xl absolute text-red-600 top-2 right-2 cursor-pointer"
                            onClick={() => {
                                setSearchedUsers(null);
                                setSearched(false);
                            }}
                        />
                    ) : (
                        <FaSearch
                            className="text-xl absolute text-gray-500 top-2 right-2 cursor-pointer"
                            onClick={handleSearch}
                        />
                    )}
                </div>

                <div className="flex gap-3 mt-4">
                    <p className={`text-sm py-1 px-3  rounded-full cursor-pointer ${chatIndex === 0 ? 'text-white bg-blue-600 hover:bg-blue-700' : 'text-gray-600 bg-gray-200 hover:bg-gray-300'}`} onClick={() => setChatIndex(0)}>All</p>
                    <p className={`text-sm py-1 px-3  rounded-full cursor-pointer ${chatIndex === 1 ? 'text-white bg-blue-600 hover:bg-blue-700' : 'text-gray-600 bg-gray-200 hover:bg-gray-300'}`} onClick={() => setChatIndex(1)}>Groups</p>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
