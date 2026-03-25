import { h } from 'preact'; // Use 'react' if you installed react

export default function AnimatedCartoonTree() {
  return (
    <div style={containerStyle}>
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="tree-scene"
      >
        {/* Defining Gradients/Shadows */}
        <defs>
          <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#FFA500', stopOpacity: 1 }} />
          </radialGradient>
          <filter id="shadow" x="0" y="0" width="200%" height="200%">
            <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="#00000040"/>
          </filter>
        </defs>

        {/* The Sun (pulsating light) */}
        <circle className="sun-core" cx="170" cy="30" r="15" fill="url(#sunGradient)" />
        <circle className="sun-light" cx="170" cy="30" r="15" fill="#FFFACD" />

        {/* UV Radiation & Light Rays (moving towards tree) */}
        <g className="rays-group">
          {/* Main Visible Light Rays */}
          <line className="ray light-ray" x1="160" y1="45" x2="80" y2="100" />
          <line className="ray light-ray" x1="155" y1="55" x2="70" y2="120" />
          
          {/* "UV Radiation" Rays (dashed purple lines) */}
          <line className="ray uv-ray" x1="165" y1="40" x2="100" y2="90" />
          <line className="ray uv-ray" x1="150" y1="60" x2="60" y2="130" />
        </g>

        {/* The Tree Trunk (static) */}
        <rect x="95" y="140" width="10" height="40" fill="#8B4513" rx="2" filter="url(#shadow)" />

        {/* The Leaves (clump of circles that sway) */}
        <g className="leaves-group" filter="url(#shadow)">
          <circle className="leaf" cx="85" cy="130" r="15" fill="#228B22" />
          <circle className="leaf" cx="115" cy="130" r="15" fill="#32CD32" />
          <circle className="leaf" cx="100" cy="115" r="18" fill="#006400" />
          <circle className="leaf" cx="85" cy="105" r="12" fill="#2E8B57" />
          <circle className="leaf" cx="115" cy="105" r="12" fill="#228B22" />
          <circle className="leaf" cx="100" cy="95" r="15" fill="#32CD32" />
        </g>
      </svg>

      {/* Embedded CSS for Animations */}
      <style>{`
        .tree-scene {
          width: 100%;
          max-width: 400px;
          height: auto;
          background: #e0f7fa; /* Light sky background */
          border-radius: 8px;
        }

        /* Sun Animations */
        .sun-core {
          animation: pulseSun 4s ease-in-out infinite;
        }
        .sun-light {
          opacity: 0.3;
          animation: shineSun 4s ease-in-out infinite;
        }

        /* Leaves Swaying Animation */
        .leaves-group {
          transform-origin: 100px 140px; /* Base of the leaves clump */
          animation: swayLeaves 6s ease-in-out infinite;
        }

        /* Rays (UV and Light) Animations */
        .rays-group {
          animation: flowRays 5s linear infinite;
        }

        .ray {
          stroke-width: 2;
          stroke-linecap: round;
        }

        .light-ray {
          stroke: #FFD700;
          opacity: 0.6;
        }

        .uv-ray {
          stroke: #9370DB; /* Purple for UV */
          stroke-dasharray: 5 5; /* Makes it dashed */
          opacity: 0.8;
          stroke-width: 1.5;
        }

        /* Animation Keyframes */
        @keyframes swayLeaves {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(2deg); }
        }

        @keyframes pulseSun {
          0%, 100% { r: 15; }
          50% { r: 16; }
        }

        @keyframes shineSun {
          0%, 100% { r: 18; opacity: 0.2; }
          50% { r: 25; opacity: 0.5; }
        }

        @keyframes flowRays {
          0% {
            stroke-dashoffset: 100; /* Start offset */
          }
          100% {
            stroke-dashoffset: 0; /* Flow inward */
          }
        }

        /* Specializing the dashed flow effect */
        .uv-ray {
          stroke-dasharray: 4 6; /* 4px dash, 6px gap */
          animation: uvFlow 2s linear infinite;
        }

        @keyframes uvFlow {
          to {
            stroke-dashoffset: -20; /* Moves the dashes forward */
          }
        }
      `}</style>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  margin: '2rem 0',
};
