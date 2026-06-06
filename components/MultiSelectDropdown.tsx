"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";

interface Option {
  id: string;
  name: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export default function MultiSelectDropdown({
  options,
  selectedValues,
  onChange,
  placeholder = "Select...",
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOption = (id: string) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter((v) => v !== id));
    } else {
      onChange([...selectedValues, id]);
    }
  };

  const removeOption = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onChange(selectedValues.filter((v) => v !== id));
  };

  return (
    <div className="relative w-full min-w-[200px]" ref={dropdownRef}>
      <div
        className="bg-[#202124] border border-[#2d2e33] min-h-[34px] p-1.5 rounded-md flex items-center justify-between cursor-pointer focus-within:border-blue-500 flex-wrap gap-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {selectedValues.length === 0 ? (
            <span className="text-sm text-gray-400 px-2">{placeholder}</span>
          ) : (
            selectedValues.map((val) => {
              const option = options.find((o) => o.id === val);
              if (!option) return null;
              return (
                <span
                  key={val}
                  className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-xs flex items-center gap-1"
                >
                  {option.name}
                  <X
                    size={12}
                    className="cursor-pointer hover:text-blue-300"
                    onClick={(e) => removeOption(e, val)}
                  />
                </span>
              );
            })
          )}
        </div>
        <ChevronDown size={14} className="text-gray-500 shrink-0 mx-1" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-[#1a1b1e] border border-[#2d2e33] rounded-md shadow-lg shadow-black/50 z-50 overflow-hidden">
          <div className="p-2 border-b border-[#2d2e33] flex items-center gap-2">
            <Search size={14} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-gray-300 w-full focus:outline-none"
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-gray-500 text-center">No options found</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selectedValues.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    className={`px-3 py-2 text-sm cursor-pointer flex items-center gap-2 hover:bg-[#2d2e33] transition-colors ${
                      isSelected ? "text-blue-400 font-medium" : "text-gray-300"
                    }`}
                    onClick={() => toggleOption(opt.id)}
                  >
                    <div className="w-4 h-4 border border-[#4a4b50] rounded flex items-center justify-center shrink-0">
                      {isSelected && <Check size={12} />}
                    </div>
                    {opt.name}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
