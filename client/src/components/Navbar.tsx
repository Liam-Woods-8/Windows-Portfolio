import React from 'react';

const Navbar: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="win98-window fixed w-full z-10">
      <div className="win98-title-bar">
        <span className="commodore-text">Liam Woods - Portfolio.exe</span>
        <div className="win98-title-bar-controls">
          <button className="win98-title-bar-button">_</button>
          <button className="win98-title-bar-button">□</button>
          <button className="win98-title-bar-button">×</button>
        </div>
      </div>
      <div className="bg-[#c0c0c0] p-1">
        <div className="flex space-x-2">
          <button 
            onClick={() => scrollToSection('home')}
            className="win98-btn text-sm"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('projects')}
            className="win98-btn text-sm"
          >
            Projects
          </button>
          <button 
            onClick={() => scrollToSection('skills')}
            className="win98-btn text-sm"
          >
            Skills
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="win98-btn text-sm"
          >
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 