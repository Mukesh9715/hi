"use client";
import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SavedCalculation } from '@/types';
import { Save, Trash2, Copy, Edit3 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"; // Corrected import path
import { format } from 'date-fns';


interface SavedCalculationsSectionProps {
  savedCalculations: SavedCalculation[];
  onRecall: (entry: SavedCalculation) => void;
  onDelete: (id: string) => void;
  onEdit?: (entry: SavedCalculation) => void; // Optional: For editing name
}

const SavedCalculationsSection: FC<SavedCalculationsSectionProps> = ({ savedCalculations, onRecall, onDelete, onEdit }) => {
  const { toast } = useToast();

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast({ title: "Copied!", description: "Calculation copied to clipboard." }))
      .catch(() => toast({ title: "Error", description: "Failed to copy.", variant: "destructive" }));
  };

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="font-headline">Saved Calculations</CardTitle>
        <CardDescription>Access your frequently used calculations.</CardDescription>
      </CardHeader>
      <CardContent>
        {savedCalculations.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            <Save className="mx-auto h-12 w-12 mb-4" />
            <p>No calculations saved yet.</p>
            <p>Save important calculations from the Calculator tab.</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <ul className="space-y-3 pr-3">
              {savedCalculations.map((entry) => (
                <li key={entry.id} className="p-3 border rounded-lg bg-muted/30 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-1">
                    <button onClick={() => onRecall(entry)} className="text-left hover:text-primary transition-colors">
                      <p className="text-md font-semibold text-foreground break-all">{entry.name}</p>
                      <p className="text-xs text-muted-foreground break-all">{entry.expression} = {entry.result}</p>
                    </button>
                    <div className="flex items-center">
                      {onEdit && (
                        <Button variant="ghost" size="icon" onClick={() => onEdit(entry)} aria-label="Edit saved calculation name">
                          <Edit3 className="h-4 w-4 text-muted-foreground hover:text-accent-foreground" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => onDelete(entry.id)} aria-label="Delete saved calculation">
                        <Trash2 className="h-4 w-4 text-destructive/70 hover:text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-muted-foreground">
                      Saved: {format(new Date(entry.timestamp), "MMM d, yyyy HH:mm")}
                    </p>
                    <Button variant="ghost" size="sm" onClick={() => handleCopyToClipboard(`${entry.name}: ${entry.expression} = ${entry.result}`)} aria-label="Copy saved calculation">
                        <Copy className="h-3 w-3 mr-1" /> Copy
                    </Button>
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

export default SavedCalculationsSection;
