'use client';

import React, { useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Home,
  Users,
  FolderOpen,
  Package,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  User,
  Shield,
  Briefcase,
  HardHat,
  UserCheck,
  ChevronDown,
  Globe,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { notifications, isConnected } = useSocket();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'manager':
        return <Briefcase className="w-4 h-4" />;
      case 'worker':
        return <HardHat className="w-4 h-4" />;
      case 'client':
        return <UserCheck className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getNavigation = () => {
    const baseNavigation = [
      {
        name: 'Dashboard',
        href: `/dashboard/${user?.role}`,
        icon: Home,
        roles: ['admin', 'manager', 'worker', 'client'],
      },
      {
        name: 'Projects',
        href: '/projects',
        icon: FolderOpen,
        roles: ['admin', 'manager', 'worker'],
      },
      {
        name: 'Inventory',
        href: '/inventory',
        icon: Package,
        roles: ['admin', 'manager', 'worker'],
      },
      {
        name: 'Transactions',
        href: '/transactions',
        icon: DollarSign,
        roles: ['admin', 'manager'],
      },
      {
        name: 'ESG Metrics',
        href: '/esg-metrics',
        icon: BarChart3,
        roles: ['admin', 'manager'],
      },
      {
        name: 'Users',
        href: '/users',
        icon: Users,
        roles: ['admin'],
      },
      {
        name: 'Settings',
        href: '/settings',
        icon: Settings,
        roles: ['admin', 'manager'],
      },
    ];

    return baseNavigation.filter(item => 
      user?.role && item.roles.includes(user.role)
    );
  };

  const navigation = getNavigation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'sw', name: 'Kiswahili' },
    { code: 'fr', name: 'Français' },
    { code: 'rw', name: 'Kinyarwanda' },
    { code: 'lg', name: 'Luganda' },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 p-4 border-b">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                      P
                    </div>
                    <span className="font-semibold text-lg">PCS-B-LTD</span>
                  </div>
                  <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <Button
                            variant={window.location.pathname === item.href ? 'default' : 'ghost'}
                            className="w-full justify-start"
                            onClick={() => router.push(item.href)}
                          >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.name}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold">PCS-B-LTD</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              P
            </div>
            <span className="font-semibold text-xl">PCS-B-LTD</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Button
                        variant={window.location.pathname === item.href ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => router.push(item.href)}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="hidden lg:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 w-64"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-gray-500">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Globe className="w-4 h-4" />
                    English
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {languages.map((lang) => (
                    <DropdownMenuItem key={lang.code}>
                      {lang.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {getRoleIcon(user.role)}
                        <span className="text-xs text-muted-foreground capitalize">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={window.location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;