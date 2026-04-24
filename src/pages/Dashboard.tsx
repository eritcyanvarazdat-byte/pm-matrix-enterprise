import { useEffect } from 'react';
import { useStore } from '../store';
import TopBar from '../components/features/TopBar';
import MatrixBoard from '../components/features/MatrixBoard';
import Sidebar from '../components/features/Sidebar';
import { mockPhases, mockAreas, mockModules, mockRoles, mockCards } from '../mockData';

export default function Dashboard() {
  const { setDirectories, setCards, phases } = useStore();

  useEffect(() => {
    if (phases.length === 0) {
      setDirectories(mockPhases, mockAreas, mockModules, mockRoles);
      setCards(mockCards);
    }
  }, [phases.length, setDirectories, setCards]);

  return (
    <div className="h-screen w-full bg-zinc-950 flex flex-col overflow-hidden text-zinc-100 relative">
      <TopBar />
      <div className="flex-1 overflow-auto relative">
        <MatrixBoard />
      </div>
      <Sidebar />
    </div>
  );
}
