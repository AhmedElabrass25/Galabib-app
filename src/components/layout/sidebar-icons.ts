import {
  ClipboardList,
  Database,
  Images,
  LayoutDashboard,
  Ruler,
  Settings,
  Users,
  Flame,
  AlertCircle,
} from "lucide-react";

const ICON_MAP = {
  LayoutDashboard,
  Users,
  ClipboardList,
  Flame,
  AlertCircle,
  Ruler,
  Database,
  Images,
  Settings,
};

export function getSidebarIcon(name: string) {
  return ICON_MAP[name as keyof typeof ICON_MAP] ?? LayoutDashboard;
}
