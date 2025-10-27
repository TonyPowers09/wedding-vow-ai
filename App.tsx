import React from 'https://aistudiocdn.com/react@^19.2.0';
import Header from './components/Header.tsx';
import VowGenerator from './components/VowGenerator.tsx';
import Footer from './components/Footer.tsx';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-brand-text">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
        <VowGenerator />
      </main>
      <Footer />
    </div>
  );
};

export default App;