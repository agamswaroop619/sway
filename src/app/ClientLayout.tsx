"use client";

import React, { useState } from "react";
import Navbar from "./components/navbar";
import SideNavBar from "./components/SideNavBar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sideNav, setSideNav] = useState(false);

  return (
    <div className="relative">
      <Navbar sideNav={sideNav} setSideNav={setSideNav}  />
      <div className="absolute top-0">
      {sideNav && <SideNavBar  setSideNav={setSideNav} />}
      </div>
      {children}
    </div>
  );
}
