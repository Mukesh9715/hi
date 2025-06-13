"use client";
import type { FC, ReactNode } from 'react';
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalculatorButtonProps extends Omit<ButtonProps, 'onClick'> {
  value?: string; // Optional value, for buttons like 'AC' value might not be relevant for onClick logic
  label: ReactNode;
  onClick: (value?: string) => void;
  className?: string;
  span?: 1 | 2; // Grid column span
}

const CalculatorButton: FC<CalculatorButtonProps> = ({ value, label, onClick, className, span = 1, variant, ...props }) => {
  return (
    <Button
      className={cn(
        "text-xl md:text-2xl h-16 w-full rounded-lg shadow-md active:shadow-inner transition-shadow duration-100",
        span === 2 && "col-span-2",
        className
      )}
      onClick={() => onClick(value)}
      variant={variant || "secondary"}
      {...props}
    >
      {label}
    </Button>
  );
};

export default CalculatorButton;
