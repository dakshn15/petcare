import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 animate-pulse flex flex-col justify-between h-[300px]">
    <div>
      <div className="w-14 h-14 bg-gray-200 rounded-full mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
    </div>
    <div className="flex justify-between items-center mt-4">
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      <div className="h-10 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

export const PetCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 animate-pulse h-[380px]">
    <div className="h-48 bg-gray-200 w-full"></div>
    <div className="p-5">
      <div className="h-6 bg-gray-200 rounded w-2/3 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
);

export const RowSkeleton = ({ cols = 5 }) => (
  <tr className="animate-pulse border-b border-gray-100">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </td>
    ))}
  </tr>
);
