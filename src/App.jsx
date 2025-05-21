import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LogInPage";
import SignUpPage from "./components/SignUpPage";
import HomePage from "./components/Home";
import "./index.css";
import { UserProvider } from "./context/UserContext";
import KYCPage from "./components/KYCPage";

function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
         <Route path="/kyc" element={<KYCPage />} />
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
