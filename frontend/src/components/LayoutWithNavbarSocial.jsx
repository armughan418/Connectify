import { Outlet } from "react-router-dom";
import NavbarSocial from "./NavbarSocial";

const LayoutWithNavbarSocial = () => {
  return (
    <>
      <NavbarSocial />
      <Outlet />
    </>
  );
};

export default LayoutWithNavbarSocial;

