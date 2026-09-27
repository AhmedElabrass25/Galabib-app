import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f6f3] text-slate-900 flex font-sans lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Container */}
      <div className="flex-1 min-w-0 min-h-screen flex flex-col lg:col-start-2 lg:row-start-1">
        <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 w-full max-w-375 mx-auto px-4 py-5 sm:px-6 sm:py-7 lg:px-9 lg:py-9 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
