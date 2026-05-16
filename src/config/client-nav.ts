import {
  Bell,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  Mail,
  MessageCircle,
  MessageSquare,
  Palette,
  Settings,
  Smartphone,
  User,
  type LucideIcon,
} from 'lucide-react';

export interface PortalNavChild {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface PortalNavItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  children?: PortalNavChild[];
}

export const clientNavItems: PortalNavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Event', href: '/events', icon: CalendarDays },
  { label: 'Subscription', href: '/subscription', icon: CreditCard },
  { label: 'Payment', href: '/payment', icon: CreditCard },
  {
    label: 'Communication',
    icon: MessageSquare,
    children: [
      { label: 'Mail', href: '/communication/mail', icon: Mail },
      { label: 'Chat', href: '/communication/chat', icon: MessageCircle },
      { label: 'Notification', href: '/communication/notification', icon: Bell },
    ],
  },
  { label: 'Mobile Theme', href: '/mobile-theme', icon: Smartphone },
  { label: 'Setting', href: '/settings', icon: Settings },
];

export const clientModuleCards = [
  { title: 'Upcoming Events', value: '0', detail: 'Event invitations and schedules', icon: CalendarDays },
  { title: 'Subscription', value: 'Active', detail: 'Current client access status', icon: Palette },
  { title: 'Payments', value: '0', detail: 'Recent payment activity', icon: CreditCard },
];
