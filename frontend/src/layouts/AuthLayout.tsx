'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'sw', name: 'Kiswahili' },
    { code: 'fr', name: 'Français' },
    { code: 'rw', name: 'Kinyarwanda' },
    { code: 'lg', name: 'Luganda' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
            P
          </div>
          <span className="font-bold text-xl text-gray-800">PCS-B-LTD</span>
        </div>
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
      </div>

      {/* Main Content */}
      <div className="flex min-h-screen">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center bg-primary text-white p-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-primary font-bold text-3xl mb-8">
              P
            </div>
            <h1 className="text-4xl font-bold mb-4">PCS-B-LTD</h1>
            <p className="text-xl mb-8 text-blue-100">
              Professional Construction Services Management Platform
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-800 bg-opacity-30 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Project Management</h3>
                <p className="text-blue-100">Comprehensive project and resource management</p>
              </div>
              <div className="bg-blue-800 bg-opacity-30 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Real-time Updates</h3>
                <p className="text-blue-100">Instant notifications and live collaboration</p>
              </div>
              <div className="bg-blue-800 bg-opacity-30 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Multi-language Support</h3>
                <p className="text-blue-100">Available in 5 languages</p>
              </div>
              <div className="bg-blue-800 bg-opacity-30 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Offline Access</h3>
                <p className="text-blue-100">Work without internet connection</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Panel - Auth Form */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md"
          >
            {children}
          </motion.div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full opacity-20 animate-pulse" />
      </div>
    </div>
  );
};

export default AuthLayout;