import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCards = ({ stats }) => {
  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="stat-card-header">
            <div className={`stat-icon ${stat.color}`}>
              {stat.icon}
            </div>
            {stat.change && (
              <span className={`stat-trend ${stat.trend}`}>
                {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {stat.change}
              </span>
            )}
          </div>
          
          <div>
            <p className="stat-title">{stat.title}</p>
            <p className="stat-value">{stat.value}</p>
            {stat.description && (
              <p className="stat-description">{stat.description}</p>
            )}
          </div>
          
          {stat.footer && (
            <div className="stat-footer">
              <p className="stat-footer-text">{stat.footer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsCards;