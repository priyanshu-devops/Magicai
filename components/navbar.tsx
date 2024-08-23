import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "@/components/mobile-sidebar";
import ThemeSwitch from "@/components/ThemeSwitch"; // Import ThemeSwitch

const Navbar = () => {
  return (
    <div className="flex items-center p-4">
      <MobileSidebar />
      <div className="flex w-full justify-between items-center">
        <ThemeSwitch /> {/* Add ThemeSwitch here */}
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
