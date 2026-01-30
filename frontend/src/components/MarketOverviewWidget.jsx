import { useEffect, useRef } from "react";

function MarketOverviewWidget({ isDark }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Clear the container before appending
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.async = true;
    script.type = "text/javascript";

    // Customize your market tabs here (NSE, Indices, etc.)
    script.innerHTML = JSON.stringify({
      "colorTheme": isDark ? "dark" : "light",
      "dateRange": "12M",
      "showChart": true,
      "locale": "en",
      "width": "100%",
      "height": 450,
      "largeChartHeight": 312,
      "isTransparent": false,
      "showSymbolLogo": true,
      "tabs": [
        {
          "title": "Indices",
          "symbols": [
            { "s": "INDEX:SENSEX", "d": "Sensex" },
            { "s": "NSE:NIFTY", "d": "Nifty 50" },
            { "s": "NSE:BANKNIFTY", "d": "Bank Nifty" }
            
          ]
        },
        {
          "title": "Top Stocks",
          "symbols": [
            { "s": "NSE:RELIANCE" },
            { "s": "NSE:HDFCBANK" },
            { "s": "NSE:TCS" },
            { "s": "NSE:INFY" }
          ]
        }
      ]
    });

    containerRef.current.appendChild(script);
  }, [isDark]); // Re-renders if you toggle theme

  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-4 mt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Market Overview
      </h3>
      <div className="tradingview-widget-container" ref={containerRef}>
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
}

export default MarketOverviewWidget;