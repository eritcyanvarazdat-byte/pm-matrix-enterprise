import { useState } from 'react';
import { useStore } from '../../store';
import { X, ExternalLink, CheckSquare } from 'lucide-react';

export default function Sidebar() {
  const { isSidebarOpen, selectedCard, closeSidebar } = useStore();
  const [isEditMode, setIsEditMode] = useState(false);

  if (!selectedCard) return null;

  return (
    <>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={closeSidebar}
        />
      )}
      
      <div 
        className={`fixed top-0 right-0 h-full w-96 bg-zinc-900 border-l border-zinc-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 shrink-0">
          <h2 className="font-semibold text-lg text-zinc-100 truncate pr-4">
            {selectedCard.title}
          </h2>
          <button 
            onClick={closeSidebar}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-zinc-800 shrink-0">
          <button 
            className={`flex-1 py-3 text-sm font-medium transition-colors ${!isEditMode ? 'text-[#C91F1F] border-b-2 border-[#C91F1F]' : 'text-zinc-400 hover:text-zinc-200'}`}
            onClick={() => setIsEditMode(false)}
          >
            Просмотр
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-medium transition-colors ${isEditMode ? 'text-[#C91F1F] border-b-2 border-[#C91F1F]' : 'text-zinc-400 hover:text-zinc-200'}`}
            onClick={() => setIsEditMode(true)}
          >
            Редактирование
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!isEditMode ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-2">Описание</h3>
                <p className="text-zinc-200 text-sm leading-relaxed">
                  {selectedCard.desc || 'Нет описания'}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-2">Ссылка</h3>
                <a 
                  href={selectedCard.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[#C91F1F] hover:underline text-sm flex items-center gap-1"
                >
                  {selectedCard.link} <ExternalLink size={14} />
                </a>
              </div>

              <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-3">Чеклист</h3>
                <div className="space-y-2">
                  {selectedCard.checklist.map((item) => (
                    <div key={item.id} className="flex items-start gap-2">
                      <CheckSquare 
                        size={16} 
                        className={`mt-0.5 ${item.completed ? 'text-[#C91F1F]' : 'text-zinc-600'}`} 
                      />
                      <span className={`text-sm ${item.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-zinc-400 text-sm">Форма редактирования в разработке...</p>
              <input 
                type="text" 
                defaultValue={selectedCard.title}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-[#C91F1F]"
              />
              <textarea 
                defaultValue={selectedCard.desc}
                className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-[#C91F1F] resize-none"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
