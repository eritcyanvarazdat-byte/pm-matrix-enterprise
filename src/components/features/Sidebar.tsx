import { useStore } from '../../store';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { X, ExternalLink, Trash2, Edit } from 'lucide-react';
import CustomSelect from '../ui/CustomSelect';

export default function Sidebar() {
  const { 
    isSidebarOpen, selectedCard, isFormOpen, formData, 
    closeSidebar, setFormData, setIsFormOpen, setSelectedCard,
    phases, areas, modules, roles, cards, setCards
  } = useStore();

  const isDemo = import.meta.env.VITE_FIREBASE_API_KEY === 'your_api_key_here';

  if (!isSidebarOpen) return null;

  const handleSaveCard = async () => {
    if (!formData.title.trim()) return alert("Введите название карточки");
    if (formData.phase.length === 0 || formData.area.length === 0) return alert("Выберите хотя бы одну фазу и область");
    
    const cardId = formData.id ? formData.id : Date.now().toString();
    const cardToSave = { ...formData, id: cardId };

    closeSidebar();
    if (isDemo) {
      const newCards = cards.some(c => c.id === cardId) 
        ? cards.map(c => c.id === cardId ? cardToSave : c)
        : [...cards, cardToSave];
      setCards(newCards);
      return;
    }
    await setDoc(doc(db, 'cards', cardId.toString()), cardToSave);
  };

  const handleDeleteCard = async () => {
    if (!selectedCard) return;
    if (window.confirm("Удалить эту карточку?")) {
      const idToDelete = selectedCard.id;
      closeSidebar();
      if (isDemo) {
        setCards(cards.filter(c => c.id !== idToDelete));
        return;
      }
      await deleteDoc(doc(db, 'cards', idToDelete.toString()));
    }
  };

  const handleToggleChecklistInView = async (itemId: string | number) => {
    if (!selectedCard) return;
    const updatedChecklist = (selectedCard.checklist || []).map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    const updatedCard = { ...selectedCard, checklist: updatedChecklist };
    
    if (isDemo) {
      setCards(cards.map(c => c.id === selectedCard.id ? updatedCard : c));
      setSelectedCard(updatedCard);
      return;
    }
    await setDoc(doc(db, 'cards', selectedCard.id.toString()), updatedCard);
  };

  const toggleSelection = (field: 'modules' | 'roles', value: string) => {
    setFormData({
      ...formData,
      [field]: formData[field].includes(value) 
        ? formData[field].filter(v => v !== value) 
        : [...formData[field], value]
    });
  };

  const handleOpenEdit = () => {
    if (selectedCard) {
      setFormData({ ...selectedCard, checklist: selectedCard.checklist || [], link: selectedCard.link || '' });
      setIsFormOpen(true);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-zinc-900/50 dark:bg-black/50 z-40 transition-opacity backdrop-blur-sm"
        onClick={closeSidebar}
      />
      
      <div 
        className="fixed top-0 right-0 h-full w-[400px] bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 flex flex-col transition-colors duration-200"
      >
        <div className="h-12 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 shrink-0 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
          <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100 truncate pr-4 text-[#C91F1F]">
            {isFormOpen ? (formData.id ? "РЕДАКТИРОВАНИЕ" : "НОВАЯ КАРТОЧКА") : selectedCard?.phase.map(p => phases.find(ph => ph.id === p)?.title).join(', ').toUpperCase()}
          </h2>
          <button 
            onClick={closeSidebar}
            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-zinc-100 dark:scrollbar-track-zinc-900">
          {isFormOpen ? (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-zinc-500 mb-1 uppercase tracking-wider">Название</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-md px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-[#C91F1F]"
                  placeholder="Введите название..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-500 mb-1 uppercase tracking-wider">Внешняя ссылка</label>
                <input 
                  type="text" 
                  value={formData.link}
                  onChange={e => setFormData({...formData, link: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-md px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-[#C91F1F]"
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-[11px] font-medium text-zinc-500 mb-1 uppercase tracking-wider">Фаза</label>
                  <CustomSelect
                    label="Фазы"
                    options={phases.map(p => ({ id: p.id, title: p.title }))}
                    selectedValues={formData.phase}
                    onToggle={(id) => setFormData({...formData, phase: formData.phase.includes(id) ? formData.phase.filter(v => v !== id) : [...formData.phase, id]})}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] font-medium text-zinc-500 mb-1 uppercase tracking-wider">Область</label>
                  <CustomSelect
                    label="Области"
                    options={areas.map(a => ({ id: a.id, title: a.name }))}
                    selectedValues={formData.area}
                    onToggle={(id) => setFormData({...formData, area: formData.area.includes(id) ? formData.area.filter(v => v !== id) : [...formData.area, id]})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-500 mb-1 uppercase tracking-wider">ПО</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {modules.map(m => (
                    <label key={m.id} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.modules.includes(m.id)} 
                        onChange={() => toggleSelection('modules', m.id)} 
                        className="rounded border-zinc-300 dark:border-zinc-700 accent-[#C91F1F] cursor-pointer bg-zinc-50 dark:bg-zinc-950 w-3.5 h-3.5"
                      />
                      {m.name}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-500 mb-1 uppercase tracking-wider">Роли</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {roles.map(r => (
                    <label key={r.id} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.roles.includes(r.id)} 
                        onChange={() => toggleSelection('roles', r.id)} 
                        className="rounded border-zinc-300 dark:border-zinc-700 accent-[#C91F1F] cursor-pointer bg-zinc-50 dark:bg-zinc-950 w-3.5 h-3.5"
                      />
                      {r.name}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-500 mb-1 uppercase tracking-wider">Описание</label>
                <textarea 
                  value={formData.desc}
                  onChange={e => setFormData({...formData, desc: e.target.value})}
                  className="w-full h-20 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-md px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-[#C91F1F] resize-none"
                  placeholder="Описание..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Чек-лист</label>
                <div className="space-y-1.5 mb-2">
                  {formData.checklist.map(item => (
                    <div key={item.id} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={item.completed} 
                        onChange={e => setFormData({ 
                          ...formData, 
                          checklist: formData.checklist.map(i => i.id === item.id ? { ...i, completed: e.target.checked } : i) 
                        })} 
                        className="rounded border-zinc-300 dark:border-zinc-700 accent-[#C91F1F] cursor-pointer bg-zinc-50 dark:bg-zinc-950 w-3.5 h-3.5"
                      />
                      <input 
                        type="text"
                        value={item.text}
                        onChange={e => setFormData({ 
                          ...formData, 
                          checklist: formData.checklist.map(i => i.id === item.id ? { ...i, text: e.target.value } : i) 
                        })}
                        className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded px-2 py-1 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#C91F1F]"
                        placeholder="Задача..."
                      />
                      <button 
                        onClick={() => setFormData({ ...formData, checklist: formData.checklist.filter(i => i.id !== item.id) })}
                        className="text-zinc-400 dark:text-zinc-500 hover:text-red-500 p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setFormData({ ...formData, checklist: [...formData.checklist, { id: Date.now(), text: '', completed: false }] })}
                  className="w-full py-1.5 border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-[#C91F1F] dark:hover:border-[#C91F1F] text-zinc-500 dark:text-zinc-400 hover:text-[#C91F1F] dark:hover:text-[#C91F1F] rounded-lg transition-colors text-sm"
                >
                  + Добавить задачу
                </button>
              </div>
            </div>
          ) : selectedCard ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {selectedCard.area.map(aId => {
                  const area = areas.find(a => a.id === aId);
                  return area ? (
                    <div key={aId} className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
                      <span className="w-2 h-2 rounded-full shrink-0 brightness-110 shadow-sm" style={{ backgroundColor: area.color }}></span>
                      {area.name.toUpperCase()}
                    </div>
                  ) : null;
                })}
              </div>

              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{selectedCard.title}</h2>

              {selectedCard.link && (
                <div>
                  <h3 className="text-[11px] font-medium text-zinc-500 mb-1 uppercase tracking-wider">Материалы</h3>
                  <a 
                    href={selectedCard.link.startsWith('http') ? selectedCard.link : `https://${selectedCard.link}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[#C91F1F] dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:underline text-sm flex items-center gap-1.5"
                  >
                    <ExternalLink size={14} /> Открыть документ
                  </a>
                </div>
              )}

              <div>
                <h3 className="text-[11px] font-medium text-zinc-500 mb-1 uppercase tracking-wider">ПО</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCard.modules.length ? selectedCard.modules.map(mId => {
                    const mod = modules.find(m => m.id === mId);
                    return mod ? (
                      <span key={mId} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 font-medium">
                        <span className="w-2 h-2 rounded-full shrink-0 brightness-110 shadow-sm" style={{ backgroundColor: mod.color }}></span>
                        {mod.name}
                      </span>
                    ) : null;
                  }) : <span className="text-sm text-zinc-500">Не назначено</span>}
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-medium text-zinc-500 mb-1 uppercase tracking-wider">Роли</h3>
                <div className="flex flex-col gap-1.5">
                  {selectedCard.roles.length ? selectedCard.roles.map(rId => {
                    const role = roles.find(r => r.id === rId);
                    return role ? (
                      <div key={rId} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm border border-black/10 dark:border-white/10" style={{ backgroundColor: role.color }}>
                          {role.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">{role.name}</span>
                      </div>
                    ) : null;
                  }) : <span className="text-sm text-zinc-500">Нет ролей</span>}
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-medium text-zinc-500 mb-1 uppercase tracking-wider">Описание</h3>
                <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed bg-zinc-50 dark:bg-zinc-950 p-2 rounded border border-zinc-200 dark:border-zinc-800">
                  {selectedCard.desc || 'Нет описания'}
                </p>
              </div>

              {selectedCard.checklist && selectedCard.checklist.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Чек-лист</h3>
                  <div className="space-y-1.5 bg-zinc-50 dark:bg-zinc-950 p-2 rounded border border-zinc-200 dark:border-zinc-800">
                    {selectedCard.checklist.map((item) => (
                      <label key={item.id} className="flex items-start gap-2 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={item.completed} 
                          onChange={() => handleToggleChecklistInView(item.id)}
                          className="mt-0.5 rounded border-zinc-300 dark:border-zinc-700 accent-[#C91F1F] cursor-pointer bg-white dark:bg-zinc-900 w-3.5 h-3.5"
                        />
                        <span className={`text-sm select-none ${item.completed ? 'text-zinc-400 dark:text-zinc-600 line-through' : 'text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors'}`}>
                          {item.text || 'Пустая задача'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex gap-2 shrink-0 transition-colors duration-200">
          {isFormOpen ? (
            <button 
              onClick={handleSaveCard}
              className="flex-1 bg-[#C91F1F] hover:bg-red-700 text-white py-1.5 rounded-md font-medium transition-colors text-sm"
            >
              {formData.id ? "Сохранить изменения" : "Создать карточку"}
            </button>
          ) : (
            <>
              <button 
                onClick={handleOpenEdit}
                className="flex-1 flex items-center justify-center gap-1.5 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white py-1.5 rounded-md font-medium transition-colors border border-zinc-300 dark:border-zinc-700 text-sm"
              >
                <Edit size={14} /> Редактировать
              </button>
              <button 
                onClick={handleDeleteCard}
                className="flex-1 flex items-center justify-center gap-1.5 bg-white dark:bg-zinc-950 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-500 py-1.5 rounded-md font-medium transition-colors border border-zinc-300 dark:border-zinc-800 hover:border-red-200 dark:hover:border-red-900/50 text-sm"
              >
                <Trash2 size={14} /> Удалить
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
