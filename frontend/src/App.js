import "./App.css";
import ForgetPassword from "./pages/forget-password";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Otp from "./pages/otp";
import Signup from "./pages/signup";
import UpdatePassword from "./pages/updatePassword";
import Super from "./components/super";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/otp-verification" element={<Otp />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route element={<Super />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </>
  );
}

export default App;
