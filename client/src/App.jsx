import React from 'react'
import Dashboard from './Pages/Dashboard'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Components/auth/Login'
import SignUp from './Components/auth/SignUp'
import Notifications from './Components/Notification/Notifications'
import Profile from './Pages/Profile';
import Search from "./Components/search/Search"
import Main from './Components/home/Main';
import Message from './Components/Message/Message';

function App() {
  return (
    <>
      <BrowserRouter>
              <Routes>
             
              <Route path="/" element={<Login />} />
              <Route path="SignUp" element={<SignUp />} />
              <Route path="Login" element={<Login  />} />
              {/* <Route path="forgotpassword" element ={<ForgotPassword />} />
              <Route path={`/resetpassword/:token`} element ={<ResetPassword />} /> */}
                {/* nested routes below */}
                <Route path="nav" element={<Dashboard />}>
                
                  <Route path="notifications"element ={<Notifications />} />
                  <Route path="profile"element ={<Profile />} />
                  <Route path="search"element ={<Search />} />
                  <Route path="home"element ={<Main />} />
                  <Route path="message/:userID" element ={<Message />} /> 
                  <Route path="message" element ={<Message />} /> 

               </Route>

              </Routes>
            </BrowserRouter>
           
      </>
  )
}

export default App
