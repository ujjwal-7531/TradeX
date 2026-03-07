import React from 'react';

// Reusable animated pulse skeleton base
export const SkeletonBase = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700/50 rounded-xl ${className}`}></div>
);

// Skeleton for a single StatCard in PortfolioSummary
export const StatCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 h-[104px] flex flex-col justify-center gap-3">
    <SkeletonBase className="h-4 w-24" />
    <SkeletonBase className="h-8 w-32" />
  </div>
);

// Skeleton for the PortfolioAnalytics section 
export const PortfolioAnalyticsSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 w-full my-8 flex flex-col md:flex-row gap-6 items-center min-h-[354px]">
    {/* Chart Skeleton */}
    <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
      <SkeletonBase className="h-6 w-40 mb-6 self-start" />
      <SkeletonBase className="w-48 h-48 rounded-full" />
    </div>

    {/* Legend Skeleton */}
    <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SkeletonBase className="w-3 h-3 rounded-full" />
            <div>
              <SkeletonBase className="h-5 w-20 mb-2" />
              <SkeletonBase className="h-3 w-32" />
            </div>
          </div>
          <div className="flex flex-col items-end">
            <SkeletonBase className="h-5 w-12 mb-2" />
            <SkeletonBase className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Skeleton for the Transactions Table
export const TransactionsTableSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden w-full border border-gray-100 dark:border-gray-700 min-h-[400px]">
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse text-left whitespace-nowrap">
        <thead className="bg-gray-50/80 dark:bg-gray-800/80 text-left border-b border-gray-100 dark:border-gray-700">
          <tr>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <th key={i} className="px-6 py-4">
                <SkeletonBase className="h-3 w-16" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
            <tr key={row}>
              <td className="px-6 py-4"><SkeletonBase className="h-6 w-16 rounded-full" /></td>
              <td className="px-6 py-4"><SkeletonBase className="h-5 w-20" /></td>
              <td className="px-6 py-4 text-right flex justify-end"><SkeletonBase className="h-5 w-12" /></td>
              <td className="px-6 py-4 text-right"><SkeletonBase className="h-5 w-24 ml-auto" /></td>
              <td className="px-6 py-4 text-right"><SkeletonBase className="h-5 w-24 ml-auto" /></td>
              <td className="px-6 py-4 text-right"><SkeletonBase className="h-4 w-32 ml-auto" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Skeleton for the Holdings Table
export const HoldingsTableSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mt-6 overflow-visible w-full min-h-[300px] mb-32">
    <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
      <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Your Holdings</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse text-left whitespace-nowrap">
        <thead className="bg-gray-50/80 dark:bg-gray-800/80 text-left border-b border-gray-100 dark:border-gray-700">
          <tr>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <th key={i} className="px-6 py-4">
                <SkeletonBase className="h-3 w-12" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
          {[1, 2, 3, 4, 5].map((row) => (
            <tr key={row}>
              <td className="px-6 py-4"><SkeletonBase className="h-5 w-16" /></td>
              <td className="px-6 py-4"><SkeletonBase className="h-5 w-10" /></td>
              <td className="px-6 py-4 text-right flex justify-end"><SkeletonBase className="h-5 w-16" /></td>
              <td className="px-6 py-4 text-right"><SkeletonBase className="h-5 w-16 ml-auto" /></td>
              <td className="px-6 py-4 text-right"><SkeletonBase className="h-5 w-20 ml-auto" /></td>
              <td className="px-6 py-4 text-right"><SkeletonBase className="h-5 w-24 ml-auto" /></td>
              <td className="px-6 py-4 text-right flex justify-end"><SkeletonBase className="h-6 w-20 rounded-md" /></td>
              <td className="px-6 py-4 text-center"><SkeletonBase className="h-8 w-24 mx-auto" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Skeleton for the Watchlist Table
export const WatchlistTableSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-visible mt-2">
    <table className="w-full">
      <thead className="bg-gray-50/80 dark:bg-gray-800/80 text-left border-b border-gray-100 dark:border-gray-700">
        <tr>
          {[1, 2, 3, 4, 5].map((i) => (
            <th key={i} className="px-6 py-4">
              <SkeletonBase className="h-3 w-16" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
        {[1, 2, 3, 4, 5].map((row) => (
          <tr key={row}>
            <td className="px-6 py-4"><SkeletonBase className="h-5 w-16" /></td>
            <td className="px-6 py-4"><SkeletonBase className="h-5 w-32" /></td>
            <td className="px-6 py-4 text-right"><SkeletonBase className="h-5 w-20 ml-auto" /></td>
            <td className="px-6 py-4 flex justify-center"><SkeletonBase className="h-8 w-24" /></td>
            <td className="px-6 py-4 text-right"><SkeletonBase className="h-6 w-8 ml-auto rounded" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
