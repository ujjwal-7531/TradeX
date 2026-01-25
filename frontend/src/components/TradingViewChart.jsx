import { useEffect } from "react";

function TradingViewChart({ symbol, onClose }) {
  useEffect(() => {
    if (!symbol) return;

    const containerId = "tradingview_container";

    document.getElementById(containerId).innerHTML = "";

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
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        hide_top_toolbar: true,
        container_id: containerId,
      });
    };

    document.body.appendChild(script);
  }, [symbol]);

  return (
    <div className="bg-white rounded shadow p-4 mt-6 relative">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">
          {symbol} Chart
        </h3>

        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 text-sm"
        >
          ✕
        </button>
      </div>

      <div id="tradingview_container" />
    </div>
  );

}

export default TradingViewChart;
