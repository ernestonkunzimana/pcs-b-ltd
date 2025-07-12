'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderOpen,
  Calendar,
  DollarSign,
  MessageSquare,
  FileText,
  Camera,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ClientDashboard() {
  const { user } = useAuth();
  const { isConnected } = useSocket();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const projects = [
    {
      id: 1,
      name: 'Modern Villa Construction',
      progress: 65,
      status: 'In Progress',
      budget: 250000,
      spent: 162500,
      startDate: '2024-01-15',
      expectedCompletion: '2024-06-30',
    },
    {
      id: 2,
      name: 'Office Building Renovation',
      progress: 30,
      status: 'Planning',
      budget: 180000,
      spent: 54000,
      startDate: '2024-02-01',
      expectedCompletion: '2024-08-15',
    },
  ];

  const recentUpdates = [
    {
      id: 1,
      project: 'Modern Villa Construction',
      update: 'Foundation work completed successfully',
      date: '2024-01-20',
      type: 'milestone',
    },
    {
      id: 2,
      project: 'Modern Villa Construction',
      update: 'Electrical rough-in started',
      date: '2024-01-18',
      type: 'progress',
    },
    {
      id: 3,
      project: 'Office Building Renovation',
      update: 'Permits approved, construction can begin',
      date: '2024-01-16',
      type: 'milestone',
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
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                Track your construction projects and stay updated on progress.
              </p>
            </div>
            <Button>
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Manager
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Active Projects', value: '2', icon: FolderOpen, color: 'text-blue-600' },
              { title: 'Total Investment', value: '$430K', icon: DollarSign, color: 'text-green-600' },
              { title: 'Avg. Progress', value: '47%', icon: TrendingUp, color: 'text-purple-600' },
              { title: 'Days to Completion', value: '156', icon: Clock, color: 'text-orange-600' },
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

          {/* Projects Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5" />
                  Your Projects
                </CardTitle>
                <CardDescription>
                  Overview of your construction projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {projects.map((project, index) => (
                    <div key={project.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{project.name}</h3>
                        <Badge variant={project.status === 'In Progress' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-600">Progress</div>
                          <div className="text-lg font-semibold">{project.progress}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Budget</div>
                          <div className="text-lg font-semibold">${project.budget.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Spent</div>
                          <div className="text-lg font-semibold">${project.spent.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Expected Completion</div>
                          <div className="text-lg font-semibold">
                            {new Date(project.expectedCompletion).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Overall Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          <FileText className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <Camera className="w-4 h-4 mr-2" />
                          Photos
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Messages
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Updates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Updates
                </CardTitle>
                <CardDescription>
                  Latest updates from your construction projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUpdates.map((update, index) => (
                    <div key={update.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        update.type === 'milestone' ? 'bg-green-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{update.project}</h4>
                          <span className="text-xs text-gray-500">
                            {new Date(update.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{update.update}</p>
                        <Badge 
                          variant="outline" 
                          className="mt-2"
                          size="sm"
                        >
                          {update.type === 'milestone' ? 'Milestone' : 'Progress Update'}
                        </Badge>
                      </div>
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