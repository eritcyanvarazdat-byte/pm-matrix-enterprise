import { useStore } from '../../store';
import CustomSelect from '../ui/CustomSelect';
import { Search, Plus } from 'lucide-react';

export default function TopBar() {
  const { 
    modules, roles, areas, filters, 
    toggleFilter, searchQuery, setSearchQuery 
  } = useStore();

  return (
    <div className="h-16 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-6 shrink-0 z-20">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-bold text-zinc-100 tracking-tight">PM Matrix</h1>
        
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-md pl-10 pr-4 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#C91F1F] transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <CustomSelect
            label="Область"
            options={areas}
            selectedValues={filters.area}
            onToggle={(id) => toggleFilter('area', id)}
          />
          <CustomSelect
            label="Модуль"
            options={modules}
            selectedValues={filters.module}
            onToggle={(id) => toggleFilter('module', id)}
          />
          <CustomSelect
            label="Роль"
            options={roles}
            selectedValues={filters.role}
            onToggle={(id) => toggleFilter('role', id)}
          />
        </div>
      </div>

      <button className="flex items-center gap-2 bg-[#C91F1F] hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
        <Plus size={16} />
        Создать
      </button>
    </div>
  );
}
