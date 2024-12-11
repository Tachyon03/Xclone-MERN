import React from 'react'
import {Routes, Route, Navigate} from "react-router-dom";
import HomePage from './pages/home/HomePage.js';
import SignUpPage from './pages/auth/signup/SignUpPage.js';
import LoginPage from './pages/auth/login/LoginPage.js';
import Sidebar from './components/common/Sidebar.js';
import RightPanel from './components/common/RightPanel.js'
import NotificationPage from './pages/notification/NotificationPage.js'
import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { baseUrl } from 'C:/Users/3sidd/OneDrive/Desktop/Xclone/frontend/src/constant/url.js';
import LoadingSpinner from './components/common/LoadingSpinner.js';
import ProfilePage from './pages/profile/ProfilePage.js';

const App = () => {

  const {data: authUser, isLoading,} = useQuery({
    queryKey: ["authUser"],
    queryFn: async()=>{
      try{
        const res = await fetch(`${baseUrl}/api/auth/me`,{
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json"
          }
        })
        const data = await res.json();
        if(data.error){
          return null
        }

        if(!res.ok){
          throw new Error(data.error || "Something went wrong")
        }
        console.log("Success", data);
        return data;
      }
      catch(error){
        throw new Error(error);
      }
    },
    retry: false,
  });

  console.log(authUser)

  if(isLoading){
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoadingSpinner size='lg'/>
      </div>
    );
  }
   
  return (
    <div className='flex max-w-6xl mx-auto'>
      {authUser && <Sidebar/>}
    <>
      <Routes>
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login"/>}/>
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/" />}/>
        <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to="/"/>}/>
        <Route path="/notifications" element={authUser ? <NotificationPage/> : <Navigate to="/login"/>}/>
        <Route path="/profile/:username" element={authUser ? <ProfilePage/>: <Navigate to="/login"/>} />
      </Routes>
    </>
      {authUser && <RightPanel/>}
      <Toaster/>
    </div>
  )
}

export default App;

