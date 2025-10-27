
import React from 'react';
import Header from './components/Header';
import VowGenerator from './components/VowGenerator';
import Footer from './components/Footer';

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
