"use client";

import { useState } from "react";

export function SegmentedControl({
  options,
  defaultValue,
  onChange,
}: {
  options: string[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  const [active, setActive] = useState(defaultValue ?? options[0]);

  function select(option: string) {
    setActive(option);
    onChange?.(option);
  }

  return (
    <div className="flex rounded-full border border-divider p-1">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => select(option)}
          className={`flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
            active === option
              ? "bg-accent text-background"
              : "text-foreground/70"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
