import { useStore } from '../../store';
import CardItem from './CardItem';

export default function MatrixBoard() {
  const { phases, areas, cards, filters, searchQuery } = useStore();

  const filteredCards = cards.filter(card => {
    if (searchQuery && !card.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (!filters.area.includes('all')) {
      const hasMatch = card.area.some(a => filters.area.includes(a));
      if (!hasMatch) return false;
    }

    if (!filters.module.includes('all')) {
      const hasMatch = card.modules.some(m => filters.module.includes(m));
      if (!hasMatch) return false;
    }

    if (!filters.role.includes('all')) {
      const hasMatch = card.roles.some(r => filters.role.includes(r));
      if (!hasMatch) return false;
    }

    return true;
  });

  return (
    <div className="min-w-max p-6">
      <div 
        className="grid gap-4"
        style={{ 
          gridTemplateColumns: `200px repeat(${Math.max(phases.length, 1)}, minmax(300px, 1fr))` 
        }}
      >
        {/* Top-left corner empty */}
        <div className="sticky top-0 left-0 z-20 bg-zinc-950 p-4 border-b border-r border-zinc-800 rounded-tl-lg"></div>

        {/* Phase headers (Columns) */}
        {phases.map((phase) => (
          <div 
            key={phase.id} 
            className="sticky top-0 z-10 bg-zinc-900 border-b border-zinc-800 p-4 font-semibold text-zinc-100 rounded-t-lg flex items-center justify-between"
          >
            {phase.title}
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: phase.color }}></div>
          </div>
        ))}

        {/* Areas rows */}
        {areas.map((area) => (
          <div key={area.id} className="contents">
            {/* Area header (Row header) */}
            <div className="sticky left-0 z-10 bg-zinc-900 border-r border-b border-zinc-800 p-4 font-semibold text-zinc-100 flex items-center justify-between">
              {area.title}
              <div className="w-2 h-8 rounded" style={{ backgroundColor: area.color }}></div>
            </div>

            {/* Cells */}
            {phases.map((phase) => {
              const cellCards = filteredCards.filter(
                (c) => c.phase.includes(phase.id) && c.area.includes(area.id)
              );

              return (
                <div 
                  key={`${area.id}-${phase.id}`} 
                  className="bg-zinc-950/50 border border-dashed border-zinc-800 p-3 min-h-[150px] rounded-lg flex flex-col gap-3"
                >
                  {cellCards.map(card => (
                    <CardItem key={card.id} card={card} />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
