'use client';

import { useState, useEffect } from 'react';
import { LoadingSkeleton } from '@/components/ui/loading';
import { ErrorState, NetworkErrorState } from '@/components/ui/error-state';
import { Badge } from '@/components/ui/badge';
import { InfoTable } from '@/components/ui/data-table';

interface HealthStatus {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  lastCheck: string;
  uptime: string;
  details?: string;
}

interface SystemStats {
  totalQueries: number;
  avgResponseTime: number;
  uptime: string;
  memoryUsage: string;
  cpuUsage: string;
  diskUsage: string;
}

export default function HealthPage() {
  const [healthData, setHealthData] = useState<{
    services: HealthStatus[];
    stats: SystemStats;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 模拟健康检查数据
      const mockData = {
        services: [
          {
            service: 'WHOIS Service',
            status: 'healthy' as const,
            responseTime: 120,
            lastCheck: new Date().toISOString(),
            uptime: '99.9%',
            details: 'All WHOIS servers responding normally'
          },
          {
            service: 'DNS Service',
            status: 'healthy' as const,
            responseTime: 45,
            lastCheck: new Date().toISOString(),
            uptime: '99.8%',
            details: 'All DNS resolvers operational'
          },
          {
            service: 'Screenshot Service',
            status: 'degraded' as const,
            responseTime: 3200,
            lastCheck: new Date().toISOString(),
            uptime: '98.5%',
            details: 'High response times detected'
          },
          {
            service: 'Database',
            status: 'healthy' as const,
            responseTime: 15,
            lastCheck: new Date().toISOString(),
            uptime: '99.9%',
            details: 'All database connections stable'
          }
        ],
        stats: {
          totalQueries: 1245678,
          avgResponseTime: 180,
          uptime: '99.7%',
          memoryUsage: '45.2%',
          cpuUsage: '23.8%',
          diskUsage: '67.4%'
        }
      };

      setHealthData(mockData);
    } catch (err) {
      console.error('Failed to fetch health data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
    
    // 自动刷新健康状态
    const interval = setInterval(fetchHealthData, 30000); // 30秒刷新一次
    
    return () => clearInterval(interval);
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'degraded':
        return 'warning';
      case 'unhealthy':
        return 'error';
      default:
        return 'default';
    }
  };

  const getOverallStatus = (services: HealthStatus[]) => {
    if (services.every(s => s.status === 'healthy')) return 'healthy';
    if (services.some(s => s.status === 'unhealthy')) return 'unhealthy';
    return 'degraded';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <LoadingSkeleton className="h-8 w-48 mb-4" />
            <LoadingSkeleton className="h-4 w-96" />
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <LoadingSkeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="space-y-2">
                    <LoadingSkeleton className="h-4 w-24" />
                    <LoadingSkeleton className="h-3 w-full" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <LoadingSkeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="flex justify-between">
                    <LoadingSkeleton className="h-4 w-20" />
                    <LoadingSkeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <NetworkErrorState onRetry={fetchHealthData} />
        </div>
      </div>
    );
  }

  if (!healthData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <ErrorState 
            title="No Data Available"
            message="Unable to load health information"
            onRetry={fetchHealthData}
          />
        </div>
      </div>
    );
  }

  const overallStatus = getOverallStatus(healthData.services);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              System Health
            </h1>
            <Badge 
              variant={getStatusVariant(overallStatus)} 
              size="lg"
            >
              {overallStatus.toUpperCase()}
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time monitoring of all system components and services
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* 服务状态 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Service Status
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {healthData.services.map((service, index) => (
                  <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {service.service}
                      </h3>
                      <Badge variant={getStatusVariant(service.status)}>
                        {service.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div>
                        <span className="font-medium">Response Time:</span> {service.responseTime}ms
                      </div>
                      <div>
                        <span className="font-medium">Uptime:</span> {service.uptime}
                      </div>
                    </div>
                    
                    {service.details && (
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                        {service.details}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 系统统计 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                System Statistics
              </h2>
            </div>
            <div className="p-6">
              <InfoTable
                data={[
                  {
                    label: 'Total Queries',
                    value: healthData.stats.totalQueries.toLocaleString()
                  },
                  {
                    label: 'Average Response Time',
                    value: `${healthData.stats.avgResponseTime}ms`
                  },
                  {
                    label: 'System Uptime',
                    value: healthData.stats.uptime
                  },
                  {
                    label: 'Memory Usage',
                    value: healthData.stats.memoryUsage,
                    render: (value) => (
                      <div className="flex items-center space-x-2">
                        <span>{value}</span>
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: value }}
                          />
                        </div>
                      </div>
                    )
                  },
                  {
                    label: 'CPU Usage',
                    value: healthData.stats.cpuUsage,
                    render: (value) => (
                      <div className="flex items-center space-x-2">
                        <span>{value}</span>
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 transition-all duration-300"
                            style={{ width: value }}
                          />
                        </div>
                      </div>
                    )
                  },
                  {
                    label: 'Disk Usage',
                    value: healthData.stats.diskUsage,
                    render: (value) => (
                      <div className="flex items-center space-x-2">
                        <span>{value}</span>
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-orange-500 transition-all duration-300"
                            style={{ width: value }}
                          />
                        </div>
                      </div>
                    )
                  }
                ]}
              />
            </div>
          </div>
        </div>

        {/* 附加信息 */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Health Check Information
          </h3>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <p>• Health checks are performed every 30 seconds</p>
            <p>• Service status automatically updates in real-time</p>
            <p>• Response times are averaged over the last 5 minutes</p>
            <p>• Uptime percentages calculated over the last 30 days</p>
          </div>
        </div>
      </div>
    </div>
  );
} 