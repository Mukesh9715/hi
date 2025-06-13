"use client";

import type { FC } from 'react';
import CalculatorButton from './CalculatorButton';
import type { UseCalculatorReturn } from '@/hooks/useCalculator';
import { Eraser, Delete, Percent, Divide, X, Minus, Plus, Sigma, Equal, Binary } from 'lucide-react';

interface ButtonGridProps {
  calculator: UseCalculatorReturn;
  onOpenAdvanced: () => void;
}

const ButtonGrid: FC<ButtonGridProps> = ({ calculator, onOpenAdvanced }) => {
  return (
    <div className="grid grid-cols-4 gap-2">
      <CalculatorButton label={<Eraser />} onClick={calculator.handleClearClick} value="AC" variant="destructive" aria-label="Clear All" />
      <CalculatorButton label={<Sigma />} onClick={onOpenAdvanced} value="ADV" variant="outline" aria-label="Advanced Functions" />
      <CalculatorButton label={<Percent size={20} />} onClick={() => calculator.handleOperatorClick('%')} value="%" variant="outline" aria-label="Percent" />
      <CalculatorButton label={<Divide />} onClick={() => calculator.handleOperatorClick('÷')} value="÷" variant="accent" aria-label="Divide" />

      <CalculatorButton label="7" onClick={() => calculator.handleNumberClick('7')} value="7" />
      <CalculatorButton label="8" onClick={() => calculator.handleNumberClick('8')} value="8" />
      <CalculatorButton label="9" onClick={() => calculator.handleNumberClick('9')} value="9" />
      <CalculatorButton label={<X />} onClick={() => calculator.handleOperatorClick('×')} value="×" variant="accent" aria-label="Multiply" />

      <CalculatorButton label="4" onClick={() => calculator.handleNumberClick('4')} value="4" />
      <CalculatorButton label="5" onClick={() => calculator.handleNumberClick('5')} value="5" />
      <CalculatorButton label="6" onClick={() => calculator.handleNumberClick('6')} value="6" />
      <CalculatorButton label={<Minus />} onClick={() => calculator.handleOperatorClick('-')} value="-" variant="accent" aria-label="Subtract" />

      <CalculatorButton label="1" onClick={() => calculator.handleNumberClick('1')} value="1" />
      <CalculatorButton label="2" onClick={() => calculator.handleNumberClick('2')} value="2" />
      <CalculatorButton label="3" onClick={() => calculator.handleNumberClick('3')} value="3" />
      <CalculatorButton label={<Plus />} onClick={() => calculator.handleOperatorClick('+')} value="+" variant="accent" aria-label="Add" />
      
      <CalculatorButton label={<Delete />} onClick={calculator.handleBackspaceClick} value="DEL" variant="outline" aria-label="Backspace" />
      <CalculatorButton label="0" onClick={() => calculator.handleNumberClick('0')} value="0" />
      <CalculatorButton label="." onClick={calculator.handleDecimalClick} value="." variant="outline" aria-label="Decimal" />
      <CalculatorButton label={<Equal />} onClick={calculator.handleEqualsClick} value="=" variant="primary" aria-label="Equals" />
    </div>
  );
};

export default ButtonGrid;
