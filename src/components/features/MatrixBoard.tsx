import { useStore } from '../../store';
import CardItem from './CardItem';

export default function MatrixBoard() {
  const { phases, stages, viewMode, areas, cards, filters, searchQuery } = useStore();

  const columns = viewMode === 'phases' ? phases : stages;

  const filteredCards = cards.filter(card => {
    if (searchQuery && !card.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !(card.desc && card.desc.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    if (!filters.area.includes('all')) {
      const hasMatch = (card.area || []).some(a => filters.area.includes(a));
      if (!hasMatch) return false;
    }

    if (!filters.module.includes('all')) {
      const hasMatch = (card.modules || []).some(m => filters.module.includes(m));
      if (!hasMatch) return false;
    }

    if (!filters.role.includes('all')) {
      const hasMatch = (card.roles || []).some(r => filters.role.includes(r));
      if (!hasMatch) return false;
    }

    return true;
  });

  return (
    <div className="min-w-max p-4">
      <div 
        className="grid gap-3"
        style={{ 
          gridTemplateColumns: `200px repeat(${Math.max(columns.length, 1)}, 260px)` 
        }}
      >
        <div className="sticky top-0 left-0 z-40 bg-zinc-50 dark:bg-zinc-950 p-3 border-b border-r border-zinc-200 dark:border-zinc-800 rounded-tl-lg font-bold text-zinc-400 dark:text-zinc-500 flex items-end justify-end text-xs tracking-wider transition-colors duration-200">
          ОБЛАСТИ / {viewMode === 'phases' ? 'ФАЗЫ' : 'ЭТАПЫ'}
        </div>

        {columns.map((col) => {
          const count = filteredCards.filter(c => 
            viewMode === 'phases' ? (c.phase || []).includes(col.id) : (c.stage || []).includes(col.id)
          ).length;
          return (
            <div 
              key={col.id} 
              className="sticky top-0 z-30 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-3 rounded-t-lg flex items-center justify-between transition-colors duration-200"
            >
              <div>
                <div className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{col.title}</div>
                {col.result && <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{col.result}</div>}
              </div>
              <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center text-xs font-medium border border-zinc-200 dark:border-zinc-700">
                {count}
              </div>
            </div>
          );
        })}

        {areas.map((area) => {
          const areaCount = filteredCards.filter(c => (c.area || []).includes(area.id)).length;
          return (
            <div key={area.id} className="contents">
              <div 
                className="sticky left-0 z-20 bg-white dark:bg-zinc-900 border-r border-b border-zinc-200 dark:border-zinc-800 p-3 flex flex-col justify-center relative pl-4 transition-colors duration-200"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: area.color }}></div>
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm leading-tight pr-2">{area.name}</span>
                  <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center text-xs font-medium border border-zinc-200 dark:border-zinc-700 shrink-0">
                    {areaCount}
                  </div>
                </div>
              </div>

              {columns.map((col) => {
                const cellCards = filteredCards.filter((c) => {
                  const matchesCol = viewMode === 'phases' ? (c.phase || []).includes(col.id) : (c.stage || []).includes(col.id);
                  return matchesCol && (c.area || []).includes(area.id);
                });

                return (
                  <div 
                    key={`${area.id}-${col.id}`} 
                    className="bg-white/50 dark:bg-zinc-950/50 border border-dashed border-zinc-300 dark:border-zinc-800 p-2 min-h-[100px] rounded-lg flex flex-col gap-2 transition-colors duration-200"
                  >
                    {cellCards.map(card => (
                      <CardItem key={card.id} card={card} />
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
