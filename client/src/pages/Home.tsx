import React, { useState, useEffect, ReactNode } from 'react';

interface HomeProps {
  onLoadingChange?: (loading: boolean) => void;
}

const Home: React.FC<HomeProps> = ({ onLoadingChange }) => {
  const [loading, setLoading] = useState(true);
  const [bootComplete, setBootComplete] = useState(false);
  const [showError, setShowError] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [typedCommands, setTypedCommands] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState(0);
  const [skillsLoaded, setSkillsLoaded] = useState(false);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [showProjectLoading, setShowProjectLoading] = useState(false);
  const [loadingProjectName, setLoadingProjectName] = useState('');
  const fullText = "C:\\>Starting Windows...";
  const terminalCommands = [
    "$ ls -la",
    "$ cd /home/user/portfolio",
    "$ cat welcome.txt",
    "$ ./start_portfolio.sh"
  ];
  const terminalOutputs = [
    "total 20\ndrwxr-xr-x 5 user user 4096 Oct 15 21:34 .\ndrwxr-xr-x 3 user user 4096 Oct 15 20:12 ..\n-rw-r--r-- 1 user user 2048 Oct 15 21:33 portfolio.zip\ndrwxr-xr-x 2 user user 4096 Oct 15 21:30 projects\n-rwxr-xr-x 1 user user 1024 Oct 15 21:32 start_portfolio.sh\n-rw-r--r-- 1 user user  512 Oct 15 21:31 welcome.txt",
    "portfolio $ ",
    "Welcome to my portfolio! Initializing interface...",
    "Initializing portfolio interface...\nLoading components...\nEstablishing connection...\nRendering frontend..."
  ];

  // Create progress bar segments function
  const renderProgressSegments = (percentage: number): ReactNode[] => {
    const segments: ReactNode[] = [];
    const totalSegments = Math.floor(percentage / 10);
    
    for (let i = 0; i < totalSegments; i++) {
      segments.push(<div key={i} className="win98-progress-segment"></div>);
    }
    
    return segments;
  };

  const toggleFolder = (folder: string) => {
    if (activeFolder === folder) {
      setActiveFolder(null);
    } else {
      setActiveFolder(folder);
    }
  };

  const handleProjectClick = (url: string, projectName: string) => {
    setShowProjectLoading(true);
    setLoadingProjectName(projectName);
    
    // Simulate loading for 1.5 seconds before navigating
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
      setShowProjectLoading(false);
    }, 1500);
  };

  useEffect(() => {
    // Notify parent component of loading state changes
    onLoadingChange?.(loading);
    
    // Simulate Windows boot sequence
    const bootTimer = setTimeout(() => {
      setLoading(false);
      setBootComplete(true);
    }, 5000);

    // Typewriter effect for terminal commands
    let commandIndex = 0;
    let charIndex = 0;
    
    const typeCommandTimer = setInterval(() => {
      if (commandIndex < terminalCommands.length) {
        const currentCommand = terminalCommands[commandIndex];
        if (currentCommand && charIndex < currentCommand.length) {
          setTypedCommands(prev => {
            const updated = [...prev];
            if (!updated[commandIndex]) updated[commandIndex] = '';
            updated[commandIndex] = currentCommand.substring(0, charIndex + 1);
            return updated;
          });
          charIndex++;
        } else {
          // Add delay before moving to next command
          setTimeout(() => {
            setCurrentCommand(prev => prev + 1);
            commandIndex++;
            charIndex = 0;
          }, 500);
        }
      }
    }, 100);

    // Set skills to load when scrolled into view
    const handleScroll = () => {
      const skillsSection = document.getElementById('skills');
      if (skillsSection) {
        const rect = skillsSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          setSkillsLoaded(true);
          window.removeEventListener('scroll', handleScroll);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(bootTimer);
      clearInterval(typeCommandTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, onLoadingChange]);

  const handleErrorClick = () => {
    setShowError(true);
    setTimeout(() => setShowError(false), 500);
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col justify-start bg-black text-green-500 p-8 font-mono terminal-screen overflow-hidden">
        <div className="scanlines absolute inset-0 pointer-events-none"></div>
        <div className="terminal-glow absolute inset-0 pointer-events-none"></div>
        <div className="terminal-container flex-grow overflow-auto">
          <div className="mb-4">
            <p className="text-green-400 opacity-90">[system] Linux 2.6.32 (tty1)</p>
            <p className="text-green-400 opacity-90">Last login: {new Date().toLocaleString()} from localhost</p>
            <p className="mb-6 text-green-400 opacity-90">PORTFOLIO-OS v1.0.3 / (c) {new Date().getFullYear()} Liam</p>
          </div>
          
          {typedCommands.map((command, index) => (
            <div key={index} className="mb-4">
              <p className="text-green-400">liam@portfolio:~$ {command && typeof command === 'string' ? command.replace('$ ', '') : command}</p>
              {index < currentCommand && (
                <pre className="text-green-300 ml-2 text-sm whitespace-pre-wrap">{terminalOutputs[index]}</pre>
              )}
            </div>
          ))}
          
          <div className="flex items-center">
            <span className="text-green-400 mr-0">liam@portfolio:~$ </span>
            <span className="text-green-400">{typedCommands.length < terminalCommands.length ? '' : 'Loading portfolio...'}</span>
            <span className="terminal-cursor animate-blink">█</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-16 win98-scan-effect">
      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center mb-80">
        <div className="win98-window max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="win98-title-bar mb-4">
            <span className="commodore-text">welcome.txt</span>
            <div className="win98-title-bar-controls">
              <button className="win98-title-bar-button">_</button>
              <button className="win98-title-bar-button">□</button>
              <button className="win98-title-bar-button">×</button>
            </div>
          </div>
          <div className="p-4">
            <h1 className="text-4xl font-bold mb-6 commodore-text text-[#000080]">
              Welcome to My Portfolio
            </h1>
            <div className="win98-marquee mb-2 win98-inset p-1">
              <div className="win98-marquee-content">
                <span className="win98-text">Welcome to my retro Windows portfolio - check out my projects and skills!</span>
              </div>
            </div>
            <p className="text-xl mb-8 max-w-2xl mx-auto win98-text">
              I'm a passionate developer with expertise in modern web technologies.
              Let's build something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary"
              >
                View My Work
              </button>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary"
              >
                Get in Touch
              </button>
              <button 
                onClick={handleErrorClick}
                className={`btn-primary ${showError ? 'win98-error' : ''}`}
              >
                <span className="commodore-text">!</span> Click Me
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section - Windows 98 Explorer Style */}
      <section id="projects" className="py-32 mb-80">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center commodore-text win98-flicker mb-16">My Projects</h2>
          
          <div className="win98-window max-w-4xl mx-auto">
            <div className="win98-title-bar">
              <span className="commodore-text">C:\My Projects\</span>
              <div className="win98-title-bar-controls">
                <button className="win98-title-bar-button">_</button>
                <button className="win98-title-bar-button">□</button>
                <button className="win98-title-bar-button">×</button>
              </div>
            </div>
            
            {/* Explorer Menu Bar */}
            <div className="bg-[#c0c0c0] px-2 py-1 border-b border-[#808080]">
              <div className="flex space-x-4 win98-text">
                <span className="cursor-pointer">File</span>
                <span className="cursor-pointer">Edit</span>
                <span className="cursor-pointer">View</span>
                <span className="cursor-pointer">Help</span>
              </div>
            </div>
            
            {/* Explorer Navigation */}
            <div className="flex">
              {/* Left Panel - Folders */}
              <div className="w-1/4 bg-white border-r border-[#808080] p-2">
                <div className="win98-text font-bold mb-2">Folders:</div>
                <div 
                  className={`pl-2 py-1 flex items-center cursor-pointer ${activeFolder === 'projects' ? 'bg-[#000080] text-white' : 'hover:bg-[#e0e0e0]'}`}
                  onClick={() => toggleFolder('projects')}
                >
                  <img 
                    src="https://win98icons.alexmeub.com/icons/png/directory_closed-0.png" 
                    alt="Folder" 
                    className="w-4 h-4 mr-2"
                  />
                  <span className="win98-text">Projects</span>
                </div>
                <div 
                  className={`pl-2 py-1 flex items-center cursor-pointer ${activeFolder === 'archives' ? 'bg-[#000080] text-white' : 'hover:bg-[#e0e0e0]'}`}
                  onClick={() => toggleFolder('archives')}
                >
                  <img 
                    src="https://win98icons.alexmeub.com/icons/png/directory_closed-0.png" 
                    alt="Folder" 
                    className="w-4 h-4 mr-2" 
                  />
                  <span className="win98-text">Archives</span>
                </div>
              </div>
              
              {/* Right Panel - Files */}
              <div className="w-3/4 bg-white p-4">
                {activeFolder === 'projects' && (
                  <div className="grid grid-cols-3 gap-4">
                    <div onClick={() => handleProjectClick('https://liam-woods-8.github.io/TravelExplorer/home.html', 'Travel Explorer')} 
                         className="flex flex-col items-center justify-center cursor-pointer hover:bg-[#e0e0e0] p-2">
                      <img 
                        src="/globe.png" 
                        alt="Travel Explorer" 
                        className="w-12 h-12 mb-1" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "https://win98icons.alexmeub.com/icons/png/earth-0.png";
                        }}
                      />
                      <span className="win98-text text-center">TravelExplorer.html</span>
                      <span className="win98-blink mt-1 inline-block">
                        <span className="bg-yellow-300 px-1 text-xs">New!</span>
                      </span>
                      <p className="text-xs text-center mt-1 text-gray-600">APIs & Async JS</p>
                    </div>
                    <div onClick={() => handleProjectClick('#', 'Project 2')} 
                         className="flex flex-col items-center justify-center cursor-pointer hover:bg-[#e0e0e0] p-2">
                      <img 
                        src="https://win98icons.alexmeub.com/icons/png/application_executable-0.png" 
                        alt="Project 2" 
                        className="w-12 h-12 mb-1" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAEsAAABLAEEj9nEAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAMBQTFRF////AP//AMz/AJn/AJnMAJnMmf//mczMmcyZmZmZmcxmmcxmZsyZZsxmZpmZZplmZmZmZsxmMcyZMcxmMZlmMWZmMWYzMTMzM5lmM2ZmM2YzMzMzAJlmAGZmAGYzACQkAAAAAAAzAAAkgICAmZmZgICAgGZmmWZmgGZmZmZmgDMzZjMzZgAAMzMzZgAzMwAAJCQkQEBAMwAAJAAzJAAkAAAkAAAAJCQAEhISAAAAAAA1NTUAKioqAAAAExMTDQ0NDAwMCgoK6x05LAAAADx0Uk5TAAECBAYKDBEUFRYXGh4hJCUmJygpKy0wNjg+QUJFRlJVW19na3V5e3+Bh4+ZnaCkp7K4vcDFy9ne6+zv8OGVIJUAAAFKSURBVDiNrZPrVsIwEIUPAlILCCgoYC0S5aI0ECgCVbmo7/9SJpemLWcP/tjs2W+TnZnNbJR/Sq1RKrx55+3r84v/ynv+WlnPQhKQpF9OGlkDWfH7gPxVlkAqXwLQdRgMRKPvA5BbLgFdh8HgGLAEoJO+FHAMANUl8C8AVZsexwhNEWx8DhiE/gXQCd9OVID0A0oCGRIGfwEOBZQ9UrJz3E61QEZwE3L6XQSsP8CdOk5i+L4xUhSTCRf42nU4gAMUGdJFCbJZqM1G5lxOJlH8VQBGA2i2NYAvoTUazGb22UZoKo7ADMI52vZ2pTNJrZbQwL2Owew/LVdS99aaLsZhz4HXAED4ZaBv7VchxxgbFQQADwA1OzaWWb9w971jQPYCHAaVfeFZVmyOXb38+PeWAVYDRYXV9tz+b+C+AaWL0KLLjiuaQAAAABJRU5ErkJggg==";
                        }}
                      />
                      <span className="win98-text text-center">Project 2.exe</span>
                    </div>
                    <div onClick={() => handleProjectClick('#', 'Project 3')} 
                         className="flex flex-col items-center justify-center cursor-pointer hover:bg-[#e0e0e0] p-2">
                      <img 
                        src="https://win98icons.alexmeub.com/icons/png/colors-0.png" 
                        alt="Project 3" 
                        className="w-12 h-12 mb-1" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "data:image/png;base64,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";
                        }}
                      />
                      <span className="win98-text text-center">Project 3.bin</span>
                      <span className="win98-blink mt-1 inline-block">
                        <span className="bg-yellow-300 px-1 text-xs">New!</span>
                      </span>
                    </div>
                  </div>
                )}
                
                {activeFolder === 'archives' && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center justify-center cursor-pointer hover:bg-[#e0e0e0] p-2">
                      <img 
                        src="https://win98icons.alexmeub.com/icons/png/compressed_folder-0.png" 
                        alt="Archive 1" 
                        className="w-12 h-12 mb-1" 
                      />
                      <span className="win98-text text-center">Archive 1.zip</span>
                    </div>
                    <div className="flex flex-col items-center justify-center cursor-pointer hover:bg-[#e0e0e0] p-2">
                      <img 
                        src="https://win98icons.alexmeub.com/icons/png/compressed_folder-0.png" 
                        alt="Archive 2" 
                        className="w-12 h-12 mb-1" 
                      />
                      <span className="win98-text text-center">Archive 2.zip</span>
                    </div>
                  </div>
                )}
                
                {!activeFolder && (
                  <div className="flex flex-col items-center justify-center h-full">
                    <img 
                      src="https://win98icons.alexmeub.com/icons/png/directory_explorer-0.png" 
                      alt="Explorer" 
                      className="w-16 h-16 mb-4" 
                    />
                    <p className="win98-text text-center">Please select a folder from the left panel</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Status Bar */}
            <div className="bg-[#c0c0c0] border-t border-[#808080] p-1 flex justify-between">
              <span className="win98-text text-sm">{activeFolder ? `${activeFolder === 'projects' ? '3' : '2'} object(s)` : '0 objects'}</span>
              <span className="win98-text text-sm">{Math.floor(Math.random() * 100)}MB free of 2.1GB</span>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 mb-80 bg-[#c0c0c0]">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center commodore-text mb-16">My Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="card text-center">
              <div className="win98-title-bar mb-2">
                <span className="commodore-text">frontend.dll</span>
              </div>
              <h3 className="text-xl font-bold mb-2 commodore-text">Frontend</h3>
              <p className="text-black win98-text mb-2">React, TypeScript, Tailwind</p>
              <div className="win98-progress-bar mt-2 relative">
                <div className="win98-progress-segments" style={{ opacity: skillsLoaded ? 1 : 0, transition: 'opacity 1s ease-in-out' }}>
                  {skillsLoaded && renderProgressSegments(80)}
                </div>
                <div className="win98-progress-text">80%</div>
              </div>
            </div>
            <div className="card text-center">
              <div className="win98-title-bar mb-2">
                <span className="commodore-text">backend.dll</span>
              </div>
              <h3 className="text-xl font-bold mb-2 commodore-text">Backend</h3>
              <p className="text-black win98-text mb-2">Node.js, Express, MongoDB</p>
              <div className="win98-progress-bar mt-2 relative">
                <div className="win98-progress-segments" style={{ opacity: skillsLoaded ? 1 : 0, transition: 'opacity 1s ease-in-out' }}>
                  {skillsLoaded && renderProgressSegments(75)}
                </div>
                <div className="win98-progress-text">75%</div>
              </div>
            </div>
            <div className="card text-center">
              <div className="win98-title-bar mb-2">
                <span className="commodore-text">tools.dll</span>
              </div>
              <h3 className="text-xl font-bold mb-2 commodore-text">Tools</h3>
              <p className="text-black win98-text mb-2">Git, VS Code, Docker</p>
              <div className="win98-progress-bar mt-2 relative">
                <div className="win98-progress-segments" style={{ opacity: skillsLoaded ? 1 : 0, transition: 'opacity 1s ease-in-out' }}>
                  {skillsLoaded && renderProgressSegments(90)}
                </div>
                <div className="win98-progress-text">90%</div>
              </div>
            </div>
            <div className="card text-center">
              <div className="win98-title-bar mb-2">
                <span className="commodore-text">softskills.dll</span>
              </div>
              <h3 className="text-xl font-bold mb-2 commodore-text">Soft Skills</h3>
              <p className="text-black win98-text mb-2">Communication, Teamwork, Problem-solving</p>
              <div className="win98-progress-bar mt-2 relative">
                <div className="win98-progress-segments" style={{ opacity: skillsLoaded ? 1 : 0, transition: 'opacity 1s ease-in-out' }}>
                  {skillsLoaded && renderProgressSegments(85)}
                </div>
                <div className="win98-progress-text">85%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center commodore-text mb-16">Contact Me</h2>
          <div className="max-w-md mx-auto win98-window p-4">
            <div className="win98-title-bar mb-4">
              <span className="commodore-text">contact.exe</span>
              <div className="win98-title-bar-controls">
                <button className="win98-title-bar-button">_</button>
                <button className="win98-title-bar-button">□</button>
                <button className="win98-title-bar-button">×</button>
              </div>
            </div>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium win98-text">Name:</label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full win98-inset p-1 focus:outline-none win98-text"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium win98-text">Email:</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full win98-inset p-1 focus:outline-none win98-text"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium win98-text">Message:</label>
                <textarea
                  id="message"
                  rows={4}
                  className="mt-1 block w-full win98-inset p-1 focus:outline-none win98-text"
                />
              </div>
              <button
                type="submit"
                className="btn-primary w-full commodore-text"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Windows Error Dialog */}
      {showError && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="win98-window win98-error">
            <div className="win98-title-bar">
              <span className="commodore-text">Error</span>
              <div className="win98-title-bar-controls">
                <button className="win98-title-bar-button" onClick={() => setShowError(false)}>×</button>
              </div>
            </div>
            <div className="p-4 flex items-start">
              <div className="mr-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <p className="win98-text mb-4">This portfolio is too cool! Retro overload detected.</p>
                <div className="flex justify-end">
                  <button className="win98-btn" onClick={() => setShowError(false)}>OK</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Loading Dialog */}
      {showProjectLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="win98-window max-w-sm">
            <div className="win98-title-bar">
              <span className="commodore-text">Opening {loadingProjectName}</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center bg-[#c0c0c0]">
              <div className="flex items-center mb-3">
                <img 
                  src="https://win98icons.alexmeub.com/icons/png/hourglass-0.png" 
                  alt="Loading" 
                  className="w-8 h-8 mr-2 animate-pulse"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAbwAAAG8B8aLcQwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAG+SURBVDiNnZK9S1thFMZ/9+bGm6TaEIODXbpoXISutUPoIAFp6dChkx0KwcGtf0K7ZnHQqYvQTYciiCCdRBcpxWIVFUxpvtX74ftw6A00Mclz4HDgPc/vPO/7nFfcPX6itdaXZVkjpXTXe/8YeAp8B74APbvdvp7NZr9SShkKKSWXUspF+AJ8Bl4AL0WkEUK4n8/n747H4++7u7v9lFJRQNoJvAoh4O4sLy8vR6PRO6ABfAJ+7O/vD2u12lsRGZdz3gLw3hNjJITA9PT0FEBEJLz3jcFgsLS5uTk8ODiYAW6GEHKWZZEQAgAaY3wrIvPFaAgxRgBCCJfDw8NnwFvgWp7n1xqNxtzGxsYl8BFYcc5djDEOQghRRLwA2NvbqwKvgOVer/cBWBSRezHGx3Nzc7da63PAOvC8Xq9/VUqhAFRrfQd4HUJoiMiMMWZBKXXfWrtYqVQemJm2tfZ2Pp9/opRqaq3xxeJwOAQwxWLx8fj9YDCgXC4PsyxrK6UupJQ6Zr1et0qpEWCBz977X6VSqQxUrLVVY8xfpdSlUqrjnDtl+kfnHM1ms12tVp3W+hgoFIvFUqfTeQ/8YeLk/JcXAPwDwGD5Vm5vra0AAAAASUVORK5CYII=";
                  }}
                />
                <p className="win98-text">Please wait...</p>
              </div>
              <div className="win98-progress-bar w-full">
                <div className="win98-progress-fill animate-progress"></div>
              </div>
              <div className="mt-2 win98-text">
                Opening project in your browser
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 