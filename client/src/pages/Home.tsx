import React, { useState, useEffect, ReactNode } from 'react';

interface HomeProps {
  onLoadingChange?: (loading: boolean) => void;
}

const Home: React.FC<HomeProps> = ({ onLoadingChange }) => {
  const [bootComplete, setBootComplete] = useState(false);
  const [typedCommands, setTypedCommands] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState(0);
  const [skillsLoaded, setSkillsLoaded] = useState(false);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const terminalCommands = [
    "Initializing portfolio interface...",
    "Loading components...",
    "Establishing connection...",
    "Rendering frontend..."
  ];

  const terminalOutputs = [
    "✓ Interface initialized successfully\n✓ Components loaded\n✓ Connection established\n✓ Frontend rendered",
    "✓ Components loaded\n✓ Connection established\n✓ Frontend rendered",
    "✓ Connection established\n✓ Frontend rendered",
    "✓ Frontend rendered"
  ];

  // Initialize the component
  useEffect(() => {
    // Notify parent component that we're ready
    onLoadingChange?.(false);
    
    // Start the boot sequence for visual effect only
    const bootTimer = setTimeout(() => {
      setBootComplete(true);
    }, 2500);

    // Typewriter effect - faster
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
          setTimeout(() => {
            setCurrentCommand(prev => prev + 1);
            commandIndex++;
            charIndex = 0;
          }, 150);
        }
      }
    }, 50);

    // Skills loading
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
  }, [onLoadingChange]);

  // Create progress bar segments function
  const renderProgressSegments = (percentage: number): ReactNode[] => {
    const segments = [];
    const totalSegments = 20;
    const filledSegments = Math.floor((percentage / 100) * totalSegments);
    
    for (let i = 0; i < totalSegments; i++) {
      segments.push(
        <div
          key={i}
          className={`h-full ${i < filledSegments ? 'bg-[#000080]' : 'bg-[#c0c0c0]'} border-r border-[#808080]`}
          style={{ width: `${100 / totalSegments}%` }}
        />
      );
    }
    return segments;
  };

  const toggleFolder = (folderName: string) => {
    setActiveFolder(activeFolder === folderName ? null : folderName);
  };

  const handleProjectClick = (url: string, projectName: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
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
        setTimeout(() => setFormSubmitted(false), 3000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="pt-16 pb-16 win98-scan-effect">
      {/* Hero Section */}
      <section id="home" className="min-h-screen flex flex-col items-center justify-center mb-40 px-4">
        <div className="win98-window w-full max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="win98-title-bar mb-4">
            <span className="commodore-text">welcome.txt</span>
          </div>
          <div className="win98-marquee mb-2 win98-inset p-1">
            <div className="win98-marquee-content">
              <span className="win98-text">Welcome to my Portfolio - Check out some of my projects and skills below</span>
            </div>
          </div>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto win98-text">
            I'm a passionate full stack developer with expertise in modern web technologies.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary commodore-text"
            >
              View Projects
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary commodore-text"
            >
              Contact Me
            </button>
          </div>
        </div>
      </section>

      {/* Projects Section - Windows 98 Explorer Style */}
      <section id="projects" className="py-16 mb-40">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center commodore-text win98-flicker mb-16">My Projects</h2>
          <div className="win98-window max-w-6xl mx-auto">
            <div className="win98-title-bar mb-2">
              <span className="commodore-text">C:\My Projects\</span>
            </div>
            <div className="flex">
              {/* Left Panel - Folder Navigation */}
              <div className="w-1/4 bg-[#c0c0c0] border-r-2 border-[#808080] p-2">
                <div className="mb-4">
                  <div className="font-bold win98-text mb-2">Folders</div>
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
                </div>
              </div>
              
              {/* Right Panel - Project Files */}
              <div className="w-3/4 bg-white p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div onClick={() => handleProjectClick('https://liam-woods-8.github.io/TravelExplorer/home.html', 'TravelExplorer')} 
                    className="flex flex-col items-center justify-center cursor-pointer hover:bg-[#e0e0e0] p-2">
                    <img 
                      src="https://win98icons.alexmeub.com/icons/png/html-0.png" 
                      alt="TravelExplorer" 
                      className="w-12 h-12 mb-1"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAbwAAAG8B8aLcQwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3Njape.org5vuPBoAAAG+SURBVDiNnZK9S1thFMZ/9+bGm6TaEIODXbpoXISutUPoIAFp6dChkx0KwcGtf0K7ZnHQqYvQTYciiCCdRBcpxWIVFUxpvtX74ftw6A00Mclz4HDgPc/vPO/7nFfcPX6itdaXZVkjpXTXe/8YeAp8B74APbvdvp7NZr9SShkKKSWXUspF+AJ8Bl4AL0WkEUK4n8/n747H4++7u7v9lFJRQNoJvAoh4O4sLy8vR6PRO6ABfAJ+7O/vD2u12lsRGZdz3gLw3hNjJITA9PT0FEBEJLz3jcFgsLS5uTk8ODiYAW6GEHKWZZEQAgAaY3wrIvPFaAgxRgBCCJfDw8NnwFvgWp7n1xqNxtzGxsYl8BFYcc5djDEOQghRRLwA2NvbqwKvgOVer/cBWBSRezHGx3Nzc7da63PAOvC8Xq9/VUqhAFRrfQd4HUJoiMiMMWZBKXXfWrtYqVQemJm2tfZ2Pp9/opRqaq3xxeJwOAQwxWLx8fj9YDCgXC4PsyxrK6UupJQ6Zr1et0qpEWCBz977X6VSqQxUrLVVY8xfpdSlUqrjnDtl+kfnHM1ms12tVp3W+hgoFIvFUqfTeQ/8YeLk/JcXAPwDwGD5Vm5vra0AAAAASUVORK5CYII=";
                      }}
                    />
                    <span className="win98-text text-center">TravelExplorer.html</span>
                    <p className="text-xs text-center mt-1 text-gray-600">APIs & Async JS</p>
                  </div>
                  <div onClick={() => handleProjectClick('https://liam-woods-8.github.io/Eko/home.html', 'Eko')} 
                    className="flex flex-col items-center justify-center cursor-pointer hover:bg-[#e0e0e0] p-2">
                    <img 
                      src="https://win98icons.alexmeub.com/icons/png/earth-0.png" 
                      alt="EKO" 
                      className="w-12 h-12 mb-1" 
                    />
                    <span className="win98-text text-center">EKO.html</span>
                    <span className="win98-blink mt-1 inline-block ml-2">
                      <span className="bg-yellow-300 px-1 text-xs">New!</span>
                    </span>
                    <p className="text-xs text-center mt-1 text-gray-600">APIs & Async JS</p>
                  </div>
                  <div className="flex flex-col items-center justify-center cursor-pointer hover:bg-[#e0e0e0] p-2">
                    <img 
                      src="https://win98icons.alexmeub.com/icons/png/compressed_folder-0.png" 
                      alt="Coming Soon" 
                      className="w-12 h-12 mb-1" 
                    />
                    <span className="win98-text text-center">Coming Soon.exe</span>
                    <p className="text-xs text-center mt-1 text-gray-600">Under Development</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Status Bar */}
            <div className="win98-status-bar p-1 text-xs win98-text bg-[#c0c0c0] border-t-2 border-[#808080]">
              <span>3 objects</span>
              <span className="ml-4">Available memory: 64MB</span>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 mb-40 bg-[#c0c0c0]">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center commodore-text mb-16">My Skills</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="card text-center min-h-[200px] flex flex-col">
              <div className="win98-title-bar mb-2">
                <span className="commodore-text">frontend.dll</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 commodore-text">Frontend</h3>
              <p className="text-black win98-text mb-2 text-sm md:text-base flex-grow">React JS, React Native, TypeScript, Tailwind, Bootstrap</p>
              <div className="win98-progress-bar mt-auto relative w-full">
                <div className="win98-progress-segments" style={{ opacity: skillsLoaded ? 1 : 0, transition: 'opacity 1s ease-in-out', width: '80%' }}>
                  {skillsLoaded && renderProgressSegments(80)}
                </div>
                <div className="win98-progress-text">80%</div>
              </div>
            </div>
            <div className="card text-center min-h-[200px] flex flex-col">
              <div className="win98-title-bar mb-2">
                <span className="commodore-text">backend.dll</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 commodore-text">Backend</h3>
              <p className="text-black win98-text mb-2 text-sm md:text-base flex-grow">Node.js, Python, Express, MongoDB, AWS, Firebase</p>
              <div className="win98-progress-bar mt-auto relative w-full">
                <div className="win98-progress-segments" style={{ opacity: skillsLoaded ? 1 : 0, transition: 'opacity 1s ease-in-out', width: '75%' }}>
                  {skillsLoaded && renderProgressSegments(75)}
                </div>
                <div className="win98-progress-text">75%</div>
              </div>
            </div>
            <div className="card text-center min-h-[200px] flex flex-col">
              <div className="win98-title-bar mb-2">
                <span className="commodore-text">tools.dll</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 commodore-text">Tools</h3>
              <p className="text-black win98-text mb-2 text-sm md:text-base flex-grow">Git, VS Code, Docker, XCode, Figma</p>
              <div className="win98-progress-bar mt-auto relative w-full">
                <div className="win98-progress-segments" style={{ opacity: skillsLoaded ? 1 : 0, transition: 'opacity 1s ease-in-out', width: '90%' }}>
                  {skillsLoaded && renderProgressSegments(90)}
                </div>
                <div className="win98-progress-text">90%</div>
              </div>
            </div>
            <div className="card text-center min-h-[200px] flex flex-col">
              <div className="win98-title-bar mb-2">
                <span className="commodore-text">softskills.dll</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 commodore-text">Soft Skills</h3>
              <p className="text-black win98-text mb-2 text-sm md:text-base flex-grow">Communication, Teamwork, Problem-solving</p>
              <div className="win98-progress-bar mt-auto relative w-full">
                <div className="win98-progress-segments" style={{ opacity: skillsLoaded ? 1 : 0, transition: 'opacity 1s ease-in-out', width: '85%' }}>
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
    </div>
  );
};

export default Home; 