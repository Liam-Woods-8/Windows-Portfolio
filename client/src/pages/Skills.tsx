import React from 'react';

const Skills: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 commodore-text">My Skills</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="win98-window p-4">
          <div className="win98-title-bar mb-2">
            <span className="commodore-text">frontend.dll</span>
          </div>
          <h3 className="text-xl font-bold mb-2 commodore-text">Frontend</h3>
          <p className="text-black win98-text mb-2">HTML5, CSS3, JavaScript ES6+, React.js, Tailwind, Bootstrap, Git</p>
          <div className="win98-progress-bar mt-2 relative">
            <div className="win98-progress-segments animate-progress" style={{ width: '80%' }}></div>
            <div className="win98-progress-text">80%</div>
          </div>
        </div>
        <div className="win98-window p-4">
          <div className="win98-title-bar mb-2">
            <span className="commodore-text">backend.dll</span>
          </div>
          <h3 className="text-xl font-bold mb-2 commodore-text">Backend</h3>
          <p className="text-black win98-text mb-2">JavaScript, Node.js, Python, AWS</p>
          <div className="win98-progress-bar mt-2 relative">
            <div className="win98-progress-segments animate-progress" style={{ width: '75%' }}></div>
            <div className="win98-progress-text">75%</div>
          </div>
        </div>
        <div className="win98-window p-4">
          <div className="win98-title-bar mb-2">
            <span className="commodore-text">tools.dll</span>
          </div>
          <h3 className="text-xl font-bold mb-2 commodore-text">Tools</h3>
          <p className="text-black win98-text mb-2">VS Code, GitHub, Figma, Vite</p>
          <div className="win98-progress-bar mt-2 relative">
            <div className="win98-progress-segments animate-progress" style={{ width: '90%' }}></div>
            <div className="win98-progress-text">90%</div>
          </div>
        </div>
        <div className="win98-window p-4">
          <div className="win98-title-bar mb-2">
            <span className="commodore-text">softskills.dll</span>
          </div>
          <h3 className="text-xl font-bold mb-2 commodore-text">Soft Skills</h3>
          <p className="text-black win98-text mb-2">Communication, Teamwork, Problem-solving</p>
          <div className="win98-progress-bar mt-2 relative">
            <div className="win98-progress-segments animate-progress" style={{ width: '85%' }}></div>
            <div className="win98-progress-text">85%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills; 