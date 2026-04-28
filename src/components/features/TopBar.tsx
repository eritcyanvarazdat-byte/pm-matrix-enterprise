import { useStore } from '../../store';
import CustomSelect from '../ui/CustomSelect';
import { Search, Plus, Download, Settings, Sun, Moon } from 'lucide-react';

export default function TopBar() {
  const { 
    modules, roles, areas, filters, 
    toggleFilter, searchQuery, setSearchQuery,
    selectedForExport, setIsSettingsOpen, setIsFormOpen,
    phases, cards, clearExportSelection, setFormData, setSelectedCard,
    theme, toggleTheme, viewMode, setViewMode
  } = useStore();

  const handleExportMarkdown = () => {
    if (selectedForExport.length === 0) return;

    const cardsToExport = cards.filter(c => selectedForExport.includes(c.id));
    let mdContent = `# Экспорт карточек PM Matrix\n\n`;

    cardsToExport.forEach(card => {
      const cardPhases = card.phase.map(pId => phases.find(p => p.id === pId)?.title || pId).join(', ');
      const cardAreas = card.area.map(aId => areas.find(a => a.id === aId)?.name || aId).join(', ');
      const cardModules = card.modules.map(mId => modules.find(m => m.id === mId)?.name || mId).join(', ');
      const cardRoles = card.roles.map(rId => roles.find(r => r.id === rId)?.name || rId).join(', ');

      mdContent += `## ${card.title}\n\n`;
      mdContent += `- **Фазы:** ${cardPhases || 'Не указано'}\n`;
      mdContent += `- **Области:** ${cardAreas || 'Не указано'}\n`;
      mdContent += `- **ПО:** ${cardModules || 'Не назначено'}\n`;
      mdContent += `- **Роли:** ${cardRoles || 'Нет ролей'}\n`;
      
      if (card.link) mdContent += `- **Ссылка:** [Открыть документ](${card.link})\n`;
      mdContent += `\n`;

      if (card.checklist && card.checklist.length > 0) {
        mdContent += `**Задачи:**\n`;
        card.checklist.forEach(item => {
          mdContent += `- [${item.completed ? 'x' : ' '}] ${item.text}\n`;
        });
        mdContent += `\n`;
      }
      
      if (card.desc) mdContent += `**Описание:**\n${card.desc}\n\n`;
      mdContent += `---\n\n`;
    });

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'exported_cards.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    clearExportSelection();
  };

  const handleOpenAdd = () => {
    setSelectedCard(null);
    setFormData({
      id: '',
      title: '',
      phase: [],
      stage: [],
      area: [],
      modules: [],
      roles: [],
      desc: '',
      link: '',
      checklist: []
    });
    setIsFormOpen(true);
  };

  return (
    <div className="h-12 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-4 shrink-0 relative z-50 transition-colors duration-200">
      <div className="flex items-center gap-5">
        <div className="flex items-center h-6">
          <svg viewBox="0 0 559.5 197.8" className="h-full w-auto">
            <path fill="#C91F1F" d="M464.1,6.9l-64.3,118.7c-0.2,0.4-0.8,0.3-0.8-0.1L378.7,7c0-0.2-0.2-0.4-0.4-0.4h-89.6c-0.2,0-0.4,0.2-0.4,0.4 l-33.7,181.9c-0.1,0.3,0.2,0.5,0.4,0.5h61c0.2,0,0.4-0.2,0.4-0.4l21.5-116c0.1-0.5,0.8-0.5,0.9,0l21.3,116c0,0.2,0.2,0.4,0.4,0.4 h54.2c0.2,0,0.3-0.1,0.4-0.2L479.5,73c0.2-0.4,0.9-0.2,0.8,0.3L459,188.9c-0.1,0.3,0.2,0.5,0.4,0.5h61c0.2,0,0.4-0.2,0.4-0.4 L554.5,7.2c0.1-0.3-0.2-0.5-0.4-0.5h-89.5C464.4,6.6,464.2,6.7,464.1,6.9"/>
            <path fill="#C91F1F" d="M191.7,6.6H62.3c-0.2,0-0.4,0.2-0.4,0.4L46.4,90.7H11.9c-0.2,0-0.4,0.2-0.4,0.4L3.9,132 c-0.1,0.3,0.2,0.5,0.4,0.5h33.9h0.4H86c0.5,0,0.6,0.7,0.1,0.9c-9.4,2.5-36.3,9.7-46.5,12.3c-2.2,0.6-3.9,2.4-4.3,4.6 c-1.8,9.6-6.4,34.7-7.2,38.6c-0.1,0.3,0.2,0.5,0.4,0.5h61c0.2,0,0.4-0.2,0.4-0.4l10.5-56.6H161c50.4,0,86.4-18,94.9-64 C262.9,31.2,242.1,6.6,191.7,6.6 M193,68.5c-2.6,14.1-12.2,22.2-31.5,22.2h-53.3l7.7-41.8h53.3C187.5,48.9,195.7,54.2,193,68.5"/>
          </svg>
        </div>
        
        <div className="relative w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md pl-8 pr-3 py-1 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#C91F1F] transition-colors"
          />
        </div>

        <div className="flex bg-zinc-100 dark:bg-zinc-950 p-0.5 rounded-md border border-zinc-200 dark:border-zinc-800">
          <button 
            onClick={() => setViewMode('phases')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${viewMode === 'phases' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
          >
            Фазы
          </button>
          <button 
            onClick={() => setViewMode('stages')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${viewMode === 'stages' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
          >
            Этапы
          </button>
        </div>

        <div className="flex items-center gap-2">
          <CustomSelect
            label="Область"
            options={areas.map(a => ({ id: a.id, title: a.shortName }))}
            selectedValues={filters.area}
            onToggle={(id) => toggleFilter('area', id)}
          />
          <CustomSelect
            label="ПО"
            options={modules.map(m => ({ id: m.id, title: m.name }))}
            selectedValues={filters.module}
            onToggle={(id) => toggleFilter('module', id)}
          />
          <CustomSelect
            label="Роль"
            options={roles.map(r => ({ id: r.id, title: r.name }))}
            selectedValues={filters.role}
            onToggle={(id) => toggleFilter('role', id)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {selectedForExport.length > 0 && (
          <button 
            onClick={handleExportMarkdown}
            className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 px-2 py-1 rounded-md text-sm font-medium transition-colors border border-zinc-200 dark:border-zinc-700"
          >
            <Download size={14} />
            Экспорт ({selectedForExport.length})
          </button>
        )}
        
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 bg-[#C91F1F] hover:bg-red-700 text-white px-2 py-1 rounded-md text-sm font-medium transition-colors"
        >
          <Plus size={14} />
          Создать
        </button>

        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-950 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-1 rounded-md text-sm font-medium transition-colors border border-zinc-200 dark:border-zinc-800"
        >
          <Settings size={14} />
          Справочники
        </button>

        <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

        <button 
          onClick={toggleTheme}
          className="flex items-center justify-center p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-950 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors border border-zinc-200 dark:border-zinc-800"
          title={theme === 'dark' ? 'Включить светлую тему' : 'Включить темную тему'}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </div>
  );
}
