import React from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Home from "./pages/LandingPage/Home";
import Navbar from "./components/Navbar";
function App() {
  return (
    <><Navbar/>
      <Analytics />
      <SpeedInsights />
      <ToastContainer />
      <Home />
    </>
  );
}

export default App;
