import MobileSidebar from "@/components/mobile-sidebar";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar"; 
import { Providers } from "../providers";
import { getApiLimitCount } from "@/lib/api-limt";
// Check correct path


const DashboardLayout = async({
  children
}: {
  children: React.ReactNode;
}) => {
  const apiLimitCount=await getApiLimitCount();
  

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
     
        <Sidebar apiLimitCount={apiLimitCount ?? 0} isPro={false} />
      </div>
      <main className="md:pl-60"> {}
      <Providers>
        <Navbar />
        {children}
        </Providers>
      </main>
      
    </div>
  );
}

export default DashboardLayout;
