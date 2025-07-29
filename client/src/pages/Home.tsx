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
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Ensure loading starts properly
  useEffect(() => {
    // Force loading to start if it hasn't already
    if (!loading) {
      setLoading(true);
    }
  }, []);

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
    
    // Force start loading animation if accessed through embedded browsers
    const isEmbeddedBrowser = /(LinkedInApp|FBAN|FBAV|Instagram|Twitter)/i.test(navigator.userAgent);
    
    if (isEmbeddedBrowser) {
      // Start loading immediately for embedded browsers
      setLoading(true);
    }
    
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xkgjqddr', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setFormSubmitted(true);
        form.reset();
        setTimeout(() => setFormSubmitted(false), 3000); // Reset animation after 3 seconds
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
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

  // Fallback for when loading doesn't start properly
  if (!loading && !bootComplete) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-black text-green-500 p-8 font-mono">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Portfolio Loading...</h1>
          <p className="mb-4">If the loading animation doesn't start automatically, click below:</p>
          <button 
            onClick={() => {
              setLoading(true);
              setBootComplete(false);
            }}
            className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-400 transition-colors"
          >
            Start Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-16 win98-scan-effect">
      {/* Hero Section */}
      <section id="home" className="min-h-screen flex flex-col items-center justify-center mb-40 px-4">
        <div className="win98-window w-full max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="win98-title-bar mb-4">
            <span className="commodore-text">welcome.txt</span>
            <div className="win98-title-bar-controls">
              {/* <button className="win98-title-bar-button">_</button>
              <button className="win98-title-bar-button">□</button>
              <button className="win98-title-bar-button">×</button> */}
            </div>
          </div>
          <div className="p-4">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 commodore-text text-[#000080]">
              Welcome to My Portfolio
            </h1>
            <div className="win98-marquee mb-2 win98-inset p-1">
              <div className="win98-marquee-content">
                <span className="win98-text">Welcome to my Portfolio - Check out some of my projects and skills below</span>
              </div>
            </div>
            <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto win98-text">
              I'm a passionate full stackdeveloper with expertise in modern web technologies.
          
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
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section - Windows 98 Explorer Style */}
      <section id="projects" className="py-16 mb-40">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center commodore-text win98-flicker mb-16">My Projects</h2>
          
          <div className="win98-window max-w-4xl mx-auto">
            <div className="win98-title-bar">
              <span className="commodore-text">C:\My Projects\</span>
              <div className="win98-title-bar-controls">
                {/* <button className="win98-title-bar-button">_</button>
                <button className="win98-title-bar-button">□</button>
                <button className="win98-title-bar-button">×</button> */}
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
                {/* <div 
                  className={`pl-2 py-1 flex items-center cursor-pointer ${activeFolder === 'archives' ? 'bg-[#000080] text-white' : 'hover:bg-[#e0e0e0]'}`}
                  onClick={() => toggleFolder('archives')}
                >
                  <img 
                    src="https://win98icons.alexmeub.com/icons/png/directory_closed-0.png" 
                    alt="Folder" 
                    className="w-4 h-4 mr-2" 
                  />
                  <span className="win98-text">Archives</span>
                </div> */}
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
                      <p className="text-xs text-center mt-1 text-gray-600">APIs & Async JS</p>
                    </div>
                    <div onClick={() => handleProjectClick('https://liam-woods-8.github.io/Eko/home.html', 'Eko')} 
                         className="flex flex-col items-center justify-center cursor-pointer hover:bg-[#e0e0e0] p-2">
                      <img 
                        src="/directory_closed-4.png" 
                        alt="Project 2" 
                        className="w-12 h-12 mb-1" 
                      />
                      <span className="win98-text text-center">Project 2.exe</span>
                      <span className="win98-blink mt-1 inline-block ml-2">
                        <span className="bg-yellow-300 px-1 text-xs">New!</span>
                      </span>
                      <p className="text-xs text-center mt-1 text-gray-600">APIs & Async JS</p>
                    </div>
                    <div onClick={() => handleProjectClick('#', 'Project 3')} 
                         className="flex flex-col items-center justify-center cursor-pointer hover:bg-[#e0e0e0] p-2">
                      <img 
                        src="https://win98icons.alexmeub.com/icons/png/compressed_folder-0.png" 
                        alt="Coming Soon" 
                        className="w-12 h-12 mb-1" 
                      />
                      <span className="win98-text text-center">Coming Soon.exe</span>
                      <p className="text-xs text-center mt-1 text-gray-600">Under Development</p>
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
      <section id="skills" className="py-16 mb-40 bg-[#c0c0c0]">
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
      <section id="contact" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center commodore-text mb-16">Contact Me</h2>
          <div className="max-w-md mx-auto win98-window p-4">
            <div className="win98-title-bar mb-4">
              <span className="commodore-text">contact.exe</span>
              <div className="win98-title-bar-controls">
                {/* <button className="win98-title-bar-button">_</button>
                <button className="win98-title-bar-button">□</button>
                <button className="win98-title-bar-button">×</button> */}
              </div>
            </div>
            <form onSubmit={handleSubmit} action="https://formspree.io/f/xkgjqddr" method="POST" className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium win98-text">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="mt-1 block w-full win98-inset p-1 focus:outline-none win98-text"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium win98-text">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full win98-inset p-1 focus:outline-none win98-text"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium win98-text">Message:</label>
                <textarea
                  id="message"
                  name="message"
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
              {formSubmitted && (
                <div className="win98-animation mt-4">
                  <span className="commodore-text">Message Sent!</span>
                </div>
              )}
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
                    target.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAbwAAAG8B8aLcQwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3Njape.org5vuPBoAAAG+SURBVDiNnZK9S1thFMZ/9+bGm6TaEIODXbpoXISutUPoIAFp6dChkx0KwcGtf0K7ZnHQqYvQTYciiCCdRBcpxWIVFUxpvtX74ftw6A00Mclz4HDgPc/vPO/7nFfcPX6itdaXZVkjpXTXe/8YeAp8B74APbvdvp7NZr9SShkKKSWXUspF+AJ8Bl4AL0WkEUK4n8/n747H4++7u7v9lFJRQNoJvAoh4O4sLy8vR6PRO6ABfAJ+7O/vD2u12lsRGZdz3gLw3hNjJITA9PT0FEBEJLz3jcFgsLS5uTk8ODiYAW6GEHKWZZEQAgAaY3wrIvPFaAgxRgBCCJfDw8NnwFvgWp7n1xqNxtzGxsYl8BFYcc5djDEOQghRRLwA2NvbqwKvgOVer/cBWBSRezHGx3Nzc7da63PAOvC8Xq9/VUqhAFRrfQd4HUJoiMiMMWZBKXXfWrtYqVQemJm2tfZ2Pp9/opRqaq3xxeJwOAQwxWLx8fj9YDCgXC4PsyxrK6UupJQ6Zr1et0qpEWCBz977X6VSqQxUrLVVY8xfpdSlUqrjnDtl+kfnHM1ms12tVp3W+hgoFIvFUqfTeQ/8YeLk/JcXAPwDwGD5Vm5vra0AAAAASUVORK5CYII=";
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

// Add CSS for the Windows 98 animation
const win98Animation = `
  .win98-animation {
    animation: win98-flicker 2s linear infinite;
    background-color: #c0c0c0;
    border: 2px solid #000080;
    padding: 10px;
    text-align: center;
    font-family: 'Commodore64', var(--win98-font);
  }
`;

// Inject the CSS into the document
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(win98Animation, styleSheet.cssRules.length);

export default Home; 