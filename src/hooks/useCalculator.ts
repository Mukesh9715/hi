"use client";

import { useState, useCallback } from 'react';
import { CalculationEntry, AdvancedFunctionType } from '@/types';
import { basicEvaluate, formatDisplayNumber } from '@/lib/mathUtils';
import { useToast } from "@/components/ui/use-toast";

export interface CalculatorState {
  displayValue: string;
  expression: string;
  history: CalculationEntry[];
  isResultDisplayed: boolean;
}

export interface UseCalculatorReturn extends CalculatorState {
  handleNumberClick: (num: string) => void;
  handleOperatorClick: (op: string) => void;
  handleEqualsClick: () => void;
  handleClearClick: () => void;
  handleBackspaceClick: () => void;
  handleDecimalClick: () => void;
  handleAdvancedFunctionClick: (func: AdvancedFunctionType) => void;
  handleParenthesisClick: (parenthesis: '(' | ')') => void;
  recallHistory: (entry: CalculationEntry) => void;
  setHistory: React.Dispatch<React.SetStateAction<CalculationEntry[]>>;
  getDisplayValue: () => string;
}

const MAX_DISPLAY_LENGTH = 16;

export function useCalculator(
  initialHistory: CalculationEntry[] = [],
  onCalculationPerformed: (entry: CalculationEntry) => void
): UseCalculatorReturn {
  const [displayValue, setDisplayValue] = useState<string>("0");
  const [expression, setExpression] = useState<string>("");
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(true);
  const [history, setHistory] = useState<CalculationEntry[]>(initialHistory);
  const [isResultDisplayed, setIsResultDisplayed] = useState<boolean>(false); // Tracks if the current displayValue is a result

  const { toast } = useToast();

  const inputDigit = useCallback((digit: string) => {
    if (displayValue.length >= MAX_DISPLAY_LENGTH && !waitingForOperand && !isResultDisplayed) return;

    if (waitingForOperand || isResultDisplayed) {
      setDisplayValue(digit);
      setWaitingForOperand(false);
      setIsResultDisplayed(false);
    } else {
      setDisplayValue(displayValue === "0" ? digit : displayValue + digit);
    }
  }, [displayValue, waitingForOperand, isResultDisplayed]);

  const handleNumberClick = useCallback((num: string) => {
    inputDigit(num);
  }, [inputDigit]);

  const handleDecimalClick = useCallback(() => {
    if (isResultDisplayed) { // Start new number
      setDisplayValue("0.");
      setWaitingForOperand(false);
      setIsResultDisplayed(false);
      return;
    }
    if (!displayValue.includes(".")) {
      setDisplayValue(displayValue + ".");
      setWaitingForOperand(false);
    }
  }, [displayValue, isResultDisplayed]);

  const performOperation = useCallback(() => {
    const prevValue = parseFloat(expression.split(operator!)[0]); // Simplified, assumes one operator
    const currentValue = parseFloat(displayValue);
    let result = 0;

    if (operator && !isNaN(prevValue) && !isNaN(currentValue)) {
      switch (operator) {
        case "+": result = prevValue + currentValue; break;
        case "-": result = prevValue - currentValue; break;
        case "×": result = prevValue * currentValue; break;
        case "÷": 
          if (currentValue === 0) {
            toast({ title: "Error", description: "Cannot divide by zero.", variant: "destructive" });
            return NaN; // Indicate error
          }
          result = prevValue / currentValue; 
          break;
        default: return currentValue; // Should not happen
      }
      return result;
    }
    return currentValue;
  }, [displayValue, expression, operator, toast]);

  const handleOperatorClick = useCallback((op: string) => {
    if (operator && !waitingForOperand) {
      const result = performOperation();
      if (isNaN(result)) { // Error handled in performOperation
        handleClearClick(); // Reset on error
        return;
      }
      const formattedResult = formatDisplayNumber(result);
      setExpression(formattedResult + op);
      setDisplayValue(formattedResult);
    } else {
      setExpression(displayValue + op);
    }
    setOperator(op);
    setWaitingForOperand(true);
    setIsResultDisplayed(false);
  }, [displayValue, operator, waitingForOperand, performOperation, handleClearClick]);
  
  const handleEqualsClick = useCallback(() => {
    if (!operator || waitingForOperand) return; // Nothing to calculate or waiting for second operand

    const currentFullExpression = expression + displayValue;
    const result = performOperation();

    if (isNaN(result)) { // Error (e.g. division by zero)
      handleClearClick(); // Reset calculator state
      return;
    }
    
    const formattedResult = formatDisplayNumber(result);
    setDisplayValue(formattedResult);
    setExpression(""); // Clear expression for next calculation
    setOperator(null);
    setWaitingForOperand(true); // Ready for new calculation starting with result
    setIsResultDisplayed(true);

    const newEntry: CalculationEntry = {
      id: Date.now().toString(),
      expression: currentFullExpression,
      result: formattedResult,
      timestamp: Date.now(),
    };
    onCalculationPerformed(newEntry);

  }, [operator, waitingForOperand, expression, displayValue, performOperation, onCalculationPerformed, handleClearClick]);


  const handleClearClick = useCallback(() => {
    setDisplayValue("0");
    setExpression("");
    setOperator(null);
    setWaitingForOperand(true);
    setIsResultDisplayed(false);
  }, []);

  const handleBackspaceClick = useCallback(() => {
    if (isResultDisplayed) { // If result is shown, backspace clears to 0
        handleClearClick();
        return;
    }
    if (displayValue.length > 1) {
      setDisplayValue(displayValue.slice(0, -1));
    } else {
      setDisplayValue("0");
      setWaitingForOperand(true); // If it becomes 0, treat as fresh input state
    }
  }, [displayValue, isResultDisplayed, handleClearClick]);

  const handleAdvancedFunctionClick = useCallback((funcType: AdvancedFunctionType) => {
    const currentValue = parseFloat(displayValue);
    if (isNaN(currentValue)) {
        toast({ title: "Error", description: "Invalid input for function.", variant: "destructive" });
        return;
    }
    let result: number | string = currentValue;

    try {
        switch(funcType) {
            case 'sin': result = Math.sin(currentValue * Math.PI / 180); break; // Assuming degrees
            case 'cos': result = Math.cos(currentValue * Math.PI / 180); break; // Assuming degrees
            case 'tan': result = Math.tan(currentValue * Math.PI / 180); break; // Assuming degrees
            case 'asin': result = Math.asin(currentValue) * 180 / Math.PI; break;
            case 'acos': result = Math.acos(currentValue) * 180 / Math.PI; break;
            case 'atan': result = Math.atan(currentValue) * 180 / Math.PI; break;
            case 'ln': result = Math.log(currentValue); break;
            case 'log10': result = Math.log10(currentValue); break;
            case 'sqrt': result = Math.sqrt(currentValue); break;
            case 'square': result = Math.pow(currentValue, 2); break;
            case 'pi': result = Math.PI; break;
            case 'e': result = Math.E; break;
            // 'pow' would require a second operand, more complex UI needed, skipping for now
            default: 
              toast({ title: "Info", description: `Function ${funcType} not fully implemented.`}); 
              return;
        }

        if (isNaN(result) || !isFinite(result)) throw new Error("Calculation error");

        const formattedResult = formatDisplayNumber(result);
        const newExpression = `${funcType}(${displayValue})`; // Simplified expression logging
        
        setDisplayValue(formattedResult);
        setExpression(newExpression + " = " + formattedResult); // Show what was done
        setOperator(null);
        setWaitingForOperand(true);
        setIsResultDisplayed(true);

        const newEntry: CalculationEntry = {
          id: Date.now().toString(),
          expression: newExpression,
          result: formattedResult,
          timestamp: Date.now(),
        };
        onCalculationPerformed(newEntry);

    } catch (error) {
        toast({ title: "Error", description: "Invalid operation or input for function.", variant: "destructive" });
        setDisplayValue("Error");
        setIsResultDisplayed(true);
    }
  }, [displayValue, onCalculationPerformed, toast]);
  
  const handleParenthesisClick = useCallback((parenthesis: '(' | ')') => {
    // This is a simplified parenthesis handling. True parenthesis logic requires
    // a full expression parser (like Shunting-Yard).
    // For now, it just appends to display or expression.
    // This won't make them functional in the current basic evaluation logic.
    if (isResultDisplayed) {
      setDisplayValue(parenthesis);
      setExpression(parenthesis);
      setIsResultDisplayed(false);
      setWaitingForOperand(false);
    } else {
      setDisplayValue(prev => prev === "0" && parenthesis === '(' ? parenthesis : prev + parenthesis);
      setExpression(prev => prev + parenthesis);
    }
    // This is a placeholder. Proper parenthesis support is complex.
    toast({ title: "Info", description: "Parentheses added to display. Full support requires advanced parsing." });
  }, [isResultDisplayed, toast]);


  const recallHistory = useCallback((entry: CalculationEntry) => {
    setDisplayValue(entry.result);
    setExpression(entry.expression); // Or perhaps just entry.result to start a new calc
    setOperator(null);
    setWaitingForOperand(true);
    setIsResultDisplayed(true);
    toast({ title: "Recalled", description: `Expression: ${entry.expression}` });
  }, [toast]);
  
  const getDisplayValue = useCallback(() => {
    if (waitingForOperand && operator && expression) {
        // If an operator was just pressed, show the first part of expression or previous result
        const parts = expression.split(operator);
        return parts[0] || displayValue; 
    }
    return displayValue;
  }, [displayValue, expression, operator, waitingForOperand]);


  return {
    displayValue: getDisplayValue(), // This is the main value shown on calculator screen
    expression, // This is the string shown above the main display value (history of current calc)
    history,
    isResultDisplayed,
    handleNumberClick,
    handleOperatorClick,
    handleEqualsClick,
    handleClearClick,
    handleBackspaceClick,
    handleDecimalClick,
    handleAdvancedFunctionClick,
    handleParenthesisClick,
    recallHistory,
    setHistory,
    getDisplayValue, // Provide the refined display value
  };
}
