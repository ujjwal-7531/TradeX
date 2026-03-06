import React, { useEffect, useRef, memo } from 'react';

function StockHeatmap({ isDark }) {
  const container = useRef();

  useEffect(
    () => {
      // Set the container innerHTML directly to make sure we don't duplicate on theme toggle
      container.current.innerHTML = `
        <div class="tradingview-widget-container__widget" style="height: calc(100% - 32px); width: 100%;"></div>
        <div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/heatmap/stock/" rel="noopener nofollow" target="_blank"><span class="blue-text" style="color: #2962FF;">Stock Heatmap</span></a><span class="trademark" style="color: #9db2bd;"> by TradingView</span></div>
      `;

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "dataSource": "SENSEX",
          "blockSize": "market_cap_basic",
          "blockColor": "change",
          "grouping": "sector",
          "locale": "en",
          "symbolUrl": "",
          "colorTheme": "${isDark ? 'dark' : 'light'}",
          "exchanges": [],
          "hasTopBar": false,
          "isDataSetEnabled": false,
          "isZoomEnabled": true,
          "hasSymbolTooltip": true,
          "isMonoSize": false,
          "width": "100%",
          "height": "100%"
        }`;
      container.current.appendChild(script);
    },
    [isDark] // Re-render widget when theme changes
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mt-6 mb-6 w-full h-[600px] flex flex-col transition-colors">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Indian Stock Heatmap</h3>
      <div className="tradingview-widget-container flex-1 w-full" ref={container}>
      </div>
    </div>
  );
}

export default memo(StockHeatmap);
