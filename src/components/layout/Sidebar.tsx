import { NavLink } from "react-router-dom";
import { Scissors, X, LogOut } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { getSidebarIcon } from "./sidebar-icons";
import { supabase } from "@/lib/supabase";
interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}
export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/55 z-40 lg:hidden backdrop-blur-[2px] transition-opacity"
        />
      )}

      {/* Main Sidebar Panel */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-40 w-[280px] max-w-[86vw] bg-[#142b27] text-slate-100 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col justify-between border-l border-white/10 lg:sticky lg:top-0 lg:right-auto lg:bottom-auto lg:col-start-1 lg:row-start-1 lg:h-screen lg:w-[280px] lg:max-w-none lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between px-5 py-6 border-b border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-emerald-400 text-[#142b27] flex items-center justify-center shadow-sm shrink-0">
                <Scissors className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-black leading-tight text-white">
                  تفصيل الجلابيب
                </h1>
                <p className="text-xs text-emerald-300 font-semibold mt-1">
                  نظام إدارة المحل
                </p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title="إغلاق القائمة"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const IconComponent = getSidebarIcon(item.icon);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-3 rounded-lg font-semibold text-[15px] transition-colors ${
                      isActive
                        ? "bg-emerald-400/15 text-emerald-200 border-r-[3px] border-emerald-300"
                        : "text-slate-300 hover:bg-white/8 hover:text-white"
                    }`
                  }
                >
                  <IconComponent className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer: Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-slate-300 hover:bg-red-500/15 hover:text-red-300 transition-colors font-semibold text-[15px]"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}
