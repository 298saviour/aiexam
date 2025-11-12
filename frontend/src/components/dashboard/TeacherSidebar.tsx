'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileText, 
  Upload, 
  Brain,
  Mail,
  Bell, 
  Settings 
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/teacher' },
  { icon: Users, label: 'Manage Students', href: '/dashboard/teacher/students' },
  { icon: BookOpen, label: 'Manage Courses', href: '/dashboard/teacher/courses' },
  { icon: FileText, label: 'Manage Exams', href: '/dashboard/teacher/exams' },
  { icon: Upload, label: 'Upload Lesson Notes', href: '/dashboard/teacher/upload' },
  { icon: Brain, label: 'AI Training Status', href: '/dashboard/teacher/ai-status' },
  { icon: Mail, label: 'Communications', href: '/dashboard/teacher/communications' },
  { icon: Settings, label: 'Settings', href: '/dashboard/teacher/settings' },
];

export function TeacherSidebar() {
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
