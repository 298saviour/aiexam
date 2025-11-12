'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap,
  School,
  FileText, 
  Brain,
  BarChart3,
  Mail,
  Bell, 
  Settings 
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/admin' },
  { icon: GraduationCap, label: 'Manage Teachers', href: '/dashboard/admin/teachers' },
  { icon: School, label: 'Manage Classes', href: '/dashboard/admin/classes' },
  { icon: Users, label: 'Manage Students', href: '/dashboard/admin/students' },
  { icon: FileText, label: 'Manage Exams', href: '/dashboard/admin/exams' },
  { icon: Brain, label: 'AI Logs', href: '/dashboard/admin/ai-logs' },
  { icon: BarChart3, label: 'Reports & Analytics', href: '/dashboard/admin/reports' },
  { icon: Mail, label: 'Communications', href: '/dashboard/admin/communications' },
  { icon: Settings, label: 'Settings', href: '/dashboard/admin/settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="p-4 space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
              {
                'bg-blue-50 text-blue-600 font-semibold': isActive,
                'text-gray-700 hover:bg-gray-100': !isActive,
              }
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
