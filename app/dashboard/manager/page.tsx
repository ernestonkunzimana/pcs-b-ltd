'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderOpen,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  Target,
  Activity,
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

export default function ManagerDashboard() {
  const { user } = useAuth();
  const { activities, isConnected } = useSocket();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch manager-specific data
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const projectStats = [
    { name: 'Active Projects', value: 8, color: 'bg-blue-500' },
    { name: 'Completed', value: 12, color: 'bg-green-500' },
    { name: 'On Hold', value: 2, color: 'bg-yellow-500' },
    { name: 'Overdue', value: 1, color: 'bg-red-500' },
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
                Project Management Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your construction projects and team efficiently.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button>
                <FolderOpen className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Active Projects', value: '8', icon: FolderOpen, color: 'text-blue-600' },
              { title: 'Team Members', value: '24', icon: Users, color: 'text-green-600' },
              { title: 'Tasks Completed', value: '156', icon: CheckCircle, color: 'text-purple-600' },
              { title: 'Pending Tasks', value: '23', icon: Clock, color: 'text-orange-600' },
            ].map((stat, index) => (
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
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Status */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Project Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projectStats.map((stat, index) => (
                      <div key={stat.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                          <span className="text-sm font-medium">{stat.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{stat.value}</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${stat.color}`}
                              style={{ width: `${(stat.value / 23) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Team Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Team Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.slice(0, 5).map((activity, index) => (
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
                          <span className="text-xs text-gray-500">
                            {new Date(activity.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    {activities.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        No recent activities
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>
                  Your latest construction projects and their progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Office Complex Downtown', progress: 75, status: 'On Track', dueDate: '2024-03-15' },
                    { name: 'Residential Building Phase 2', progress: 45, status: 'In Progress', dueDate: '2024-04-20' },
                    { name: 'Shopping Mall Renovation', progress: 90, status: 'Near Completion', dueDate: '2024-02-28' },
                  ].map((project, index) => (
                    <div key={project.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{project.name}</h4>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>
                          <div className="text-sm text-gray-600">
                            Due: {new Date(project.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant={project.progress > 80 ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}