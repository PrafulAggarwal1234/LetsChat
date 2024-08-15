"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { ChatState } from "@/context/AppContext";
import { useToast } from '@chakra-ui/react'
export default function AuthPage() {
  const router=useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [name,setName] = useState('');
  const {user,setUser}=ChatState();
  const toast = useToast()
  const toggleAuthMode = (e) => {
    setIsLogin(!isLogin);
  };

  const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  };

  const handleLogin = async (e) =>{
    e.preventDefault()
    try{
      const res = await axios.post('/api/login',{email,password});
      console.log('res: ',res)
      if(res.status===200){
        toast({
          title: 'Login Successfull',
          description: "",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        const token=res.data.token;
        setCookie('authToken',token);
        
        router.push('/dashboard')
      }
      else if(res.status==400){
        toast({
          title: 'Invalid Credentials!!.',
          description: "Please enter correct details",
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      }
      else{
        toast({
          title: 'Something Went Wrong!',
          description: "Please enter correct details",
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      }
    }catch(e){
      if(e.response && e.response.status){
          toast({
            title: 'Invalid Credentials!!.',
            description: "Please enter correct details",
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
      }
      else{
        toast({
          title: 'Something Went Wrong!',
          description: "Please enter correct details",
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      }
    }
    
  }

  const handleSignup = async (e) =>{
    e.preventDefault()
    const res=await axios.post('/api/signup',{email,name,password})
    handleLogin(e);
    
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form className="text-black">
          {!isLogin && (
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your name"
                onChange={(e)=>{setName(e.target.value)}}
                value={name}
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
              onChange={(e)=>{setEmail(e.target.value)}}
              value={email}
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
              onChange={(e)=>{setPassword(e.target.value)}}
              value={password}
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={(e)=>isLogin?handleLogin(e):handleSignup(e)}
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={toggleAuthMode}
              className="ml-2 font-medium text-indigo-600 hover:text-indigo-500"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}