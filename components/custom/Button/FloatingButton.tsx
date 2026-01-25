"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?:
    | "default"
    | "link"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  size?:
    | "default"
    | "sm"
    | "lg"
    | "icon"
    | "icon-sm"
    | "icon-lg"
    | null
    | undefined;
};

function FloatingButton({
  children,
  onClick,
  className,
  variant = "default",
  size = "default",
}: Props) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "fixed bottom-6 right-6 z-50 rounded-xl shadow-lg cursor-pointer",
        "p-0",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export default FloatingButton;
