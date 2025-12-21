import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { adminAPI } from '../apiServece/apiService.jsx';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

const RevenueChart = ({ data = [], detailed = false, timeRange = 'monthly' }) => {
  const [chartData, setChartData] = useState(data);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const colors = [
    '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B',
    '#EC4899', '#EF4444', '#6366F1', '#14B8A6'
  ];

  useEffect(() => {
    if (data.length === 0) {
      fetchRevenueData();
    } else {
      setChartData(data);
    }
  }, [timeRange]);

  const fetchRevenueData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await adminAPI.getRevenueStats({ 
        period: timeRange 
      });
      
      if (response.data && response.data.success) {
        const formattedData = response.data.data.revenueStats.map(item => ({
          name: formatLabel(item._id, timeRange),
          revenue: item.revenue,
          profit: item.revenue * 0.4, // 40% profit margin estimate
          bookings: item.bookings,
          avgTicket: item.averageOrderValue
        }));
        setChartData(formattedData);
      }
    } catch (err) {
      console.error('Failed to fetch revenue data:', err);
      setError('Failed to load revenue data');
      setChartData(generateFallbackData());
    } finally {
      setIsLoading(false);
    }
  };

  const formatLabel = (id, period) => {
    switch(period) {
      case 'daily':
        return new Date(id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'weekly':
        return `Week ${id.split('-')[1]}`;
      default:
        const [year, month] = id.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[parseInt(month) - 1]}`;
    }
  };

  const generateFallbackData = () => {
    const periods = timeRange === 'daily' ? 7 : timeRange === 'weekly' ? 4 : 6;
    const labels = timeRange === 'daily' 
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : timeRange === 'weekly'
      ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    return labels.slice(0, periods).map(label => ({
      name: label,
      revenue: Math.floor(Math.random() * 50000) + 10000,
      profit: Math.floor(Math.random() * 20000) + 5000
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataItem = chartData.find(item => item.name === label);
      
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm p-4 shadow-xl rounded-lg border border-gray-800">
          <p className="font-semibold text-white mb-2">{label}</p>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-gray-300">{entry.name}</span>
                </div>
                <span className="font-medium text-white">
                  ${entry.value?.toLocaleString()}
                </span>
              </div>
            ))}
            {dataItem?.bookings && (
              <div className="pt-2 mt-2 border-t border-gray-800">
                <p className="text-sm text-gray-400">
                  {dataItem.bookings} bookings • ${dataItem.avgTicket?.toFixed(0) || '0'} avg
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const calculateGrowth = () => {
    if (chartData.length < 2) return 0;
    const last = chartData[chartData.length - 1].revenue;
    const prev = chartData[chartData.length - 2].revenue;
    return prev > 0 ? ((last - prev) / prev * 100).toFixed(1) : 0;
  };

  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const growth = calculateGrowth();

  if (isLoading) {
    return (
      <div className="w-full h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading revenue data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-gray-600">
              Total: <span className="font-bold text-gray-900">${totalRevenue.toLocaleString()}</span>
            </p>
            <div className={`flex items-center text-sm ${growth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {growth >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span className="ml-1 font-medium">{growth >= 0 ? '+' : ''}{growth}%</span>
              <span className="text-gray-500 ml-1">vs previous</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchRevenueData}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw size={18} />
          </button>
          {error && (
            <p className="text-sm text-rose-600 bg-rose-50 px-3 py-1 rounded-lg">
              Using demo data
            </p>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-80 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#f3f4f6" 
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '14px' }}
            />
            <Bar 
              dataKey="revenue" 
              name="Revenue"
              radius={[6, 6, 0, 0]}
              maxBarSize={60}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                  opacity={0.9}
                />
              ))}
            </Bar>
            
            {detailed && (
              <Bar 
                dataKey="profit" 
                name="Profit"
                radius={[6, 6, 0, 0]}
                fill="#10B981"
                opacity={0.9}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Period Selector */}
      <div className="flex justify-center mt-6">
        <div className="inline-flex bg-gray-100 rounded-lg p-1">
          {['monthly', 'weekly', 'daily'].map((period) => (
            <button
              key={period}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                timeRange === period 
                  ? 'bg-white text-purple-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => window.dispatchEvent(new CustomEvent('periodChange', { detail: period }))}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;