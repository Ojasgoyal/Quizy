import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import Play from "./pages/Play";
import QuizBuilder from "./pages/QuizBuilder";
import Player from "./pages/Player";
import Results from "./components/Player/Results";

export default function App({ theme, setTheme }) {
  return (
    <>
      <Navbar theme={theme} setTheme={setTheme} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup/*" element={<Signup />} />
        <Route path="/login/*" element={<Login />} />
        <Route path="/play" element={<Play />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/edit/:quizId"
          element={
            <ProtectedRoute>
              <QuizBuilder />
            </ProtectedRoute>
          }
        />
        <Route path="/play/quiz/:quizId" element={<Player />}/>
        <Route path="/quiz/:quizId/results" element={<Results />}/>
      </Routes>
    </>
  );
}
