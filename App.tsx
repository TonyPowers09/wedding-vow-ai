import { useEffect, useState } from 'react';
import Header from './components/Header.tsx';
import VowGenerator from './components/VowGenerator.tsx';
import Footer from './components/Footer.tsx';
import CatSpotlight from './components/CatSpotlight.tsx';

type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'wedding-vow-theme';

const App = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-background dark:bg-brand-surface-dark text-brand-text dark:text-slate-100 transition-colors duration-300">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
        <div className="w-full flex flex-col gap-8">
          <CatSpotlight />
          <VowGenerator />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
