export interface CalculationEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface SavedCalculation extends CalculationEntry {
  name: string;
}

export type AdvancedFunctionType = 
  | 'sin' | 'cos' | 'tan' 
  | 'asin' | 'acos' | 'atan'
  | 'ln' | 'log10' 
  | 'sqrt' | 'square' | 'pow'
  | 'pi' | 'e';
