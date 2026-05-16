"use client"; // Ensure it's a client component

import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "@/components/mobile-sidebar";
import ThemeSwitch from "@/components/ThemeSwitch";
import { useNotification } from "@/hooks/useNotification"; // ✅ Fix: Use named import

const Navbar = () => {
  useNotification(); // Call the hook inside component

  return (
    <div className="flex items-center p-4">
      <MobileSidebar />
      <div className="flex w-full justify-between items-center">
        <ThemeSwitch />
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
