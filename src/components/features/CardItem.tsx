import type { ProjectCard } from '../../types';
import { useStore } from '../../store';

interface CardItemProps {
  card: ProjectCard;
}

export default function CardItem({ card }: CardItemProps) {
  const { setSelectedCard, openSidebar, roles, modules, selectedForExport, toggleExportSelection } = useStore();

  const handleCardClick = () => {
    setSelectedCard(card);
    openSidebar();
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleExportSelection(card.id);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-lg cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md dark:hover:shadow-lg transition-all group relative"
    >
      <div className="flex items-start justify-between mb-1.5">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-[#C91F1F] transition-colors pr-5">
          {card.title}
        </h3>
        <input 
          type="checkbox" 
          checked={selectedForExport.includes(card.id)}
          onClick={handleCheckboxClick}
          onChange={() => {}}
          className="absolute top-2 right-2 w-3.5 h-3.5 rounded border-zinc-300 dark:border-zinc-700 accent-[#C91F1F] bg-zinc-50 dark:bg-zinc-950 cursor-pointer"
        />
      </div>
      
      <div className="flex justify-between items-end mt-2 gap-2">
        <div className="flex flex-wrap gap-1">
          {card.modules.map(mId => {
            const mod = modules.find(m => m.id === mId);
            if (!mod) return null;
            return (
              <span key={mId} className="flex items-center gap-1 text-[10px] text-zinc-700 dark:text-zinc-300 font-medium bg-zinc-50 dark:bg-zinc-800/50 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                <span className="w-2 h-2 rounded-full shrink-0 brightness-110 shadow-sm" style={{ backgroundColor: mod.color }}></span>
                {mod.name}
              </span>
            );
          })}
        </div>
        
        <div className="flex -space-x-1 shrink-0">
          {card.roles.map(rId => {
            const role = roles.find(r => r.id === rId);
            if (!role) return null;
            return (
              <div 
                key={rId} 
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm border border-white dark:border-zinc-900 relative z-10 hover:z-20 transition-transform hover:scale-110 cursor-help"
                style={{ backgroundColor: role.color }}
                title={role.name}
              >
                {role.name.charAt(0).toUpperCase()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
