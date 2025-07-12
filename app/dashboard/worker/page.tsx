'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Calendar, MapPin, PenTool as Tool, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function WorkerDashboard() {
  const { user } = useAuth();
  const { isConnected } = useSocket();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const todayTasks = [
    { id: 1, title: 'Install electrical wiring - Floor 2', priority: 'high', estimatedHours: 4, location: 'Building A' },
    { id: 2, title: 'Paint interior walls - Room 201', priority: 'medium', estimatedHours: 6, location: 'Building A' },
    { id: 3, title: 'Install plumbing fixtures', priority: 'low', estimatedHours: 3, location: 'Building B' },
  ];

  const achievements = [
    { name: 'Safety Champion', description: '30 days without incidents', icon: '🛡️' },
    { name: 'Quality Expert', description: 'Zero defects this month', icon: '⭐' },
    { name: 'Team Player', description: 'Helped 5+ colleagues', icon: '🤝' },
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
                Good morning, {user?.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                You have {todayTasks.length} tasks scheduled for today.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-500">
                {isConnected ? 'Connected' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Tasks Today', value: '3', icon: Calendar, color: 'text-blue-600' },
              { title: 'Completed This Week', value: '12', icon: CheckCircle, color: 'text-green-600' },
              { title: 'Hours Logged', value: '38', icon: Clock, color: 'text-purple-600' },
              { title: 'Safety Score', value: '100%', icon: Tool, color: 'text-orange-600' },
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
            {/* Today's Tasks */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Today's Tasks
                  </CardTitle>
                  <CardDescription>
                    Your assigned tasks for today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todayTasks.map((task, index) => (
                      <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{task.title}</h4>
                            <Badge variant={
                              task.priority === 'high' ? 'destructive' :
                              task.priority === 'medium' ? 'default' : 'secondary'
                            }>
                              {task.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {task.estimatedHours}h
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {task.location}
                            </div>
                          </div>
                        </div>
                        <Button size="sm">
                          Start Task
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Achievements
                  </CardTitle>
                  <CardDescription>
                    Your recent accomplishments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <div key={achievement.name} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{achievement.name}</h4>
                          <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Performance Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance Overview
                </CardTitle>
                <CardDescription>
                  Your work performance metrics this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                    <div className="text-sm text-gray-600">Task Completion Rate</div>
                    <Progress value={95} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">4.8</div>
                    <div className="text-sm text-gray-600">Quality Rating</div>
                    <Progress value={96} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">160</div>
                    <div className="text-sm text-gray-600">Hours This Month</div>
                    <Progress value={80} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}