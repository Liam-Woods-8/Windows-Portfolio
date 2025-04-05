import React, { useEffect, useState } from 'react';

const Footer: React.FC = () => {
  // Get current time in Windows 98 format (HH:MM AM/PM)
  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
  };

  const [time, setTime] = useState(getCurrentTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getCurrentTime());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="win98-window fixed bottom-0 w-full">
      <div className="win98-inset p-1 flex flex-col sm:flex-row justify-between items-center text-sm">
        <div className="flex items-center space-x-4">
          <button className="win98-btn py-0 px-2 flex items-center space-x-1">
            <span className="w-4 h-4 bg-[#000080] inline-block"></span>
            <span className="commodore-text">Start</span>
          </button>
          <div className="win98-inset px-2">
            <span className="commodore-text">© {new Date().getFullYear()} Liam Woods</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <a
            href="https://github.com/Liam-Woods-8?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="win98-btn text-sm commodore-text"
          >
            GitHub.exe
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="win98-btn text-sm commodore-text"
          >
            LinkedIn.exe
          </a>
          <div className="win98-inset px-2">
            <span className="commodore-text">{time}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 