import { useEffect, useRef } from "react";

function TradingViewChart({ symbol, onClose }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!symbol) return;

    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => {
      new window.TradingView.widget({
        width: "100%",
        height: 400,
        symbol: `NSE:${symbol}`,
        interval: "D",
        timezone: "Asia/Kolkata",
        theme: "light",
        style: "1",
        locale: "en",
        hide_top_toolbar: true,
        enable_publishing: false,
        container_id: containerRef.current.id,
      });
    };

    containerRef.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-4 mt-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{symbol} Chart</h3>

        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:text-red-600"
        >
          ✕
        </button>
      </div>

      <div id={`tv-chart-${symbol}`} ref={containerRef} />
    </div>
  );
}

export default TradingViewChart;
