import React, { useState } from 'react';

export default function Accordion({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border overflow-hidden group">
      <div
        onClick={toggleAccordion}
        className="faq-toggle lg:p-5 p-4 cursor-pointer flex justify-between items-center gap-3 select-none"
      >
        <h3 className="flex-1 md:text-lg text-base font-medium text-dark group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
          <i
            style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
            className="fas fa-plus faq-icon text-primary transition-transform duration-300"
          ></i>
        </div>
      </div>
      
      {/* Accordion Content Area */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[500px] border-t' : 'max-h-0'
        }`}
      >
        <div className="lg:p-5 p-4 text-gray-600 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
