import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import SignIn from "./components/auth/login/Login";
import SignUp from "./components/auth/signup/SignUp";
import Chat from "./components/Chat/Chat";
import { Box, Container } from "@mui/material";

const PrivateRoutes = () => {
  const token = localStorage.getItem("chat-app-token");
  const location = useLocation();

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" replace state={{ from: location }} />
  );
};

function App() {
  return (
    <Routes>
      <Route path="auth">
        <Route path="login" element={<SignIn />} />
        <Route path="registration" element={<SignUp />} />
      </Route>
      <Route path="" element={<PrivateRoutes />}>
        <Route path="" element={<Chat />} />
        <Route path="chat" element={<Chat />} />
      </Route>
    </Routes>
  );
}

export default App;
