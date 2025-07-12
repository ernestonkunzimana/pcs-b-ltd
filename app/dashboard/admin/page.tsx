'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  FolderOpen,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Award,
  BarChart3,
  Calendar,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import apiClient from '@/lib/api';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalUsers: number;
  totalRevenue: number;
  monthlyGrowth: number;
  pendingTasks: number;
  completedTasks: number;
  inventoryItems: number;
  lowStockItems: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  user: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { activities, isConnected } = useSocket();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, activitiesResponse] = await Promise.all([
          apiClient.getDashboardStats(),
          apiClient.getRecentActivities(10),
        ]);

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }

        if (activitiesResponse.success) {
          setRecentActivities(activitiesResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Projects',
      value: stats?.totalProjects || 0,
      change: '+12%',
      changeType: 'positive' as const,
      icon: FolderOpen,
      color: 'text-blue-600',
    },
    {
      title: 'Active Users',
      value: stats?.totalUsers || 0,
      change: '+8%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Total Revenue',
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      change: '+15%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-purple-600',
    },
    {
      title: 'Inventory Items',
      value: stats?.inventoryItems || 0,
      change: stats?.lowStockItems ? `-${stats.lowStockItems}` : '0',
      changeType: stats?.lowStockItems ? ('negative' as const) : ('neutral' as const),
      icon: Package,
      color: 'text-orange-600',
    },
  ];

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your construction projects today.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-500">
                {isConnected ? 'Real-time updates active' : 'Offline mode'}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center text-xs text-gray-600 mt-1">
                      {stat.changeType === 'positive' ? (
                        <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                      ) : stat.changeType === 'negative' ? (
                        <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                      ) : (
                        <Activity className="w-3 h-3 text-gray-500 mr-1" />
                      )}
                      <span className={
                        stat.changeType === 'positive' ? 'text-green-600' :
                        stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                      }>
                        {stat.change}
                      </span>
                      <span className="ml-1">from last month</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Overview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Project Overview
                  </CardTitle>
                  <CardDescription>
                    Current status of all construction projects
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Projects</span>
                    <span className="text-sm text-gray-600">
                      {stats?.activeProjects || 0} of {stats?.totalProjects || 0}
                    </span>
                  </div>
                  <Progress 
                    value={stats?.totalProjects ? (stats.activeProjects / stats.totalProjects) * 100 : 0} 
                    className="h-2"
                  />
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {stats?.completedTasks || 0}
                      </div>
                      <div className="text-sm text-green-700">Completed Tasks</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {stats?.pendingTasks || 0}
                      </div>
                      <div className="text-sm text-orange-700">Pending Tasks</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Activities
                  </CardTitle>
                  <CardDescription>
                    Latest updates from your team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(activities.length > 0 ? activities : recentActivities).slice(0, 5).map((activity, index) => (
                      <div key={activity.id || index} className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={activity.user.avatar} />
                          <AvatarFallback>
                            {activity.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{activity.user.name}</span>
                            {' '}
                            {activity.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {new Date(activity.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {activities.length === 0 && recentActivities.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        No recent activities
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Alerts and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stats?.lowStockItems && stats.lowStockItems > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <Package className="w-4 h-4 text-orange-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-orange-800">
                          Low Stock Alert
                        </p>
                        <p className="text-xs text-orange-600">
                          {stats.lowStockItems} items need restocking
                        </p>
                      </div>
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        {stats.lowStockItems}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-800">
                        Upcoming Deadlines
                      </p>
                      <p className="text-xs text-blue-600">
                        3 projects due this week
                      </p>
                    </div>
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      3
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common administrative tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Create New Project
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Package className="w-4 h-4 mr-2" />
                    Update Inventory
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Generate Reports
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}