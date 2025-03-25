// import { useContext, useEffect, useState } from 'react'
// import './App.css'
// import { createBrowserRouter, Route, RouterProvider, Routes, useNavigate } from 'react-router-dom'
// import Navbar from './components/Navbar'
// import Hero from './components/Hero'
// import CompanyCarousel from './components/CompanyCarousel'
// import Features from './components/Features'
// import { onAuthStateChanged } from 'firebase/auth'
// import ScrollPage from './components/ScrollPage'
// import Footer from './components/Footer/Footer'
// import NotesMain from './pages/NotesMain'
// import { ToastContainer } from 'react-toastify'
// import Home from './pages/LandingPage/Home'
// import Login from './pages/Chat-App/Login/Login'
// import Chat from './pages/Chat-App/Chat/Chat'
// import ProfileUpdate from './pages/Chat-App/ProfileUpdate/ProfileUpdate'
// import VideoCallPage from './pages/VideoCall'

// function App() {
//     return (
//         <>
//             <ToastContainer/>
//             <Routes>
//                 <Route path='/' element={<Home/>} />
//                 <Route path='/login' element={<Login/>} />
//                 <Route path='/chat-app' element={<Chat/>} />
//                 <Route path='/profile-update' element={<ProfileUpdate/>} />
//                 <Route path='/chat-app/chat' element={<Chat/>} />
//                 <Route path='/note-app' element={<NotesMain/>} />
//                 <Route path='/video-call/*' element={<VideoCallPage/>}/>
//             </Routes>
//         </>
//     );
// }
// export default App

// // This is STUXNET Here

import { Routes, Route } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import Home from "./pages/LandingPage/Home";
import Login from "./pages/Chat-App/Login/Login";
import Chat from "./pages/Chat-App/Chat/Chat";
import ProfileUpdate from "./pages/Chat-App/ProfileUpdate/ProfileUpdate";
import NotesMain from "./pages/NotesMain";
import VideoCallPage from "./pages/VideoCall";
import Navbar from "./components/Navbar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import MainCanvas from "./pages/MainCanvas";
import Homee from "./pages/Canvas/components/Homee";
import CreateDesign from "./pages/Canvas/components/CreateDesign";
import TemplateDesign from "./pages/Canvas/components/main/TemplateDesign";
import Projects from "./pages/Canvas/components/Projects";
import Main from "./pages/Canvas/Pages/Main";
import Layout from "./pages/Canvas/Pages/Layout";
import CanvasHome from "./pages/Canvas/CanvasHome";
function App() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile-update" element={<ProfileUpdate />} />
        <Route path="/textink/chat" element={<Chat />} />
        <Route path="/note-app" element={<NotesMain />} />
        <Route path="/inkonnect/*" element={<VideoCallPage />} />
        <Route element={<Layout />}>
          <Route path="/canvas/home" element={<CanvasHome />} />
          <Route path="/canvas/templates" element={<TemplateDesign />} />
          <Route path="/canvas/projects" element={<Projects />} />
        </Route>
        <Route path="/canvas/design/create" element={<CreateDesign />} />
        <Route path="/canvas/design/:design_id/edit" element={<Main />} />
      </Routes>
    </>
  );
}

export default App;
