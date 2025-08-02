import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Home from './pages/Home.tsx';
import Footer from './components/Footer.tsx';

function App() {
  const [isLoading, setIsLoading] = useState(false); // Start with false to show content immediately

  // Function to handle loading state changes from Home component
  const handleLoadingChange = (loadingState: boolean) => {
    setIsLoading(loadingState);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Home onLoadingChange={handleLoadingChange} />
      </main>
      <Footer />
    </div>
  );
}

export default App; 