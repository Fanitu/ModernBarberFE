import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell
} from 'recharts';

const AnalyticsChart = ({ data = [], type = 'line', detailed = false, title = 'Analytics' }) => {
  const [chartData, setChartData] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  // Generate default data if none provided
  useEffect(() => {
    const generatedData = data.length > 0 ? data : generateDefaultData(type);
    setChartData(generatedData);
  }, [data, type]);

  // Get container dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // If container has no dimensions yet, show loading
  if (dimensions.width === 0 || dimensions.height === 0) {
    return (
      <div 
        ref={containerRef}
        className="chart-container loading"
        style={{ height: '300px' }}
      >
        <div className="chart-loading">
          <div className="loading-spinner"></div>
          <p>Loading chart...</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-item">
              <span 
                className="tooltip-color" 
                style={{ backgroundColor: entry.color }}
              ></span>
              <span className="tooltip-key">{entry.name}: </span>
              <span className="tooltip-value">
                {typeof entry.value === 'number' 
                  ? entry.value.toLocaleString() 
                  : entry.value}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    const colors = {
      primary: '#4F46E5',
      secondary: '#10B981',
      accent: '#F59E0B',
      danger: '#EF4444'
    };

    switch (type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#6B7280" 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#6B7280" 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }} />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
              iconSize={8}
            />
            <Bar 
              dataKey="value" 
              name="Bookings"
              fill={colors.primary}
              radius={[8, 8, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors.primary} opacity={0.8} />
              ))}
            </Bar>
            {detailed && (
              <Bar 
                dataKey="revenue" 
                name="Revenue ($)"
                fill={colors.secondary}
                radius={[8, 8, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-rev-${index}`} fill={colors.secondary} opacity={0.8} />
                ))}
              </Bar>
            )}
          </BarChart>
        );
      
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#6B7280" 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#6B7280" 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
              iconSize={8}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              name="Bookings"
              stroke={colors.primary}
              fill={colors.primary}
              fillOpacity={0.3}
              strokeWidth={3}
              dot={{ 
                stroke: colors.primary, 
                strokeWidth: 2, 
                r: 4,
                fill: 'white'
              }}
            />
          </AreaChart>
        );
      
      default: // line chart
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#6B7280" 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#6B7280" 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
              iconSize={8}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              name="Bookings"
              stroke={colors.primary}
              strokeWidth={3}
              dot={{ 
                stroke: colors.primary, 
                strokeWidth: 2, 
                r: 4,
                fill: 'white'
              }}
              activeDot={{ 
                r: 8, 
                strokeWidth: 2,
                stroke: 'white',
                fill: colors.primary
              }}
            />
            {detailed && (
              <Line 
                type="monotone" 
                dataKey="revenue" 
                name="Revenue ($)"
                stroke={colors.secondary}
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ 
                  stroke: colors.secondary, 
                  strokeWidth: 2, 
                  r: 4,
                  fill: 'white'
                }}
              />
            )}
          </LineChart>
        );
    }
  };

  return (
    <div ref={containerRef} className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        {detailed && <div className="chart-subtitle">Bookings vs Revenue</div>}
      </div>
      <div className="chart-wrapper" style={{ height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Helper function to generate default chart data
const generateDefaultData = (type) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  let labels = [];
  
  switch (type) {
    case 'weekly':
      labels = weeks;
      break;
    case 'monthly':
      labels = months.slice(0, 6);
      break;
    default: // daily
      labels = days;
  }
  
  return labels.map((label, index) => ({
    name: label,
    value: Math.floor(Math.random() * 80) + 20,
    revenue: Math.floor(Math.random() * 4000) + 1000
  }));
};

export default AnalyticsChart;