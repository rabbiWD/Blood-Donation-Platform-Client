"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  /** Current committed value (usually from the URL). */
  value: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  delay?: number;
  className?: string;
}

/** Debounced search box; calls `onSearch` only after typing pauses. */
export function SearchInput({
  value,
  onSearch,
  placeholder = "Search...",
  delay = 400,
  className,
}: SearchInputProps) {
  const [text, setText] = useState(value);
  const debounced = useDebounce(text, delay);
  const lastCommitted = useRef(value);

  // Keep local text in sync when the URL value changes externally (e.g. reset).
  useEffect(() => {
    setText(value);
    lastCommitted.current = value;
  }, [value]);

  useEffect(() => {
    if (debounced !== lastCommitted.current) {
      lastCommitted.current = debounced;
      onSearch(debounced);
    }
  }, [debounced, onSearch]);

  return (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="pl-9 pr-9"
      />
      {text ? (
        <button
          type="button"
          onClick={() => setText("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
