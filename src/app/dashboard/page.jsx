"use client"
import ChatArea from '@/components/ChatArea'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import axios from 'axios'
import React from 'react'
import { useRouter } from 'next/navigation';
import { useEffect,useState } from 'react'
import { ChatState } from '@/context/AppContext'
import { useToast } from '@chakra-ui/react'
import Cookies from 'js-cookie';
const Page = () => {
  const toast=useToast()
  const router = useRouter();
  const {user,setUser}=ChatState();
  const [fetchAgain,setFetchAgain]=useState(false);
  const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};
useEffect(() => {
    if(!getCookie('authToken')){
      console.log('why here')
      toast({
        title: 'Please Login first!',
        status: 'info',
        isClosable: true,
      })
      router.replace('/auth');
      return
    }
    const fetchData = async () => {
      try {
        const res = await axios.get('api/dashboard', {
          headers: {
            'Authorization': `Bearer ${getCookie('authToken')}`,
          },
        });
        const userWithToken = {
            ...res.data.user,  // Spread the existing user data
            token: getCookie('authToken') // Add the new token field
        };
        
        setUser(userWithToken);
        // setName(res.data.user.name)
        // //console.log('res: ', res);
      } catch (error) {
        console.error('Error fetching data:', error);
        
        router.replace('/auth');
        toast({
          title: 'Your session has expired Please login again!',
          status: 'info',
          isClosable: true,
        })
        Cookies.remove('authToken');
        return
      }
    }
    fetchData();
},[]);
  return (
    
    <div className="flex">
        <Sidebar fetchAgain={fetchAgain}/>
        <ChatArea fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </div> 
  )
}

export default Page