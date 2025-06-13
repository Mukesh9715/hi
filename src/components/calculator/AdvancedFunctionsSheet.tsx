"use client";
import type { FC } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import CalculatorButton from './CalculatorButton';
import type { UseCalculatorReturn } from '@/hooks/useCalculator';
import type { AdvancedFunctionType } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AdvancedFunctionsSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  calculator: UseCalculatorReturn;
}

const advancedFunctions: { label: string; type: AdvancedFunctionType; symbol?: string }[] = [
  { label: "sin", type: "sin" }, { label: "cos", type: "cos" }, { label: "tan", type: "tan" },
  { label: "asin", type: "asin" }, { label: "acos", type: "acos" }, { label: "atan", type: "atan" },
  { label: "ln", type: "ln" }, { label: "log₁₀", type: "log10" },
  { label: "√x", type: "sqrt", symbol: "√" }, { label: "x²", type: "square" },
  // { label: "xʸ", type: "pow" }, // Requires more complex input handling
  { label: "π", type: "pi" }, { label: "e", type: "e" },
];

const AdvancedFunctionsSheet: FC<AdvancedFunctionsSheetProps> = ({ isOpen, onOpenChange, calculator }) => {
  const handleFuncClick = (funcType: AdvancedFunctionType) => {
    calculator.handleAdvancedFunctionClick(funcType);
    // Optionally close sheet after function click, or keep open for multiple ops
    // onOpenChange(false); 
  };

  const handleParenthesis = (p: '(' | ')') => {
    calculator.handleParenthesisClick(p);
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-lg max-h-[70vh]">
        <SheetHeader className="mb-4">
          <SheetTitle>Advanced Functions</SheetTitle>
          <SheetDescription>Select an advanced mathematical function.</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(70vh-150px)] pr-3">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {advancedFunctions.map((func) => (
              <CalculatorButton
                key={func.type}
                label={func.label}
                onClick={() => handleFuncClick(func.type)}
                value={func.type}
                variant="outline"
                className="text-base h-14"
              />
            ))}
             <CalculatorButton
              label="("
              onClick={() => handleParenthesis('(')}
              value="("
              variant="outline"
              className="text-base h-14"
            />
            <CalculatorButton
              label=")"
              onClick={() => handleParenthesis(')')}
              value=")"
              variant="outline"
              className="text-base h-14"
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default AdvancedFunctionsSheet;
