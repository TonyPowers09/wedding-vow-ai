import React from 'https://aistudiocdn.com/react@^19.2.0';

const RingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="12" r="6" />
    <circle cx="15" cy="12" r="6" />
  </svg>
);

const Header: React.FC = () => {
  return (
    <header className="py-6">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center space-y-2">
        <RingsIcon />
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary text-center">
          Wedding Vow AI
        </h1>
        <p className="text-center text-brand-text/80">Craft the perfect words for your perfect day.</p>
      </div>
    </header>
  );
};

export default Header;