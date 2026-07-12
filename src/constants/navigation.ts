// ─── Navigation Constants ─────────────────────────────────────────────────────
// Sidebar navigation structure. Uses gorgeous Lucide Outline icons for a premium, non-flat look.

import {
  LayoutDashboard,
  Building2,
  Tags,
  Users,
  Package,
  PlusCircle,
  RefreshCw,
  Calendar,
  Wrench,
  ClipboardCheck,
  BarChart3,
  Bell,
  Settings,
} from 'lucide-react';
import React from 'react';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
  exact?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'Organization',
    items: [
      { href: '/organization/departments', label: 'Departments', icon: Building2 },
      { href: '/organization/categories', label: 'Categories', icon: Tags },
      { href: '/organization/employees', label: 'Employees', icon: Users },
    ],
  },
  {
    label: 'Asset Management',
    items: [
      { href: '/assets', label: 'All Assets', icon: Package },
      { href: '/assets/register', label: 'Register Asset', icon: PlusCircle },
      { href: '/allocation', label: 'Allocation', icon: RefreshCw },
      { href: '/booking', label: 'Booking', icon: Calendar },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/maintenance', label: 'Maintenance', icon: Wrench },
      { href: '/audit', label: 'Audit', icon: ClipboardCheck },
      { href: '/reports', label: 'Reports', icon: BarChart3 },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/notifications', label: 'Notifications', icon: Bell },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];
