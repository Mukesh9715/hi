"use client";

import type { FC } from 'react';

interface DisplayProps {
  expression: string; // The full expression being built or last full expression
  currentValue: string; // The current number being input or the result
}

const Display: FC<DisplayProps> = ({ expression, currentValue }) => {
  return (
    <div className="bg-muted/50 p-4 rounded-lg mb-6 shadow-inner min-h-[100px] flex flex-col justify-between text-right overflow-hidden">
      <div 
        className="text-muted-foreground text-sm h-6 break-all truncate"
        aria-label="Full expression"
      >
        {expression || " "} {/* Ensure div doesn't collapse */}
      </div>
      <div 
        className="text-foreground text-4xl font-bold h-12 break-all truncate"
        aria-label="Current value or result"
        role="status"
      >
        {currentValue}
      </div>
    </div>
  );
};

export default Display;
