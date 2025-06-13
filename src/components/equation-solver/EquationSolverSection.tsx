"use client";
import { useState, type FormEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { explainEquation, type ExplainEquationInput, type ExplainEquationOutput } from '@/ai/flows/explain-equation'; // Assuming this path

const EquationSolverSection = () => {
  const [equation, setEquation] = useState<string>("");
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!equation.trim()) {
      setError("Please enter an equation.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setExplanation(null);

    try {
      const input: ExplainEquationInput = { equation };
      const result: ExplainEquationOutput = await explainEquation(input);
      setExplanation(result.explanation);
    } catch (err) {
      console.error("Error solving equation:", err);
      setError("Failed to get explanation. The AI model might be unavailable or the equation is too complex.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="font-headline">AI Equation Solver</CardTitle>
        <CardDescription>Enter a mathematical equation and get a step-by-step explanation from AI.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="e.g., 2x + 5 = 15"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            aria-label="Equation input"
            className="text-lg p-3"
          />
          <Button type="submit" disabled={isLoading} className="w-full text-lg py-3 bg-primary hover:bg-primary/90">
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Explain Equation"}
          </Button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-md text-destructive flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        )}

        {explanation && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3 text-primary font-headline">Explanation:</h3>
            <ScrollArea className="h-64 p-4 border rounded-md bg-muted/30 whitespace-pre-wrap shadow-inner">
              {explanation}
            </ScrollArea>
          </div>
        )}
         {!isLoading && !error && !explanation && (
          <div className="mt-6 p-4 bg-muted/30 border rounded-md text-muted-foreground flex items-center justify-center h-32">
            <p>Enter an equation above to see the AI-powered explanation here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EquationSolverSection;
