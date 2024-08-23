"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the external URL
    window.location.href = "https://demopr.rf.gd/";
  }, []);

  return <div>Landing Page (UnProtected)</div>;
};

export default LandingPage;
