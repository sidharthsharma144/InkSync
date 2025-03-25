import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
// import Index from "./Pages/Index";
import Layout from "./Canvas/Pages/Layout";
import Home from "./Canvas/components/Homee";
import Projects from "./Canvas/components/Projects";
import Templates from "./Canvas/components/Template";
import CreateDesign from "./Canvas/components/CreateDesign";
import Main from "./Canvas/Pages/Main";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../config/firebase";

function App() {
    const navigate = useNavigate();
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                navigate("/canvas");
            } else {
                navigate("/login");
            }
        });
    }, []);
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout Route with Nested Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} /> {/* Default child route for "/" */}
          <Route path="templates" element={<Templates />} />
          <Route path="projects" element={<Projects />} />
        </Route>

        {/* Standalone Routes */}
        <Route path="design/create" element={<CreateDesign />} />
        <Route path="design/:design_id/edit" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
