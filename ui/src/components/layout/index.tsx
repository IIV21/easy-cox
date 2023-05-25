import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Navbar from "../navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  let token: string | null = null;

  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  return token ? (
    <div>
      <Navbar />
      {children}
    </div>
  ) : (
    <div>You are not authorized to view this page</div>
  );
}
