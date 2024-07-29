// src/components/Layout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header"; // Import the Header component

const Layout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;
