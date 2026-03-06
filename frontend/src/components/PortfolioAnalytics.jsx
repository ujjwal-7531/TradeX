import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

// A curated list of premium financial UI colors for the donut slices
const COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#EF4444', // Red
  '#14B8A6', // Teal
  '#6366F1', // Indigo
  '#F97316'  // Orange
];

// Custom tooltip renderer for a sleek dark/light mode appearance
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-4 rounded-xl shadow-xl">
        <p className="font-bold text-gray-800 dark:text-white mb-1">
          {data.symbol} ({data.name})
        </p>
        <div className="space-y-1 text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">Allocation:</span> {data.percentage}%
          </p>
          <p className="text-gray-600 dark:text-gray-400 font-mono">
            <span className="font-medium font-sans">Current Value:</span> ₹{data.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-gray-600 dark:text-gray-400 font-mono">
            <span className="font-medium font-sans">Quantity:</span> {data.quantity} shares
          </p>
        </div>
      </div>
    );
  }
  return null;
};

function PortfolioAnalytics({ holdings }) {
  // Process the raw holdings data into a format Recharts can use,
  // sorted from largest holding to smallest.
  const chartData = useMemo(() => {
    if (!holdings || holdings.length === 0) return [];

    const totalValue = holdings.reduce((sum, h) => sum + h.current_value, 0);

    return holdings
      .filter((h) => h.current_value > 0) // Filter out 0 value bugs
      .map((h) => ({
        symbol: h.symbol,
        name: h.name,
        value: h.current_value,
        quantity: h.quantity,
        percentage: ((h.current_value / totalValue) * 100).toFixed(1),
      }))
      .sort((a, b) => b.value - a.value); // Largest slice first
  }, [holdings]);

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow border border-gray-100 dark:border-gray-700 w-full my-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Portfolio Allocation</h3>
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <div className="text-4xl mb-3">🍩</div>
          <p>No holdings to analyze yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-700 w-full my-8 flex flex-col md:flex-row gap-6 items-center">
      {/* Chart Section */}
      <div className="w-full md:w-1/2 h-72">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Asset Allocation</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70} // This makes it a donut instead of a pie
              outerRadius={100}
              paddingAngle={3} // Gap between slices
              dataKey="value"
              stroke="none" // Removes the harsh white borders between slices
              animationBegin={0}
              animationDuration={1500}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend / Breakdown Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <div className="space-y-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
          {chartData.map((item, index) => (
            <div key={item.symbol} className="flex items-center justify-between group p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <div>
                  <p className="font-bold text-gray-800 dark:text-white leading-tight">{item.symbol}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px] sm:max-w-[200px]">{item.name}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-gray-800 dark:text-white">{item.percentage}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">₹{item.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PortfolioAnalytics;
