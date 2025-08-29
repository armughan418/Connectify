import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <h1>Hello from Home</h1>
      <button onClick={logout}>Logout</button>
    </>
  );
}

export default Home;
