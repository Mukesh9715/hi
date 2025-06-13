"use client";
import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CalculatorInterface from '@/components/calculator/CalculatorInterface';
import EquationSolverSection from '@/components/equation-solver/EquationSolverSection';
import HistorySection from '@/components/history/HistorySection';
import SavedCalculationsSection from '@/components/saved-calculations/SavedCalculationsSection';
import SaveCalculationDialog from '@/components/saved-calculations/SaveCalculationDialog';
import { Button } from "@/components/ui/button";
import { CalcuGeniusIcon } from '@/components/calculator-icon';
import type { CalculationEntry, SavedCalculation } from '@/types';
import { Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";


const HISTORY_STORAGE_KEY = 'calcuGeniusHistory';
const SAVED_CALCS_STORAGE_KEY = 'calcuGeniusSaved';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [history, setHistory] = useState<CalculationEntry[]>([]);
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [calcToSave, setCalcToSave] = useState<{ expression: string; result: string } | null>(null);

  const { toast } = useToast();

  // Load from localStorage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
    const storedSavedCalcs = localStorage.getItem(SAVED_CALCS_STORAGE_KEY);
    if (storedSavedCalcs) {
      setSavedCalculations(JSON.parse(storedSavedCalcs));
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(SAVED_CALCS_STORAGE_KEY, JSON.stringify(savedCalculations));
  }, [savedCalculations]);


  const handleRecall = useCallback((entry: CalculationEntry | SavedCalculation) => {
    // This function is a bit of a placeholder.
    // Ideally, the CalculatorInterface would have a method to directly set its state.
    // For now, we can just toast that it's recalled.
    // The `useCalculator` hook handles its own state for recall.
    toast({
      title: "Recalled to Calculator",
      description: `Expression: ${entry.expression} = ${entry.result}`,
    });
    setActiveTab("calculator"); // Switch to calculator tab
    // To fully implement recall, `CalculatorInterface` would need props to set its display/expression.
    // This is complex with the `useCalculator` hook managing its own state.
    // For this scaffold, direct state injection into `useCalculator` is omitted for simplicity.
    // The `recallHistory` in `useCalculator` updates its internal state.
  }, [toast]);

  const handleClearHistory = () => {
    setHistory([]);
    toast({ title: "History Cleared" });
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    toast({ title: "History Item Deleted" });
  };

  const handleSaveCalculation = (name: string) => {
    if (calcToSave) {
      const newSavedCalc: SavedCalculation = {
        id: Date.now().toString(),
        name,
        expression: calcToSave.expression,
        result: calcToSave.result,
        timestamp: Date.now(),
      };
      setSavedCalculations(prev => [newSavedCalc, ...prev.slice(0, 49)]);
      toast({ title: "Calculation Saved!", description: `Saved as "${name}".` });
      setCalcToSave(null);
    }
    setIsSaveDialogOpen(false);
  };

  const handleDeleteSavedCalculation = (id: string) => {
    setSavedCalculations(prev => prev.filter(item => item.id !== id));
    toast({ title: "Saved Calculation Deleted" });
  };

  const openSaveDialog = () => {
      // Try to get current calculation from CalculatorInterface.
      // This is tricky as state is encapsulated in useCalculator.
      // For now, we assume CalculatorInterface passes up the current expression/result when save is clicked.
      // Or, we can get it from the latest history entry if "Save last"
      if (history.length > 0) {
        const lastCalc = history[0];
        setCalcToSave({ expression: lastCalc.expression, result: lastCalc.result });
        setIsSaveDialogOpen(true);
      } else {
        toast({ title: "Nothing to save", description: "Perform a calculation first.", variant: "destructive" });
      }
  };


  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <header className="my-6 sm:my-8 text-center">
        <div className="flex items-center justify-center gap-3">
          <CalcuGeniusIcon className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
          <h1 className="text-4xl sm:text-5xl font-headline font-bold text-primary">
            CalcuGenius
          </h1>
        </div>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">Your intelligent calculation companion.</p>
      </header>
      
      <main className="w-full max-w-xl lg:max-w-2xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-12 rounded-lg p-1">
            <TabsTrigger value="calculator" className="py-2 sm:py-2.5 text-sm sm:text-base">Calculator</TabsTrigger>
            <TabsTrigger value="solver" className="py-2 sm:py-2.5 text-sm sm:text-base">AI Solver</TabsTrigger>
            <TabsTrigger value="history" className="py-2 sm:py-2.5 text-sm sm:text-base">History</TabsTrigger>
            <TabsTrigger value="saved" className="py-2 sm:py-2.5 text-sm sm:text-base">Saved</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="mt-6">
             <div className="mb-4 flex justify-end">
                <Button onClick={openSaveDialog} variant="outline" className="bg-accent/10 hover:bg-accent/20 text-accent-foreground border-accent/50">
                    <Save className="mr-2 h-4 w-4" /> Save Last Calculation
                </Button>
            </div>
            <CalculatorInterface history={history} setHistory={setHistory} onRecallHistory={handleRecall} />
          </TabsContent>

          <TabsContent value="solver" className="mt-6">
            <EquationSolverSection />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <HistorySection 
              history={history} 
              onRecall={handleRecall} 
              onClearHistory={handleClearHistory}
              onDeleteItem={handleDeleteHistoryItem}
            />
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            <SavedCalculationsSection 
              savedCalculations={savedCalculations} 
              onRecall={handleRecall}
              onDelete={handleDeleteSavedCalculation}
            />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} CalcuGenius. Precision at your fingertips.</p>
      </footer>
      {calcToSave && (
        <SaveCalculationDialog
            isOpen={isSaveDialogOpen}
            onOpenChange={setIsSaveDialogOpen}
            onSave={handleSaveCalculation}
            currentExpression={calcToSave.expression}
            currentResult={calcToSave.result}
        />
      )}
    </div>
  );
}
