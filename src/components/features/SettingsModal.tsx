import { useState } from 'react';
import { useStore } from '../../store';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function SettingsModal() {
  const { isSettingsOpen, setIsSettingsOpen, phases, stages, areas, modules, roles, setDirectories } = useStore();
  const [activeTab, setActiveTab] = useState<'modules' | 'roles' | 'areas' | 'phases' | 'stages'>('phases');
  const isDemo = import.meta.env.VITE_FIREBASE_API_KEY === 'your_api_key_here';

  if (!isSettingsOpen) return null;

  const saveDirectoriesToDb = async (newPhases: any[], newStages: any[], newAreas: any[], newModules: any[], newRoles: any[]) => {
    if (isDemo) {
      setDirectories(newPhases, newStages, newAreas, newModules, newRoles);
      return;
    }
    await setDoc(doc(db, 'config', 'directories'), { phases: newPhases, stages: newStages, areas: newAreas, modules: newModules, roles: newRoles });
  };

  const handleAddSetting = async () => {
    const newId = `new_${Date.now()}`;
    if (activeTab === 'phases') await saveDirectoriesToDb([...phases, { id: newId, title: 'Новая фаза', result: '' }], stages, areas, modules, roles);
    if (activeTab === 'stages') await saveDirectoriesToDb(phases, [...stages, { id: newId, title: 'Новый этап', result: '' }], areas, modules, roles);
    if (activeTab === 'modules') await saveDirectoriesToDb(phases, stages, areas, [...modules, { id: newId, name: 'Новое ПО', color: '#888888' }], roles);
    if (activeTab === 'roles') await saveDirectoriesToDb(phases, stages, areas, modules, [...roles, { id: newId, name: 'Новая роль', color: '#888888' }]);
    if (activeTab === 'areas') await saveDirectoriesToDb(phases, stages, [...areas, { id: newId, name: 'Новая область', shortName: 'Новая', color: '#888888' }], modules, roles);
  };

  const handleUpdateSetting = async (id: string, field: string, value: string) => {
    if (activeTab === 'phases') await saveDirectoriesToDb(phases.map(p => p.id === id ? { ...p, [field]: value } : p), stages, areas, modules, roles);
    if (activeTab === 'stages') await saveDirectoriesToDb(phases, stages.map(s => s.id === id ? { ...s, [field]: value } : s), areas, modules, roles);
    if (activeTab === 'modules') await saveDirectoriesToDb(phases, stages, areas, modules.map(m => m.id === id ? { ...m, [field]: value } : m), roles);
    if (activeTab === 'roles') await saveDirectoriesToDb(phases, stages, areas, modules, roles.map(r => r.id === id ? { ...r, [field]: value } : r));
    if (activeTab === 'areas') await saveDirectoriesToDb(phases, stages, areas.map(a => a.id === id ? { ...a, [field]: value } : a), modules, roles);
  };

  const handleDeleteSetting = async (tab: string, id: string) => {
    if (!window.confirm("Удалить элемент из справочника?")) return;
    if (tab === 'phases') await saveDirectoriesToDb(phases.filter(p => p.id !== id), stages, areas, modules, roles);
    if (tab === 'stages') await saveDirectoriesToDb(phases, stages.filter(s => s.id !== id), areas, modules, roles);
    if (tab === 'modules') await saveDirectoriesToDb(phases, stages, areas, modules.filter(m => m.id !== id), roles);
    if (tab === 'roles') await saveDirectoriesToDb(phases, stages, areas, modules, roles.filter(r => r.id !== id));
    if (tab === 'areas') await saveDirectoriesToDb(phases, stages, areas.filter(a => a.id !== id), modules, roles);
  };

  const getItems = () => {
    if (activeTab === 'phases') return phases;
    if (activeTab === 'stages') return stages;
    if (activeTab === 'modules') return modules;
    if (activeTab === 'roles') return roles;
    return areas;
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/50 dark:bg-black/50 z-[60] flex items-center justify-center p-3 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[80vh] transition-colors duration-200">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Управление справочниками</h2>
          <button onClick={() => setIsSettingsOpen(false)} className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white text-2xl leading-none">&times;</button>
        </div>
        
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto scrollbar-hide">
          <button className={`flex-1 py-2 px-3 whitespace-nowrap text-sm font-medium transition-colors ${activeTab === 'phases' ? 'text-[#C91F1F] border-b-2 border-[#C91F1F]' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'}`} onClick={() => setActiveTab('phases')}>Фазы</button>
          <button className={`flex-1 py-2 px-3 whitespace-nowrap text-sm font-medium transition-colors ${activeTab === 'stages' ? 'text-[#C91F1F] border-b-2 border-[#C91F1F]' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'}`} onClick={() => setActiveTab('stages')}>Этапы</button>
          <button className={`flex-1 py-2 px-3 whitespace-nowrap text-sm font-medium transition-colors ${activeTab === 'areas' ? 'text-[#C91F1F] border-b-2 border-[#C91F1F]' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'}`} onClick={() => setActiveTab('areas')}>Области</button>
          <button className={`flex-1 py-2 px-3 whitespace-nowrap text-sm font-medium transition-colors ${activeTab === 'modules' ? 'text-[#C91F1F] border-b-2 border-[#C91F1F]' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'}`} onClick={() => setActiveTab('modules')}>ПО</button>
          <button className={`flex-1 py-2 px-3 whitespace-nowrap text-sm font-medium transition-colors ${activeTab === 'roles' ? 'text-[#C91F1F] border-b-2 border-[#C91F1F]' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'}`} onClick={() => setActiveTab('roles')}>Роли</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {getItems().map(item => (
            <div key={item.id} className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950 p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-colors duration-200">
              {(activeTab === 'modules' || activeTab === 'roles' || activeTab === 'areas') && (
                <input 
                  type="color" 
                  value={(item as any).color || '#888888'} 
                  onChange={e => handleUpdateSetting(item.id, 'color', e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer bg-transparent border-0 p-0"
                />
              )}
              <input 
                value={(item as any).name || (item as any).title || ''} 
                onChange={e => handleUpdateSetting(item.id, (activeTab === 'phases' || activeTab === 'stages') ? 'title' : 'name', e.target.value)} 
                placeholder="Название..." 
                className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded px-2 py-1 text-sm text-zinc-900 dark:text-zinc-100 focus:border-[#C91F1F] focus:outline-none transition-colors"
              />
              {activeTab === 'areas' && (
                <input 
                  value={(item as any).shortName || ''} 
                  onChange={e => handleUpdateSetting(item.id, 'shortName', e.target.value)} 
                  placeholder="Кратко" 
                  className="w-28 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded px-2 py-1 text-sm text-zinc-900 dark:text-zinc-100 focus:border-[#C91F1F] focus:outline-none transition-colors"
                />
              )}
              {(activeTab === 'phases' || activeTab === 'stages') && (
                <input 
                  value={(item as any).result || ''} 
                  onChange={e => handleUpdateSetting(item.id, 'result', e.target.value)} 
                  placeholder="Ключевой результат" 
                  className="w-48 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded px-2 py-1 text-sm text-zinc-900 dark:text-zinc-100 focus:border-[#C91F1F] focus:outline-none transition-colors"
                />
              )}
              <button 
                onClick={() => handleDeleteSetting(activeTab, item.id)}
                className="text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-500 px-2 text-xl leading-none"
              >
                &times;
              </button>
            </div>
          ))}
          <button 
            onClick={handleAddSetting}
            className="w-full mt-3 py-1.5 border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-[#C91F1F] dark:hover:border-[#C91F1F] text-zinc-500 dark:text-zinc-400 hover:text-[#C91F1F] dark:hover:text-[#C91F1F] rounded-lg transition-colors text-sm"
          >
            + Добавить элемент
          </button>
        </div>
      </div>
    </div>
  );
}
