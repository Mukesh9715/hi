// This is a placeholder for safe expression evaluation.
// For a real application, use a robust math expression parser and evaluator library
// or implement the Shunting-yard algorithm and RPN evaluation.
// Avoid using eval() or new Function() due to security risks.

// A very basic function to handle simple arithmetic.
// It does not support operator precedence beyond left-to-right, or parentheses.
export function basicEvaluate(expression: string): number | string {
  try {
    // Sanitize and simplify common math symbols
    let sanitized = expression
      .replace(/\s+/g, "") // Remove all whitespace
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-"); // Ensure minus sign is standard

    // Regex to validate basic arithmetic: numbers, operators, decimal points.
    // Does not allow leading operators or multiple operators together (e.g. 5++3)
    // Allows negative numbers at the start or after an operator e.g. -5*2 or 5*-2
    if (!/^-?\d+(\.\d+)?([-+*/]-?\d+(\.\d+)?)*$/.test(sanitized) && sanitized !== "") {
       // Check if it's just a number
      if (/^-?\d+(\.\d+)?$/.test(sanitized)) {
        // It's a valid number, proceed
      } else {
        console.warn("Basic evaluate: Invalid characters or format in expression:", sanitized);
        return "Error: Format";
      }
    }
    
    if (sanitized === "") return 0;

    // This is still a security risk, even if slightly more contained than direct eval.
    // Replace with a proper parser for production.
    const result = new Function('return ' + sanitized)();

    if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
      return "Error: Calculation";
    }
    return result;
  } catch (e) {
    console.error("Evaluation error:", e);
    return "Error";
  }
}

// Placeholder for handling advanced functions (sin, cos, log, etc.)
// This would typically involve parsing the expression and applying Math functions.
export function evaluateAdvancedExpression(expression: string): number | string {
  // For now, we'll just try basicEvaluate. A real implementation needs a proper parser.
  // Example: if expression is "sin(30)", this basicEvaluate will fail.
  // A more complex parser would identify "sin", parse "30", convert to radians if needed,
  // call Math.sin(), and substitute back into the expression or evaluate directly.
  
  // A temporary measure to allow single numbers or simple expressions.
  // This part will be significantly complex in a full-featured calculator.
  if (/^(\d+(\.\d+)?)$/.test(expression)) { // if it's just a number
    return parseFloat(expression);
  }
  // Add more sophisticated parsing and evaluation here.
  // For this scaffold, advanced functions like sin(EXPRESSION) are not fully supported
  // by this evaluation function. They are handled by directly applying Math.sin, etc.
  // to the current number in useCalculator.ts.
  
  return basicEvaluate(expression);
}

// Helper to format display number
export function formatDisplayNumber(num: number | string): string {
  if (typeof num === 'string') return num; // If it's an error message or similar
  if (isNaN(num) || !isFinite(num)) return "Error";
  
  // Limit precision to avoid long decimals
  const numStr = String(num);
  if (numStr.includes('.')) {
    const parts = numStr.split('.');
    if (parts[1].length > 8) { // Max 8 decimal places
      return Number(num.toFixed(8)).toString();
    }
  }
  return numStr;
}
