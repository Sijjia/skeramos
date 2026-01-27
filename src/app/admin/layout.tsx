'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

const MENU_ITEMS = [
  { href: '/admin', label: 'Главная', icon: '🏠' },
  { href: '/admin/masterclasses', label: 'Мастер-классы', icon: '🎨' },
  { href: '/admin/rooms', label: 'Номера', icon: '🛏️' },
  { href: '/admin/gallery', label: 'Галерея', icon: '🖼️' },
  { href: '/admin/reviews', label: 'Отзывы', icon: '⭐' },
  { href: '/admin/settings', label: 'Настройки', icon: '⚙️' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth');
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
      return data.authenticated;
    } catch {
      setIsAuthenticated(false);
      return false;
    }
  };

  const login = async (password: string) => {
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setIsAuthenticated(false);
    router.push('/admin');
  };

  useEffect(() => {
    checkAuth().finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
        <LoginPage />
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
      <div className="min-h-screen bg-neutral-900 flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } bg-neutral-800 border-r border-neutral-700 transition-all duration-300 flex flex-col`}
        >
          {/* Logo */}
          <div className="p-4 border-b border-neutral-700 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <span className="text-2xl">🏺</span>
              {sidebarOpen && (
                <span className="text-white font-bold text-lg">Skeramos</span>
              )}
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-neutral-400 hover:text-white p-1"
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-2">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-green-600 text-white'
                    : 'text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-neutral-700">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-4 py-2 text-neutral-400 hover:text-white transition-colors"
            >
              <span>🌐</span>
              {sidebarOpen && <span>Открыть сайт</span>}
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
            >
              <span>🚪</span>
              {sidebarOpen && <span>Выйти</span>}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </AuthContext.Provider>
  );
}

function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(password);
    if (!success) {
      setError('Неверный пароль');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-neutral-800 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <span className="text-5xl mb-4 block">🏺</span>
            <h1 className="text-2xl font-bold text-white">Skeramos Admin</h1>
            <p className="text-neutral-400 mt-2">Войдите для управления сайтом</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-neutral-300 mb-2">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
                placeholder="Введите пароль"
                required
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg font-medium transition-colors"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
