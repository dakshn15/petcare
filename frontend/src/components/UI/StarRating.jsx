import React, { useState } from 'react';

export default function StarRating({ rating = 0, onChange = null, interactive = false }) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (index) => {
    if (interactive && onChange) {
      onChange(index);
    }
  };

  const handleStarHover = (index) => {
    if (interactive) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex gap-1" onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const isActive = hoverRating > 0 ? starIndex <= hoverRating : starIndex <= rating;
        return (
          <button
            key={starIndex}
            type="button"
            disabled={!interactive}
            onClick={() => handleStarClick(starIndex)}
            onMouseEnter={() => handleStarHover(starIndex)}
            className={`transition duration-150 text-xl focus:outline-none ${
              interactive ? 'cursor-pointer' : 'pointer-events-none'
            } ${isActive ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            <i className="fas fa-star"></i>
          </button>
        );
      })}
    </div>
  );
}
