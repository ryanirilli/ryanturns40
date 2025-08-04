"use client";

import { motion } from "framer-motion";
import React from "react";

import { HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type BounceButtonProps = HTMLMotionProps<"button"> & {
  children: React.ReactNode;
  className?: string;
};

// Reusable button that mimics the play-button interaction
const BounceButton = React.forwardRef<HTMLButtonElement, BounceButtonProps>(
  ({ children, className = "", ...rest }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{
          scale: 1.08,
          transition: { type: "spring", stiffness: 300, damping: 15 },
        }}
        {...rest}
        className={cn(
          `border-0 outline-none cursor-pointer px-4 py-2 rounded-md ${className}`
        )}
      >
        {children}
      </motion.button>
    );
  }
);

BounceButton.displayName = "BounceButton";

export default BounceButton;
