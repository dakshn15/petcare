import React from 'react';

/**
 * A branded full-page / inline loading spinner with animated paw prints.
 *
 * Props:
 *  - message  (string)  – text shown below the spinner (default: "Loading…")
 *  - fullPage (boolean) – if true, takes min-h-screen and centres itself
 *  - compact  (boolean) – if true, renders a smaller inline variant (for sections)
 */
export default function PageLoader({ message = 'Loading…', fullPage = true, compact = false }) {
  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="page-loader-spinner" />
        <p className="text-sm font-medium text-gray-400 animate-pulse">{message}</p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center bg-gray-50 gap-5 ${
        fullPage ? 'min-h-screen' : 'py-24'
      }`}
    >
      {/* Animated paw icon ring */}
      <div className="page-loader-wrapper">
        <div className="page-loader-ring" />
        <i className="fas fa-paw page-loader-paw" />
      </div>

      {/* Loading text */}
      <p className="text-sm font-semibold tracking-wide text-gray-500 uppercase animate-pulse">
        {message}
      </p>
    </div>
  );
}
