import type { ProjectCard } from '../../types';
import { useStore } from '../../store';

interface CardItemProps {
  card: ProjectCard;
}

export default function CardItem({ card }: CardItemProps) {
  const { setSelectedCard, openSidebar, roles, modules } = useStore();

  const handleCardClick = () => {
    setSelectedCard(card);
    openSidebar();
  };

  const getRoleTitles = () => card.roles.map(r => roles.find(rl => rl.id === r)?.title).filter(Boolean);
  const getModuleTitles = () => card.modules.map(m => modules.find(md => md.id === m)?.title).filter(Boolean);

  return (
    <div 
      onClick={handleCardClick}
      className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg cursor-pointer hover:border-zinc-700 hover:shadow-lg transition-all group"
    >
      <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-[#C91F1F] transition-colors mb-2">
        {card.title}
      </h3>
      
      <div className="flex flex-wrap gap-1 mb-2">
        {getModuleTitles().map((mTitle, i) => (
          <span key={i} className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">
            {mTitle}
          </span>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-1">
        {getRoleTitles().map((rTitle, i) => (
          <span key={i} className="text-[10px] bg-[#C91F1F]/20 text-[#C91F1F] px-1.5 py-0.5 rounded border border-[#C91F1F]/30">
            {rTitle}
          </span>
        ))}
      </div>
    </div>
  );
}
