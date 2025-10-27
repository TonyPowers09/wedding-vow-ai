type HeaderProps = {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};

const RingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-primary dark:text-brand-secondary transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="12" r="6" />
    <circle cx="15" cy="12" r="6" />
  </svg>
);

const Header = ({ theme, onToggleTheme }: HeaderProps) => {
  const isDark = theme === 'dark';

  return (
    <header className="py-6">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center space-y-3 text-center">
        <div className="flex items-center gap-3">
          <RingsIcon />
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary dark:text-brand-secondary transition-colors">
            Wedding Vow AI
          </h1>
        </div>
        <p className="text-center text-brand-text/80 dark:text-slate-300">
          Craft the perfect words for your perfect day.
        </p>
        <button
          type="button"
          onClick={onToggleTheme}
          aria-pressed={isDark}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-white/80 dark:bg-brand-muted-dark/80 border border-brand-accent dark:border-slate-700 shadow-sm hover:shadow-md transition-all text-brand-text dark:text-slate-100 backdrop-blur"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary/20 dark:bg-brand-secondary/20">
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-brand-secondary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 15a5 5 0 0 0 4.546-7.014A6 6 0 1 1 5.014 4.454 5 5 0 0 0 10 15Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-brand-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 15.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Zm0 1.5a1 1 0 0 1 1 1v.5a1 1 0 1 1-2 0V18a1 1 0 0 1 1-1ZM10 0a1 1 0 0 1 1 1v.5a1 1 0 1 1-2 0V1a1 1 0 0 1 1-1Zm10 9a1 1 0 0 1-1 1h-.5a1 1 0 0 1 0-2H19a1 1 0 0 1 1 1ZM2.5 10a1 1 0 0 1-1 1H1a1 1 0 1 1 0-2h.5a1 1 0 0 1 1 1Zm13.657-6.343a1 1 0 0 1 1.414 0l.354.353a1 1 0 1 1-1.414 1.415l-.354-.354a1 1 0 0 1 0-1.414Zm-11.314 0a1 1 0 0 1 0 1.414L4.49 5.07a1 1 0 0 1-1.414-1.414l.353-.353a1 1 0 0 1 1.414 0Zm12.021 12.021a1 1 0 0 1 0 1.414l-.353.353a1 1 0 0 1-1.414-1.414l.353-.353a1 1 0 0 1 1.414 0Zm-12.728 0a1 1 0 0 1 1.414 0l.354.353a1 1 0 1 1-1.414 1.414l-.354-.353a1 1 0 0 1 0-1.414Z" />
              </svg>
            )}
          </span>
          {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </div>
    </header>
  );
};

export default Header;
