import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

function Sparkline({ data }) {
  if (!data || data.length < 2) {
    return <div className="w-24 h-10 flex items-center justify-center text-xs text-gray-400">---</div>;
  }

  const first = data[0];
  const last = data[data.length - 1];
  const isPositive = last >= first;
  
  // emerald-500 matches positive trends, rose-500 for negative
  const strokeColor = isPositive ? "#10B981" : "#F43F5E"; 

  // Format data for Recharts
  const chartData = data.map((val, i) => ({ value: val, index: i }));

  // Dynamic YAxis scaling to ensure the line doesn't get clipped flat
  const min = Math.min(...data);
  const max = Math.max(...data);
  const padding = (max - min) * 0.1 || (min * 0.05); // Give flatlines fake padding

  return (
    <div className="w-24 h-12 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={chartData}>
          <YAxis domain={[min - padding, max + padding]} hide={true} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={strokeColor} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={true}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Sparkline;
