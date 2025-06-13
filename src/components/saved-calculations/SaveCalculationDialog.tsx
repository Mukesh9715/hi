"use client";
import type { FC } from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SaveCalculationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (name: string) => void;
  currentExpression: string;
  currentResult: string;
}

const SaveCalculationDialog: FC<SaveCalculationDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onSave,
  currentExpression,
  currentResult
}) => {
  const [name, setName] = useState("");

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      setName(""); // Reset for next time
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Save Calculation</DialogTitle>
          <DialogDescription>
            Give this calculation a name to save it for future use.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center gap-2">
            <p className="text-sm text-muted-foreground">Expression:</p>
            <p className="font-mono p-2 bg-muted/50 rounded-md text-sm break-all">{currentExpression || "N/A"}</p>
          </div>
           <div className="grid items-center gap-2">
            <p className="text-sm text-muted-foreground">Result:</p>
            <p className="font-mono p-2 bg-muted/50 rounded-md text-lg font-semibold break-all">{currentResult || "N/A"}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right col-span-1">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Home Project Budget"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSave} disabled={!name.trim()} className="bg-primary hover:bg-primary/90">Save Calculation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveCalculationDialog;
