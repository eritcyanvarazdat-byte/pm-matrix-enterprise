import { useState, useRef, useEffect } from 'react';

interface CustomSelectProps {
  label: string;
  options: { id: string, title: string }[];
  selectedValues: string[];
  onToggle: (id: string) => void;
}

export default function CustomSelect({ label, options, selectedValues, onToggle }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasSelections = selectedValues.length > 0 && !selectedValues.includes('all');

  const getPluralLabel = (lbl: string) => {
    switch (lbl) {
      case 'Область': return 'Все области';
      case 'ПО': return 'Все ПО';
      case 'Роль': return 'Все роли';
      case 'Фазы': return 'Все фазы';
      case 'Этапы': return 'Все этапы';
      default: return `Все ${lbl.toLowerCase()}`;
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-2 py-1 rounded-md text-sm font-medium transition-colors border ${
          hasSelections 
            ? 'bg-[#C91F1F]/10 border-[#C91F1F]/30 text-[#C91F1F]' 
            : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
        }`}
      >
        {label} {hasSelections && `(${selectedValues.length})`}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl z-50 py-1 max-h-64 overflow-auto">
          <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors group">
            <input
              type="checkbox"
              checked={selectedValues.includes('all')}
              onChange={() => onToggle('all')}
              className="rounded border-zinc-300 dark:border-zinc-700 accent-[#C91F1F] cursor-pointer bg-zinc-50 dark:bg-zinc-950 w-3.5 h-3.5"
            />
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-[#C91F1F] transition-colors">
              {getPluralLabel(label)}
            </span>
          </label>
          <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1 mx-2"></div>
          {options.map((opt) => (
            <label key={opt.id} className="flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors group">
              <input
                type="checkbox"
                checked={selectedValues.includes(opt.id)}
                onChange={() => onToggle(opt.id)}
                className="rounded border-zinc-300 dark:border-zinc-700 accent-[#C91F1F] cursor-pointer bg-zinc-50 dark:bg-zinc-950 w-3.5 h-3.5"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                {opt.title}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
