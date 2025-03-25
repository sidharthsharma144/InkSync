import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Index from "./Pages/Index";
import Layout from "./Pages/Layout";
import Home from './components/Homee';
import Projects from './components/Projects';
import Templates from './components/Templates';
import CreateDesign from './components/CreateDesign';
import Main from "./Pages/Main";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout Route with Nested Routes */}
        <Route path="/" element={<Layout />}>
          
        </Route>

        {/* Standalone Routes */}

      </Routes>
    </BrowserRouter>
  );
}
export default App;
