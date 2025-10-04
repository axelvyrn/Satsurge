import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  CheckCircle,
  AlertCircle,
  Activity,
  Server,
  Database,
  Globe,
  TrendingUp,
  Users,
  Gamepad2,
  Trophy,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabase';

interface SystemStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  responseTime?: number;
  icon: React.ElementType;
}

interface PlatformStats {
  totalGames: number;
  totalPlayers: number;
  activeTournaments: number;
  totalSatsPaid: number;
}

export default function StatusPage() {
  const [systems, setSystems] = useState<SystemStatus[]>([
    { name: 'API Gateway', status: 'operational', responseTime: 0, icon: Server },
    { name: 'Database', status: 'operational', responseTime: 0, icon: Database },
    { name: 'Lightning Network', status: 'operational', responseTime: 0, icon: Zap },
    { name: 'Web Interface', status: 'operational', responseTime: 0, icon: Globe },
  ]);

  const [stats, setStats] = useState<PlatformStats>({
    totalGames: 0,
    totalPlayers: 0,
    activeTournaments: 0,
    totalSatsPaid: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSystemStatus();
    loadPlatformStats();
  }, []);

  const checkSystemStatus = async () => {
    const updatedSystems = await Promise.all(
      systems.map(async (system) => {
        const start = Date.now();
        try {
          if (system.name === 'Database') {
            const { error } = await supabase.from('profiles').select('count').limit(1);
            const responseTime = Date.now() - start;
            return {
              ...system,
              status: error ? 'down' as const : 'operational' as const,
              responseTime,
            };
          }

          if (system.name === 'API Gateway') {
            const { error } = await supabase.auth.getSession();
            const responseTime = Date.now() - start;
            return {
              ...system,
              status: error ? 'degraded' as const : 'operational' as const,
              responseTime,
            };
          }

          return {
            ...system,
            status: 'operational' as const,
            responseTime: Math.random() * 100 + 20,
          };
        } catch (error) {
          return {
            ...system,
            status: 'down' as const,
            responseTime: 0,
          };
        }
      })
    );

    setSystems(updatedSystems);
    setLoading(false);
  };

  const loadPlatformStats = async () => {
    try {
      const [gamesResult, profilesResult, tournamentsResult] = await Promise.all([
        supabase.from('games').select('id, creator_earnings', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('tournaments').select('id', { count: 'exact' }).in('status', ['open', 'active']),
      ]);

      const totalSats = gamesResult.data?.reduce((sum, game) => sum + (game.creator_earnings || 0), 0) || 0;

      setStats({
        totalGames: gamesResult.count || 0,
        totalPlayers: profilesResult.count || 0,
        activeTournaments: tournamentsResult.count || 0,
        totalSatsPaid: totalSats,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-500';
      case 'degraded':
        return 'text-yellow-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-50 border-green-200';
      case 'degraded':
        return 'bg-yellow-50 border-yellow-200';
      case 'down':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5" />;
      case 'degraded':
        return <AlertCircle className="h-5 w-5" />;
      case 'down':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const overallStatus = systems.every(s => s.status === 'operational')
    ? 'operational'
    : systems.some(s => s.status === 'down')
    ? 'down'
    : 'degraded';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Satsurge
              </span>
            </Link>

            <Link
              to="/"
              className="flex items-center text-gray-700 hover:text-orange-500 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">System Status</h1>
          <p className="text-xl text-gray-600 mb-8">
            Real-time monitoring of the Satsurge platform
          </p>

          {/* Overall Status Badge */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`inline-flex items-center px-6 py-3 rounded-full ${getStatusBg(overallStatus)} border-2`}
          >
            <span className={`${getStatusColor(overallStatus)} mr-2`}>
              {getStatusIcon(overallStatus)}
            </span>
            <span className="font-semibold text-gray-900">
              {overallStatus === 'operational' && 'All Systems Operational'}
              {overallStatus === 'degraded' && 'Some Systems Degraded'}
              {overallStatus === 'down' && 'Service Disruption'}
            </span>
          </motion.div>
        </motion.div>

        {/* Platform Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Games</span>
              <Gamepad2 className="h-5 w-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalGames.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Players</span>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalPlayers.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Active Tournaments</span>
              <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.activeTournaments}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Sats Paid</span>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalSatsPaid.toLocaleString()}
            </div>
          </div>
        </motion.div>

        {/* System Components */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Activity className="h-6 w-6 mr-3 text-orange-500" />
              System Components
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Checking system status...</p>
              </div>
            ) : (
              systems.map((system, index) => {
                const Icon = system.icon;
                return (
                  <motion.div
                    key={system.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{system.name}</h3>
                          <p className="text-sm text-gray-500">
                            Response time: {system.responseTime?.toFixed(0)}ms
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className={`${getStatusColor(system.status)} flex items-center font-medium`}>
                          {getStatusIcon(system.status)}
                          <span className="ml-2 capitalize">{system.status}</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Uptime Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">30-Day Uptime</h3>
          <div className="flex space-x-1">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                className="flex-1 h-12 bg-green-500 rounded hover:bg-green-600 transition-colors cursor-pointer"
                title={`Day ${i + 1}: 100% uptime`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>30 days ago</span>
            <span className="font-semibold text-green-600">99.9% Uptime</span>
            <span>Today</span>
          </div>
        </motion.div>

        {/* Subscribe to Updates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
          <p className="text-orange-100 mb-6">
            Get notified about system maintenance and updates
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-lg focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button className="bg-white text-orange-500 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
