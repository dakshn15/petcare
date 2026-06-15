import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  const pawPrints = [
    { top: '10%', left: '10%', rotation: '15deg', size: 'text-2xl' },
    { top: '20%', right: '15%', rotation: '-10deg', size: 'text-3xl' },
    { bottom: '15%', left: '20%', rotation: '25deg', size: 'text-4xl' },
    { bottom: '25%', right: '10%', rotation: '-20deg', size: 'text-3xl' },
    { top: '40%', left: '30%', rotation: '5deg', size: 'text-2xl' },
    { top: '60%', right: '25%', rotation: '-15deg', size: 'text-4xl' },
    { top: '70%', left: '15%', rotation: '10deg', size: 'text-6xl' },
    { top: '30%', right: '20%', rotation: '-5deg', size: 'text-5xl' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Paw print background decorations */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {pawPrints.map((paw, i) => (
          <div
            key={i}
            className={`absolute text-primary opacity-10 ${paw.size}`}
            style={{
              top: paw.top,
              bottom: paw.bottom,
              left: paw.left,
              right: paw.right,
              transform: `rotate(${paw.rotation})`,
              animation: 'float 3s ease-in-out infinite',
              animationDelay: `${i * 0.3}s`
            }}
          >
            🐾
          </div>
        ))}
      </div>

      <div className="max-w-lg w-full text-center relative z-10 animate-fade-in">
        {/* Error message */}
        <div>
          <h2 className="text-7xl md:text-9xl mb-4 font-bold font-quicksand text-primary drop-shadow-md">404</h2>
          <h3 className="md:text-4xl sm:text-3xl text-2xl mb-4 font-bold font-quicksand text-dark">
            Oops! Page Not Found
          </h3>
          <p className="text-gray-600 lg:mb-8 mb-5 lg:text-lg leading-relaxed">
            Looks like this page has gone for a walk. Our furry friend is still searching for it!
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-dark hover:scale-105 transition-all duration-300 shadow-md text-sm"
            >
              <i className="fas fa-home"></i>
              Back to Home
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-full font-semibold hover:bg-dark hover:scale-105 transition-all duration-300 shadow-md text-sm"
            >
              <i className="fas fa-envelope"></i>
              Contact Support
            </Link>
          </div>
        </div>

        {/* Additional help links */}
        <div className="lg:mt-8 mt-6 bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">
            Need help finding something? Try our{' '}
            <Link to="/services" className="text-primary hover:underline font-semibold">
              services page
            </Link>{' '}
            or{' '}
            <Link to="/faq" className="text-primary hover:underline font-semibold">
              FAQ section
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
