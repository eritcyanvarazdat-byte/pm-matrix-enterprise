import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface CustomSelectProps {
  label: string;
  options: { id: string; title: string }[];
  selectedValues: string[];
  onToggle: (id: string) => void;
}

export default function CustomSelect({ label, options, selectedValues, onToggle }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayValue = selectedValues.includes('all') 
    ? 'Все' 
    : `${selectedValues.length} выбрано`;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between min-w-36 bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm rounded-md p-2 hover:bg-zinc-800 transition-colors"
      >
        <span className="truncate">{label}: {displayValue}</span>
        <ChevronDown size={16} className="text-zinc-400 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-48 bg-zinc-900 border border-zinc-800 rounded-md shadow-lg overflow-hidden">
          <div className="max-h-60 overflow-y-auto p-1">
            <button
              onClick={() => onToggle('all')}
              className={`w-full text-left flex items-center px-2 py-1.5 text-sm rounded-md transition-colors ${selectedValues.includes('all') ? 'bg-[#C91F1F]/20 text-[#C91F1F]' : 'text-zinc-100 hover:bg-zinc-800'}`}
            >
              <div className="w-5 flex items-center justify-center shrink-0">
                {selectedValues.includes('all') && <Check size={14} />}
              </div>
              Все
            </button>
            {options.map((opt) => {
              const isSelected = selectedValues.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => onToggle(opt.id)}
                  className={`w-full text-left flex items-center px-2 py-1.5 text-sm rounded-md transition-colors ${isSelected ? 'bg-[#C91F1F]/20 text-[#C91F1F]' : 'text-zinc-100 hover:bg-zinc-800'}`}
                >
                  <div className="w-5 flex items-center justify-center shrink-0">
                    {isSelected && <Check size={14} />}
                  </div>
                  {opt.title}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
