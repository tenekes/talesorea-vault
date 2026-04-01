import { useEffect, useRef, useState } from 'preact/hooks';
import * as d3 from 'd3';

// Extracted from our generated JSON. Will fill this out automatically.
const PREFECTURE_DATA = {
  "Attiki": { population: "3,814,064", capital: "Αθήνα", cities: ["Πειραιάς", "Περιστέρι", "Καλλιθέα"] },
  "Thessaloniki": { population: "1,110,551", capital: "Θεσσαλονίκη", cities: ["Καλαμαριά", "Εύοσμος"] },
  "Heraklio": { population: "305,490", capital: "Ηράκλειο", cities: ["Αλικαρνασσός", "Μοίρες", "Μάλια"] },
  "Achaea": { population: "309,694", capital: "Πάτρα", cities: ["Αίγιο", "Κάτω Αχαΐα"] },
  "Larisa": { population: "284,325", capital: "Λάρισα", cities: ["Ελασσόνα", "Φάρσαλα", "Τύρναβος"] },
  "Evros": { population: "147,947", capital: "Αλεξανδρούπολη", cities: ["Ορεστιάδα", "Διδυμότειχο"] },
  "Lakonia": { population: "89,138", capital: "Σπάρτη", cities: ["Γύθειο", "Νεάπολη"] },
  "Pella": { population: "139,680", capital: "Έδεσσα", cities: ["Γιαννιτσά", "Αριδαία"] },
  "Samos": { population: "32,977", capital: "Βαθύ (Σάμος)", cities: ["Καρλόβασι"] },
  "Euritania": { population: "20,081", capital: "Καρπενήσι", cities: ["Κερασοχώρι"] }
};

export default function GreeceGeographyMap() {
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/src/data/greece-prefectures.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load JSON');
        return res.json();
      })
      .then(data => {
        setGeoData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading geojson", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!geoData || !svgRef.current || !wrapperRef.current) return;

    const wrapper = wrapperRef.current;
    const { width } = wrapper.getBoundingClientRect();
    const height = 600;

    const projection = d3.geoMercator()
      .center([24.0, 38.5])
      .scale(width * 5.5)
      .translate([width / 2, height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    svg.selectAll("*").remove();

    const g = svg.append('g');

    g.selectAll("path")
      .data(geoData.features)
      .enter()
      .append("path")
      .attr("d", pathGenerator)
      .attr("fill", "#0284c7")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("mouseenter", function(event, d) {
        d3.select(this)
          .attr("fill", "#38bdf8")
          .attr("stroke-width", 2);
        setHovered(d.properties);
      })
      .on("mouseleave", function(event, d) {
        const isSelected = selected && selected.name === d.properties.name;
        d3.select(this)
          .attr("fill", isSelected ? "#0369a1" : "#0284c7")
          .attr("stroke-width", 1);
        setHovered(null);
      })
      .on("click", function(event, d) {
        g.selectAll("path").attr("fill", "#0284c7");
        d3.select(this).attr("fill", "#0369a1");
        setSelected(d.properties);
      });

  }, [geoData, selected]); 

  if (loading) return <div className="text-center p-8 text-slate-300">Φόρτωση χάρτη Ελλάδας...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Σφάλμα: {error}</div>;

  const getInfo = (name) => PREFECTURE_DATA[name] || { population: "Δεν έχουμε δεδομένα.", capital: "Δεν προσδιορίζεται", cities: [] };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto my-8 bg-slate-900 border border-slate-700 text-slate-100 rounded-xl overflow-hidden shadow-2xl p-4 not-prose">
      <div 
        ref={wrapperRef} 
        className="relative flex-grow lg:w-2/3 h-[600px] border border-slate-700 rounded-lg bg-slate-800"
      >
        <svg ref={svgRef} className="w-full h-full"></svg>
        
        {hovered && (
          <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-slate-600 p-4 rounded-lg shadow-xl pointer-events-none z-10 transition-opacity">
            <h3 className="font-bold text-xl text-sky-400 mb-1">{hovered.name_greek || hovered.name}</h3>
            <p className="text-sm text-slate-300">Πληθυσμός: <span className="font-semibold text-slate-100">{getInfo(hovered.name).population}</span></p>
            <p className="text-xs text-sky-500 mt-2 italic">Κάντε κλικ για λεπτομέρειες</p>
          </div>
        )}
      </div>

      <div className="lg:w-1/3 flex flex-col gap-4">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 h-full shadow-inner">
          {selected ? (
            <div className="animate-fade-in flex flex-col h-full">
              <h2 className="text-3xl font-extrabold text-sky-400 mb-6 border-b border-slate-600 pb-3">
                {selected.name_greek || selected.name}
              </h2>
              <div className="space-y-6 flex-grow">
                <div>
                  <h4 className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Πρωτεύουσα</h4>
                  <p className="text-xl font-medium text-slate-100">{getInfo(selected.name).capital}</p>
                </div>
                <div>
                  <h4 className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Πληθυσμός</h4>
                  <p className="text-xl font-medium text-slate-100">{getInfo(selected.name).population}</p>
                </div>
                <div>
                  <h4 className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-2">Μεγάλες Πόλεις</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {getInfo(selected.name).cities.map((city, idx) => (
                      <span key={idx} className="bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-sm shadow-sm border border-slate-600">
                        {city}
                      </span>
                    ))}
                    {getInfo(selected.name).cities.length === 0 && (
                      <span className="text-slate-500 italic text-sm">Δεν καταγράφονται</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center gap-4">
              <div className="text-sky-500/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <p className="text-lg">Επιλέξτε έναν νομό στο χάρτη για να δείτε περισσότερες πληροφορίες.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
