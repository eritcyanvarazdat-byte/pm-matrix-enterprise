import { useFirebaseSync } from '../hooks/useFirebaseSync';
import TopBar from '../components/features/TopBar';
import MatrixBoard from '../components/features/MatrixBoard';
import Sidebar from '../components/features/Sidebar';
import SettingsModal from '../components/features/SettingsModal';

export default function Dashboard() {
  const { isReady } = useFirebaseSync();

  if (!isReady) {
    return (
      <div className="h-screen w-full bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
        Загрузка базы данных...
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-zinc-50 dark:bg-zinc-950 flex flex-col overflow-hidden text-zinc-900 dark:text-zinc-100 relative transition-colors duration-200">
      <TopBar />
      <div className="flex-1 overflow-auto relative">
        <MatrixBoard />
      </div>
      <Sidebar />
      <SettingsModal />
    </div>
  );
}
