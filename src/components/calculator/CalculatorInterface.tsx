"use client";

import { useState, useCallback } from 'react';
import type { FC } from 'react';
import Display from './Display';
import ButtonGrid from './ButtonGrid';
import AdvancedFunctionsSheet from './AdvancedFunctionsSheet';
import { Card, CardContent } from "@/components/ui/card";
import { useCalculator } from '@/hooks/useCalculator';
import type { CalculationEntry } from '@/types';

interface CalculatorInterfaceProps {
  history: CalculationEntry[];
  setHistory: React.Dispatch<React.SetStateAction<CalculationEntry[]>>;
  onRecallHistory: (entry: CalculationEntry) => void; // To allow page to handle this if needed for other tabs
}

const CalculatorInterface: FC<CalculatorInterfaceProps> = ({ history, setHistory, onRecallHistory }) => {
  const [isAdvancedSheetOpen, setIsAdvancedSheetOpen] = useState(false);

  const handleCalculationPerformed = useCallback((newEntry: CalculationEntry) => {
    setHistory(prevHistory => [newEntry, ...prevHistory.slice(0, 49)]); // Keep last 50 entries
  }, [setHistory]);

  const calculator = useCalculator(history, handleCalculationPerformed);
  
  // Override recallHistory to use the one from the hook, which updates its own state
  const recallAndSet = (entry: CalculationEntry) => {
    calculator.recallHistory(entry); 
    // onRecallHistory(entry); // Call parent's handler if needed for cross-tab sync
  };


  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl rounded-xl overflow-hidden bg-card">
      <CardContent className="p-4 sm:p-6">
        <Display 
          expression={calculator.expression}
          currentValue={calculator.displayValue}
        />
        <ButtonGrid 
          calculator={calculator} 
          onOpenAdvanced={() => setIsAdvancedSheetOpen(true)} 
        />
      </CardContent>
      <AdvancedFunctionsSheet 
        isOpen={isAdvancedSheetOpen} 
        onOpenChange={setIsAdvancedSheetOpen}
        calculator={calculator}
      />
    </Card>
  );
};

export default CalculatorInterface;
