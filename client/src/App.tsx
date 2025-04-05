import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Home from './pages/Home.tsx';
import Footer from './components/Footer.tsx';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Function to handle loading state changes from Home component
  const handleLoadingChange = (loadingState: boolean) => {
    setIsLoading(loadingState);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {!isLoading && <Navbar />}
      <main className="flex-grow">
        <Home onLoadingChange={handleLoadingChange} />
      </main>
      {!isLoading && <Footer />}
    </div>
  );
}

export default App; 