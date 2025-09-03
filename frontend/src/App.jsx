import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router , Routes ,Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Navbar from "./components/Navbar/Navbar";

export default function App() {
  return (
    <>
    <Navbar/>
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </Router>
    </>
  );
}
