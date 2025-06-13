"use client";
import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription }  from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CalculationEntry } from '@/types';
import { History, Trash2, Copy } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';


interface HistorySectionProps {
  history: CalculationEntry[];
  onRecall: (entry: CalculationEntry) => void;
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

const HistorySection: FC<HistorySectionProps> = ({ history, onRecall, onClearHistory, onDeleteItem }) => {
  const { toast } = useToast();

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast({ title: "Copied!", description: "Calculation copied to clipboard." }))
      .catch(() => toast({ title: "Error", description: "Failed to copy.", variant: "destructive" }));
  };
  
  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">Calculation History</CardTitle>
          <CardDescription>Review your past calculations.</CardDescription>
        </div>
        {history.length > 0 && (
           <Button variant="outline" size="sm" onClick={onClearHistory} aria-label="Clear all history">
            <Trash2 className="mr-2 h-4 w-4" /> Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            <History className="mx-auto h-12 w-12 mb-4" />
            <p>No calculations in history yet.</p>
            <p>Perform some calculations in the Calculator tab.</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <ul className="space-y-3 pr-3">
              {history.map((entry) => (
                <li key={entry.id} className="p-3 border rounded-lg bg-muted/30 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-1">
                    <button onClick={() => onRecall(entry)} className="text-left hover:text-primary transition-colors">
                      <p className="text-xs text-muted-foreground break-all">{entry.expression}</p>
                      <p className="text-lg font-semibold text-foreground break-all">= {entry.result}</p>
                    </button>
                     <Button variant="ghost" size="icon" onClick={() => onDeleteItem(entry.id)} aria-label="Delete history item">
                        <Trash2 className="h-4 w-4 text-destructive/70 hover:text-destructive" />
                      </Button>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(entry.timestamp), "MMM d, yyyy HH:mm")}
                    </p>
                    <div>
                      <Button variant="ghost" size="sm" onClick={() => handleCopyToClipboard(`${entry.expression} = ${entry.result}`)} aria-label="Copy calculation">
                        <Copy className="h-3 w-3 mr-1" /> Copy
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default HistorySection;
