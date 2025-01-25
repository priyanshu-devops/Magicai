"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the external URL
    window.location.href = "https://demopr.rf.gd/";
  }, []);

  return <div><strong>Redirect the user to the specified page upon successful authentication. (UnProtected)</strong></div>;
};

export default LandingPage;
