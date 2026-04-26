import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../api/axios";

// Extremely fast in-memory Javascript cache object so switching 
// back to a stock chart timeframe you already opened is literally 0ms delay.
const chartCache = {};

const PERIODS = [
  { label: "1W", value: "1wk" },
  { label: "1M", value: "1mo" },
  { label: "1Y", value: "1y" },
  { label: "3Y", value: "3y" },
  { label: "5Y", value: "5y" },
];

function TradingViewChart({ symbol, onClose }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("1mo");

  useEffect(() => {
    if (!symbol) return;
    
    // Composite Cache Key binds the symbol mathematically to the timeline choice
    const cacheKey = `${symbol}-${period}`;

    // 1. Check our lightning-fast memory cache to save network calls
    if (chartCache[cacheKey]) {
      setData(chartCache[cacheKey]);
      setLoading(false);
      return;
    }

    // 2. Fetch natively from our own Python backend dynamically
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/stocks/${symbol}/chart?period=${period}`);
        chartCache[cacheKey] = res.data.data;
        setData(res.data.data);
      } catch (err) {
        console.error("Failed to fetch native chart data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [symbol, period]);

  // Determine green or red coloring based on strictly trailing performance
  const isUp = data.length > 1 && data[data.length - 1].price >= data[0].price;
  const strokeColor = isUp ? "#10b981" : "#ef4444"; // Emerald (green) or Red
  const fillColor = isUp ? "#10b981" : "#ef4444";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-start mb-6">
        <div>
           <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{symbol}</h3>
           
           {/* Timeline Controls */}
           <div className="flex gap-2 mt-3 p-1 bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 inline-flex">
             {PERIODS.map((p) => (
               <button
                 key={p.value}
                 onClick={() => setPeriod(p.value)}
                 className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                   period === p.value 
                     ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200 dark:border-gray-600' 
                     : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                 }`}
               >
                 {p.label}
               </button>
             ))}
           </div>
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-red-600 bg-gray-50 dark:bg-gray-700/50 hover:bg-red-50 dark:hover:bg-red-900/30 w-8 h-8 rounded-full flex justify-center items-center transition-all"
        >
          ✕
        </button>
      </div>

      <div style={{ width: "100%", height: 350 }}>
        {loading ? (
          <div className="w-full h-full flex justify-center items-center text-gray-400 font-medium">Fetching Timeline Data...</div>
        ) : data.length === 0 ? (
          <div className="w-full h-full flex justify-center items-center text-gray-400 font-medium">No historical data available.</div>
        ) : (
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${symbol}-${period}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={fillColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={fillColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide={true} />
              <YAxis 
                domain={['auto', 'auto']} 
                hide={false}
                tickFormatter={(value) => `₹${value}`}
                axisLine={false}
                tickLine={false}
                tick={{fill: "#9ca3af", fontSize: 12, fontWeight: "500"}}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', background: 'rgba(255, 255, 255, 0.95)' }}
                itemStyle={{ color: '#111827', fontWeight: '800' }}
                formatter={(value) => [`₹${value}`, "Close Price"]}
                labelStyle={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase', fontWeight: "bold" }}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={strokeColor} 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill={`url(#gradient-${symbol}-${period})`} 
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default TradingViewChart;
