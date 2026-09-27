import {
  ClipboardList,
  Database,
  Images,
  LayoutDashboard,
  Ruler,
  Settings,
  Users,
} from "lucide-react";

const ICON_MAP = {
  LayoutDashboard,
  Users,
  ClipboardList,
  Ruler,
  Database,
  Images,
  Settings,
};

export function getSidebarIcon(name: string) {
  return ICON_MAP[name as keyof typeof ICON_MAP] ?? LayoutDashboard;
}
