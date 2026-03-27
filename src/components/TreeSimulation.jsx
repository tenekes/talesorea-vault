import { h } from 'preact';

export default function TreeSimulation() {
    return (
        <div style={containerStyle}>
            <svg
                viewBox="0 0 400 300"
                xmlns="http://www.w3.org/2000/svg"
                className="simulation-scene"
            >
                {/* --- DEFINITIONS (Gradients & Filters) --- */}
                <defs>
                    <linearGradient id="canopyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#2E8B57" />
                        <stop offset="100%" stopColor="#004d00" />
                    </linearGradient>
                    <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3d2314" />
                        <stop offset="50%" stopColor="#5c3a21" />
                        <stop offset="100%" stopColor="#29150b" />
                    </linearGradient>
                    <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                        <stop offset="40%" stopColor="#fadb5f" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#fadb5f" stopOpacity="0" />
                    </radialGradient>
                    {/* Glow filter for the text and rays */}
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* --- BACKGROUND --- */}
                <rect width="400" height="300" fill="#0f172a" rx="12" />

                {/* --- GRID (Adds a technical/scientific feel) --- */}
                <g stroke="#1e293b" strokeWidth="1" opacity="0.5">
                    <line x1="0" y1="50" x2="400" y2="50" />
                    <line x1="0" y1="100" x2="400" y2="100" />
                    <line x1="0" y1="150" x2="400" y2="150" />
                    <line x1="0" y1="200" x2="400" y2="200" />
                    <line x1="0" y1="250" x2="400" y2="250" />
                    <line x1="100" y1="0" x2="100" y2="300" />
                    <line x1="200" y1="0" x2="200" y2="300" />
                    <line x1="300" y1="0" x2="300" y2="300" />
                </g>

                {/* --- THE SUN --- */}
                <circle cx="50" cy="50" r="40" fill="url(#sunGrad)" className="pulse-sun" />

                {/* --- RADIATION RAYS & TEXT --- */}
                <g className="radiation-group">
                    {/* Visible Light (Photosynthesis) */}
                    <path d="M 80 70 Q 160 120 200 150" fill="none" stroke="#fef08a" strokeWidth="2" className="light-ray" filter="url(#glow)" />
                    <text x="130" y="105" fill="#fef08a" fontSize="10" fontFamily="sans-serif" className="ray-text light-text" transform="rotate(25, 130, 105)">
                        Visible Light (Photosynthesis)
                    </text>

                    {/* UV Radiation (Blocked) */}
                    <path d="M 75 45 Q 180 60 210 120" fill="none" stroke="#c084fc" strokeWidth="2" strokeDasharray="6 4" className="uv-ray" filter="url(#glow)" />
                    <text x="140" y="65" fill="#c084fc" fontSize="10" fontFamily="sans-serif" className="ray-text uv-text" transform="rotate(10, 140, 65)">
                        UV Radiation (Filtered)
                    </text>
                </g>

                {/* --- THE TREE --- */}
                {/* Trunk */}
                <path d="M190 200 L210 200 L215 280 L185 280 Z" fill="url(#trunkGrad)" />

                {/* Realistic Layered Canopy */}
                <g className="canopy-group">
                    {/* Back leaves */}
                    <ellipse cx="200" cy="150" rx="65" ry="45" fill="url(#canopyGrad)" opacity="0.9"/>
                    {/* Left clump */}
                    <ellipse cx="160" cy="170" rx="45" ry="35" fill="url(#canopyGrad)" />
                    {/* Right clump */}
                    <ellipse cx="240" cy="170" rx="45" ry="35" fill="url(#canopyGrad)" />
                    {/* Front highlight clump */}
                    <ellipse cx="200" cy="180" rx="55" ry="35" fill="url(#canopyGrad)" />
                </g>

                {/* --- EMBEDDED DYNAMIC TEXT --- */}
                <g className="data-readouts" fontFamily="monospace" fontSize="10">
                    <rect x="25" y="250" width="100" height="35" fill="#1e293b" rx="4" opacity="0.8" stroke="#334155" />
                    <text x="35" y="265" fill="#94a3b8">Status:</text>
                    <text x="35" y="278" fill="#4ade80" className="status-text">Synthesizing...</text>

                    <rect x="275" y="250" width="100" height="35" fill="#1e293b" rx="4" opacity="0.8" stroke="#334155" />
                    <text x="285" y="265" fill="#94a3b8">UV Shield:</text>
                    <text x="285" y="278" fill="#c084fc" className="shield-text">Active (99%)</text>
                </g>

                {/* --- CSS ANIMATIONS --- */}
                <style>{`
          .simulation-scene {
            width: 100%;
            max-width: 600px;
            height: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            border-radius: 12px;
          }

          .pulse-sun {
            animation: pulse 4s ease-in-out infinite;
          }

          .canopy-group {
            transform-origin: 200px 200px;
            animation: breathe 6s ease-in-out infinite;
          }

          .light-ray {
            stroke-dasharray: 200;
            stroke-dashoffset: 200;
            animation: shootRay 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }

          .uv-ray {
            animation: dashFlow 2s linear infinite;
          }

          .ray-text {
            opacity: 0;
            animation: fadeInOut 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }

          .status-text, .shield-text {
            animation: blink 2s step-end infinite;
          }

          /* Keyframes */
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 1; }
          }

          @keyframes breathe {
            0%, 100% { transform: scaleY(1) scaleX(1); }
            50% { transform: scaleY(1.02) scaleX(0.98); }
          }

          @keyframes shootRay {
            0% { stroke-dashoffset: 200; }
            50% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -200; }
          }

          @keyframes dashFlow {
            from { stroke-dashoffset: 20; }
            to { stroke-dashoffset: 0; }
          }

          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-5px); }
            30% { opacity: 1; transform: translateY(0); }
            70% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(5px); }
          }

          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
            </svg>
        </div>
    );
}

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    margin: '3rem 0',
};