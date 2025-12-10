import { Outlet } from "react-router-dom";
import Navbar from "./navbar";

const LayoutWithNavbar = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default LayoutWithNavbar;

