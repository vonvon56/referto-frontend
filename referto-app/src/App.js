import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import HomePage from "./routes/HomePage";
import DetailPage from "./routes/DetailPage";
import "./App.css";
import LandingPage from "./routes/LandingPage";
import { getUser, getAssignments } from "./apis/api";
import LogInModal from "./components/Modals/LogIn";
import SignUpModal from "./components/Modals/SignUp";
import GoogleCallback from "./components/Auth/GoogleCallback";

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [firstAssignmentId, setFirstAssignmentId] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDetailPage, setIsDetailPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem('access_token');
        
        if (!accessToken) {
          setIsUserLoggedIn(false);
          return;
        }

        const user = await getUser();
        if (user) {
          setIsUserLoggedIn(true);
          const assignments = await getAssignments();
          if (assignments && assignments.length > 0) {
            setFirstAssignmentId(assignments[0].assignment_id);
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setIsUserLoggedIn(false);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="App h-screen flex flex-col w-full">
      <BrowserRouter>
        <Header
          isUserLoggedIn={isUserLoggedIn}
          setIsUserLoggedIn={setIsUserLoggedIn}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          showMenuButton={window.location.pathname.split('/').length === 2}
          isDetailPage={isDetailPage}
        />
        <div className="flex-1 overflow-y-auto w-full">
          <Routes>
            <Route
              path="/:assignmentId/:referenceId"
              element={<DetailPage setIsDetailPage={setIsDetailPage} />}
            />
            <Route
              path="/:assignmentId"
              element={
                <HomePage
                  isUserLoggedIn={isUserLoggedIn}
                  isSidebarOpen={isSidebarOpen}
                  setIsSidebarOpen={setIsSidebarOpen}
                  setIsDetailPage={setIsDetailPage}
                />
              }
            />
            <Route
              path="/account/login"
              element={
                <LogInModal
                  isUserLoggedIn={isUserLoggedIn}
                  setIsUserLoggedIn={setIsUserLoggedIn}
                />
              }
            />
            <Route
              path="/account/signup"
              element={
                <SignUpModal
                  isUserLoggedIn={isUserLoggedIn}
                  setIsUserLoggedIn={setIsUserLoggedIn}
                />
              }
            />
            <Route
              path="/"
              element={
                isUserLoggedIn ? <Navigate to={`/${firstAssignmentId}`} /> :
                <LandingPage
                  isUserLoggedIn={isUserLoggedIn}
                  setIsUserLoggedIn={setIsUserLoggedIn}
                />
              }
            />    
            <Route path="/google/callback" element={<GoogleCallback setIsUserLoggedIn={setIsUserLoggedIn} />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
