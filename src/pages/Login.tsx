import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setAuth = useStore(state => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setAuth(true);
      navigate('/board');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">PM Matrix</h1>
          <p className="text-zinc-400 mt-2 text-sm">Войдите в систему для продолжения</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-4 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-[#C91F1F] focus:ring-1 focus:ring-[#C91F1F] transition-all"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-4 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-[#C91F1F] focus:ring-1 focus:ring-[#C91F1F] transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#C91F1F] hover:bg-red-700 text-white font-medium py-2.5 rounded-md transition-colors"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
