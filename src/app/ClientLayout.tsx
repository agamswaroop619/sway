"use client";

import React, { useState } from "react";
import Navbar from "./components/navbar";
import SideNavBar from "./components/SideNavBar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sideNav, setSideNav] = useState(false);

  return (
    <>
      <Navbar sideNav={sideNav} setSideNav={setSideNav} />
      {sideNav && <SideNavBar setSideNav={setSideNav} />}
      {children}
    </>
  );
}
