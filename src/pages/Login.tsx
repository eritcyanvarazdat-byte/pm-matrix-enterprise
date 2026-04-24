import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useStore } from '../store';

export default function Login() {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (import.meta.env.VITE_FIREBASE_API_KEY === 'your_api_key_here') {
      setAuth(true);
      navigate('/board');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, emailInput, passwordInput);
      navigate('/board');
    } catch (error) {
      alert('Неверная почта или пароль!');
      setPasswordInput('');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-3 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-6 flex flex-col items-center transition-colors duration-200">
        
        {/* Old SVG Logo */}
        <div className="mb-4 w-44">
          <svg viewBox="0 0 559.5 197.8" className="w-full h-auto">
            <path fill="#C91F1F" d="M464.1,6.9l-64.3,118.7c-0.2,0.4-0.8,0.3-0.8-0.1L378.7,7c0-0.2-0.2-0.4-0.4-0.4h-89.6c-0.2,0-0.4,0.2-0.4,0.4 l-33.7,181.9c-0.1,0.3,0.2,0.5,0.4,0.5h61c0.2,0,0.4-0.2,0.4-0.4l21.5-116c0.1-0.5,0.8-0.5,0.9,0l21.3,116c0,0.2,0.2,0.4,0.4,0.4 h54.2c0.2,0,0.3-0.1,0.4-0.2L479.5,73c0.2-0.4,0.9-0.2,0.8,0.3L459,188.9c-0.1,0.3,0.2,0.5,0.4,0.5h61c0.2,0,0.4-0.2,0.4-0.4 L554.5,7.2c0.1-0.3-0.2-0.5-0.4-0.5h-89.5C464.4,6.6,464.2,6.7,464.1,6.9"/>
            <path fill="#C91F1F" d="M191.7,6.6H62.3c-0.2,0-0.4,0.2-0.4,0.4L46.4,90.7H11.9c-0.2,0-0.4,0.2-0.4,0.4L3.9,132 c-0.1,0.3,0.2,0.5,0.4,0.5h33.9h0.4H86c0.5,0,0.6,0.7,0.1,0.9c-9.4,2.5-36.3,9.7-46.5,12.3c-2.2,0.6-3.9,2.4-4.3,4.6 c-1.8,9.6-6.4,34.7-7.2,38.6c-0.1,0.3,0.2,0.5,0.4,0.5h61c0.2,0,0.4-0.2,0.4-0.4l10.5-56.6H161c50.4,0,86.4-18,94.9-64 C262.9,31.2,242.1,6.6,191.7,6.6 M193,68.5c-2.6,14.1-12.2,22.2-31.5,22.2h-53.3l7.7-41.8h53.3C187.5,48.9,195.7,54.2,193,68.5"/>
          </svg>
        </div>

        <div className="mb-5 text-center w-full">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Вход в систему</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 w-full">
          <div>
            <input
              type="email"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#C91F1F] focus:ring-1 focus:ring-[#C91F1F] transition-all"
              placeholder="Email..."
              required
              autoFocus
            />
          </div>
          <div>
            <input
              type="password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#C91F1F] focus:ring-1 focus:ring-[#C91F1F] transition-all"
              placeholder="Пароль..."
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#C91F1F] hover:bg-red-700 text-white font-medium py-2 rounded-md transition-colors"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
