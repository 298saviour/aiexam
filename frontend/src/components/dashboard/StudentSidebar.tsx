'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  TrendingUp,
  Mail, 
  Bell, 
  Settings 
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/student' },
  { icon: FileText, label: 'Take Exam', href: '/dashboard/student/exams' },
  { icon: BookOpen, label: 'My Courses', href: '/dashboard/student/courses' },
  { icon: TrendingUp, label: 'Performance', href: '/dashboard/student/performance' },
  { icon: Mail, label: 'Communications', href: '/dashboard/student/communications' },
  { icon: Settings, label: 'Settings', href: '/dashboard/student/settings' },
];

export function StudentSidebar() {
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
