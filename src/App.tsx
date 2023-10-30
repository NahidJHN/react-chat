import { Route, Routes } from "react-router-dom";
import SignIn from "./components/auth/login/Login";
import SignUp from "./components/auth/signup/SignUp";
import Chat from "./components/Chat/Chat";
import { Box, Container } from "@mui/material";

function App() {
  return (
    <Routes>
      <Route path="auth">
        <Route path="login" element={<SignIn />} />
        <Route path="registration" element={<SignUp />} />
      </Route>
      <Route path="" element={<Chat />} />
    </Routes>
  );
}

export default App;
