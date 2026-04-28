import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ui/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useStore } from './store';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';

export default function App() {
  const { theme, isAuthChecking, setIsAuthChecking, setAuth } = useStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const isDemo = import.meta.env.VITE_FIREBASE_API_KEY === 'your_api_key_here';
    if (isDemo) {
      setAuth(true);
      setIsAuthChecking(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuth(!!user);
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, [setAuth, setIsAuthChecking]);

  if (isAuthChecking) {
    return (
      <div className="h-screen w-full bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
        Проверка авторизации...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/board" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/board" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
