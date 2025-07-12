'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Shield, 
  Users, 
  BarChart, 
  Globe, 
  Smartphone, 
  Wifi, 
  Award,
  CheckCircle2,
  Star 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      const roleRedirects = {
        admin: '/dashboard/admin',
        manager: '/dashboard/manager',
        worker: '/dashboard/worker',
        client: '/dashboard/client',
      };
      router.push(roleRedirects[user.role as keyof typeof roleRedirects] || '/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const features = [
    {
      icon: Shield,
      title: 'Role-Based Access Control',
      description: 'Secure authentication with granular permissions for admins, managers, workers, and clients.',
      color: 'text-blue-600',
    },
    {
      icon: Users,
      title: 'Project Management',
      description: 'Comprehensive project tracking with real-time updates and collaboration tools.',
      color: 'text-green-600',
    },
    {
      icon: BarChart,
      title: 'ESG Metrics',
      description: 'Track environmental, social, and governance metrics for sustainable construction.',
      color: 'text-purple-600',
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Available in English, Swahili, French, Kinyarwanda, and Luganda.',
      color: 'text-orange-600',
    },
    {
      icon: Smartphone,
      title: 'Progressive Web App',
      description: 'Install on any device with native app-like experience and offline capabilities.',
      color: 'text-pink-600',
    },
    {
      icon: Wifi,
      title: 'Real-Time Updates',
      description: 'Instant notifications and live collaboration with Socket.io integration.',
      color: 'text-indigo-600',
    },
  ];

  const benefits = [
    'Streamlined project management workflow',
    'Real-time communication and updates',
    'Comprehensive inventory tracking',
    'Financial transaction management',
    'ESG compliance monitoring',
    'Multi-language accessibility',
    'Offline-first architecture',
    'Gamification and engagement features',
  ];

  const stats = [
    { label: 'Projects Managed', value: '500+', icon: Shield },
    { label: 'Team Members', value: '1,200+', icon: Users },
    { label: 'Countries Served', value: '12+', icon: Globe },
    { label: 'Languages Supported', value: '5', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                P
              </div>
              <span className="font-bold text-xl text-gray-800">PCS-B-LTD</span>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/auth/login')}
                className="hidden sm:inline-flex"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => router.push('/auth/register')}
                className="flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-6 bg-blue-100 text-blue-800 border-blue-200">
                🚀 Now Available as PWA
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
                Professional
                <span className="text-primary"> Construction</span>
                <br />
                Management
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Streamline your construction projects with our comprehensive management platform. 
                Real-time updates, multi-language support, and offline capabilities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => router.push('/auth/register')}
                  className="text-lg px-8 py-6"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => router.push('/auth/login')}
                  className="text-lg px-8 py-6"
                >
                  Sign In
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Construction Projects
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From project planning to completion, our platform provides all the tools 
              you need for successful construction management.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose PCS-B-LTD?
              </h2>
              <p className="text-xl text-gray-600">
                Experience the benefits of modern construction management
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 p-4 bg-green-50 rounded-lg"
                >
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span className="text-gray-800">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Construction Management?
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Join thousands of construction professionals who trust PCS-B-LTD 
              to manage their projects efficiently and effectively.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => router.push('/auth/register')}
                className="text-lg px-8 py-6"
              >
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => router.push('/auth/login')}
                className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary"
              >
                Sign In Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                P
              </div>
              <span className="font-bold text-xl">PCS-B-LTD</span>
            </div>
            <p className="text-gray-400 mb-4">
              Professional Construction Services Management Platform
            </p>
            <div className="flex justify-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-400">
              © 2024 PCS-B-LTD. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}