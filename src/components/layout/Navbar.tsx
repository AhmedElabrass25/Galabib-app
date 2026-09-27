import { Menu, Plus, Scissors } from "lucide-react";
import { Link } from "react-router-dom";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#f8faf8]/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-9">
      <div className="w-full max-w-375 mx-auto py-3 flex items-center justify-between gap-3">
        {/* Mobile Menu Button & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors min-h-10 min-w-10"
            title="فتح القائمة"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
              <Scissors className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-slate-900 text-sm">
              تفصيل الجلابيب
            </span>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="flex items-center gap-3">
          <Link
            to="/orders/new"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold text-sm px-3.5 py-2 rounded-lg transition-colors min-h-10.5"
          >
            <Plus className="w-4 h-4 text-emerald-200" />
            <span>طلب جديد</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
