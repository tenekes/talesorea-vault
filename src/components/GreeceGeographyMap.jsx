import { useEffect, useRef, useState } from 'preact/hooks';
import * as d3 from 'd3';
import geoDataRaw from '../data/greece-prefectures.json';

const PREFECTURE_DATA = {
  "Pella": { population: "126.730", capital: "Έδεσσα", cities: ["Γιαννιτσά", "Αριδαία", "Σκύδρα"] },
  "Euritania": { population: "11.445", capital: "Καρπενήσι", cities: ["Καρπενήσι"] },
  "Larisa": { population: "268.963", capital: "Λάρισα", cities: ["Λάρισα", "Ελασσόνα", "Τύρναβος"] },
  "Lakonia": { population: "89.138", capital: "Σπάρτη", cities: ["Σπάρτη", "Γύθειο", "Μολάοι"] },
  "Heraklio": { population: "305.490", capital: "Ηράκλειο", cities: ["Ηράκλειο", "Αλικαρνασσός", "Μοίρες"] },
  "Evros": { population: "147.947", capital: "Αλεξανδρούπολη", cities: ["Αλεξανδρούπολη", "Ορεστιάδα", "Διδυμότειχο"] },
  "Samos": { population: "32.977", capital: "Βαθύ", cities: ["Σάμος", "Καρλόβασι"] },
  "Peiraias and islands": { population: "448.997", capital: "Πειραιάς", cities: ["Πειραιάς", "Νίκαια", "Κορυδαλλός"] },
  "Chalkidiki": { population: "105.908", capital: "Πολύγυρος", cities: ["Μουδανιά", "Πολύγυρος", "Κασσάνδρεια"] },
  "Serres": { population: "151.124", capital: "Σέρρες", cities: ["Σέρρες", "Σιδηρόκαστρο", "Ηράκλεια"] },
  "Kozani": { population: "150.196", capital: "Κοζάνη", cities: ["Κοζάνη", "Πτολεμαΐδα", "Σέρβια"] },
  "Imathia": { population: "140.611", capital: "Βέροια", cities: ["Βέροια", "Νάουσα", "Αλεξάνδρεια"] },
  "Fthiotida": { population: "158.231", capital: "Λαμία", cities: ["Λαμία", "Αταλάντη", "Στυλίδα"] },
  "Chios": { population: "51.390", capital: "Χίος", cities: ["Χίος", "Βροντάδος"] },
  "Achaia": { population: "309.694", capital: "Πάτρα", cities: ["Πάτρα", "Αίγιο", "Κάτω Αχαΐα"] },
  "Florina": { population: "51.414", capital: "Φλώρινα", cities: ["Φλώρινα", "Αμύνταιο"] },
  "Preveza": { population: "57.491", capital: "Πρέβεζα", cities: ["Πρέβεζα", "Φιλιππιάδα", "Πάργα"] },
  "Evia": { population: "210.815", capital: "Χαλκίδα", cities: ["Χαλκίδα", "Ψαχνά", "Αλιβέρι"] },
  "Grevena": { population: "31.757", capital: "Γρεβενά", cities: ["Γρεβενά", "Δεσκάτη"] },
  "Athens": { population: "2.640.701", capital: "Αθήνα", cities: ["Αθήνα", "Περιστέρι", "Καλλιθέα"] },
  "Kefallonia": { population: "35.801", capital: "Αργοστόλι", cities: ["Αργοστόλι", "Ληξούρι", "Σάμη"] },
  "East Attica": { population: "502.348", capital: "Παλλήνη", cities: ["Αχαρνές", "Παλλήνη", "Γέρακας"] },
  "Rodopi": { population: "112.039", capital: "Κομοτηνή", cities: ["Κομοτηνή", "Σάπες"] },
  "Korinthos": { population: "145.082", capital: "Κόρινθος", cities: ["Κόρινθος", "Κιάτο", "Ξυλόκαστρο"] },
  "Chania": { population: "156.585", capital: "Χανιά", cities: ["Χανιά", "Κίσσαμος", "Σούδα"] },
  "Lesvos": { population: "83.755", capital: "Μυτιλήνη", cities: ["Μυτιλήνη", "Καλλονή", "Πλωμάρι"] },
  "Arkadia": { population: "77.551", capital: "Τρίπολη", cities: ["Τρίπολη", "Μεγαλόπολη", "Λεωνίδιο"] },
  "Kastoria": { population: "46.048", capital: "Καστοριά", cities: ["Καστοριά", "Άργος Ορεστικό"] },
  "Zakynthos": { population: "40.759", capital: "Ζάκυνθος", cities: ["Ζάκυνθος"] },
  "Drama": { population: "86.643", capital: "Δράμα", cities: ["Δράμα", "Προσοτσάνη"] },
  "Kyklades": { population: "112.615", capital: "Ερμούπολη", cities: ["Ερμούπολη", "Νάξος", "Μύκονος"] },
  "Lefkada": { population: "22.652", capital: "Λευκάδα", cities: ["Λευκάδα", "Νυδρί"] },
  "Viotia": { population: "106.056", capital: "Λιβαδειά", cities: ["Λιβαδειά", "Θήβα", "Ορχομενός"] },
  "Lasithio": { population: "77.277", capital: "Άγιος Νικόλαος", cities: ["Άγιος Νικόλαος", "Ιεράπετρα", "Σητεία"] },
  "Rethymno": { population: "81.936", capital: "Ρέθυμνο", cities: ["Ρέθυμνο", "Πέραμα", "Ανώγεια"] },
  "Magnisia": { population: "190.010", capital: "Βόλος", cities: ["Βόλος", "Νέα Ιωνία", "Αλμυρός"] },
  "Argolida": { population: "93.216", capital: "Ναύπλιο", cities: ["Ναύπλιο", "Άργος", "Κρανίδι"] },
  "Kavala": { population: "116.905", capital: "Καβάλα", cities: ["Καβάλα", "Ελευθερούπολη", "Χρυσούπολη"] },
  "Ilia": { population: "156.959", capital: "Πύργος", cities: ["Πύργος", "Αμαλιάδα", "Γαστούνη"] },
  "Karditsa": { population: "106.829", capital: "Καρδίτσα", cities: ["Καρδίτσα", "Σοφάδες", "Παλαμάς"] },
  "Arta": { population: "63.732", capital: "Άρτα", cities: ["Άρτα", "Φιλοθέη"] },
  "Agio oros": { population: "1.811", capital: "Καρυές", cities: ["Καρυές"] },
  "Thessaloniki": { population: "1.092.919", capital: "Θεσσαλονίκη", cities: ["Θεσσαλονίκη", "Καλαμαριά", "Εύοσμος"] },
  "Xanthi": { population: "108.195", capital: "Ξάνθη", cities: ["Ξάνθη", "Γενισέα"] },
  "Dodekanisa": { population: "190.071", capital: "Ρόδος", cities: ["Ρόδος", "Κως", "Κάλυμνος"] },
  "Kilkis": { population: "70.477", capital: "Κιλκίς", cities: ["Κιλκίς", "Πολύκαστρο", "Γουμένισσα"] },
  "Mesinia": { population: "146.080", capital: "Καλαμάτα", cities: ["Καλαμάτα", "Μεσσήνη", "Γαργαλιάνοι"] },
  "Thesprotia": { population: "40.804", capital: "Ηγουμενίτσα", cities: ["Ηγουμενίτσα", "Παραμυθιά"] },
  "Trikala": { population: "118.602", capital: "Τρίκαλα", cities: ["Τρίκαλα", "Καλαμπάκα", "Φαρκαδόνα"] },
  "Kerkyra": { population: "104.371", capital: "Κέρκυρα", cities: ["Κέρκυρα", "Λευκίμμη", "Αχαράβη"] },
  "Pieria": { population: "119.384", capital: "Κατερίνη", cities: ["Κατερίνη", "Αιγίνιο", "Λιτόχωρο"] },
  "West Attica": { population: "164.864", capital: "Ελευσίνα", cities: ["Ελευσίνα", "Μέγαρα", "Ασπρόπυργος"] },
  "Ioannina": { population: "160.773", capital: "Ιωάννινα", cities: ["Ιωάννινα", "Ανατολή", "Μέτσοβο"] },
  "Fokida": { population: "36.199", capital: "Άμφισσα", cities: ["Άμφισσα", "Ιτέα", "Γαλαξίδι"] },
  "Aitoloakarnania": { population: "192.060", capital: "Μεσολόγγι", cities: ["Αγρίνιο", "Ναύπακτος", "Μεσολόγγι"] }
};

export default function GreeceGeographyMap() {
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  const geoData = geoDataRaw;

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

    // Create a color scale using D3's built-in categorical colors
    const colorScale = d3.scaleOrdinal(d3.schemeSet3);

    const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);

    svg.selectAll("*").remove();

    const g = svg.append('g');

    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });

    svg.call(zoom);

    g.selectAll("path")
        .data(geoData.features)
        .enter()
        .append("path")
        .attr("d", pathGenerator)
        .attr("fill", d => {
          // Apply unique color, but check if it should be drawn "darkened" because it's currently selected
          const baseColor = colorScale(d.properties.name);
          const isSelected = selected && selected.name === d.properties.name;
          return isSelected ? d3.color(baseColor).darker(0.8) : baseColor;
        })
        .attr("stroke", "#1e293b") // Dark slate outline separates the distinct colors nicely
        .attr("stroke-width", 1)
        .style("cursor", "pointer")
        .on("mouseenter", function(event, d) {
          // Brighten the specific prefecture's base color on hover
          const baseColor = colorScale(d.properties.name);
          d3.select(this)
              .attr("fill", d3.color(baseColor).brighter(0.4))
              .attr("stroke-width", 2);
          setHovered(d.properties);
        })
        .on("mouseleave", function(event, d) {
          // Return to base color, or darkened color if it is the currently selected one
          const baseColor = colorScale(d.properties.name);
          const isSelected = selected && selected.name === d.properties.name;
          d3.select(this)
              .attr("fill", isSelected ? d3.color(baseColor).darker(0.8) : baseColor)
              .attr("stroke-width", 1);
          setHovered(null);
        })
        .on("click", function(event, d) {
          // Reset all paths to their standard base color
          g.selectAll("path").attr("fill", pd => colorScale(pd.properties.name));

          // Darken ONLY the clicked path
          const baseColor = colorScale(d.properties.name);
          d3.select(this).attr("fill", d3.color(baseColor).darker(0.8));

          // Bring clicked path to the front so the stroke doesn't get overlapped
          d3.select(this).raise();

          setSelected(d.properties);
        });

  }, [geoData, selected]);

  const getInfo = (name) => PREFECTURE_DATA[name] || { population: "Δεν έχουμε δεδομένα.", capital: "Δεν προσδιορίζεται", cities: [] };

  return (
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto my-8 bg-slate-900 border border-slate-700 !text-slate-100 rounded-xl overflow-hidden shadow-2xl p-4 not-prose">
        <div
            ref={wrapperRef}
            className="relative flex-grow lg:w-2/3 h-[600px] border border-slate-700 rounded-lg bg-slate-800 overflow-hidden"
        >
          <svg ref={svgRef} className="w-full h-full touch-none"></svg>

          {hovered && (
              <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-slate-600 p-4 rounded-lg shadow-xl pointer-events-none z-10 transition-opacity">
                <h3 className="font-bold text-xl !text-sky-400 mb-1" style={{color: '#38bdf8'}}>{hovered.name_greek || hovered.name}</h3>
                <p className="text-sm !text-slate-300" style={{color: '#cbd5e1'}}>Πληθυσμός: <span className="font-semibold !text-slate-100" style={{color: '#f1f5f9'}}>{getInfo(hovered.name).population}</span></p>
                <p className="text-xs !text-sky-500 mt-2 italic" style={{color: '#0ea5e9'}}>Κάντε κλικ για λεπτομέρειες</p>
              </div>
          )}
        </div>

        <div className="lg:w-1/3 flex flex-col gap-4">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 h-full shadow-inner">
            {selected ? (
                <div className="animate-fade-in flex flex-col h-full">
                  <h2 className="text-3xl font-extrabold !text-sky-400 mb-6 border-b border-slate-600 pb-3" style={{color: '#38bdf8'}}>
                    {selected.name_greek || selected.name}
                  </h2>
                  <div className="space-y-6 flex-grow">
                    <div>
                      <h4 className="text-xs !text-slate-400 uppercase tracking-widest font-semibold mb-1" style={{color: '#94a3b8'}}>Πρωτεύουσα</h4>
                      <p className="text-xl font-medium !text-slate-100" style={{color: '#f1f5f9'}}>{getInfo(selected.name).capital}</p>
                    </div>
                    <div>
                      <h4 className="text-xs !text-slate-400 uppercase tracking-widest font-semibold mb-1" style={{color: '#94a3b8'}}>Πληθυσμός</h4>
                      <p className="text-xl font-medium !text-slate-100" style={{color: '#f1f5f9'}}>{getInfo(selected.name).population}</p>
                    </div>
                    <div>
                      <h4 className="text-xs !text-slate-400 uppercase tracking-widest font-semibold mb-2" style={{color: '#94a3b8'}}>Μεγάλες Πόλεις</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {getInfo(selected.name).cities.map((city, idx) => (
                            <span key={idx} className="bg-slate-700 !text-slate-200 px-3 py-1 rounded-full text-sm shadow-sm border border-slate-600" style={{color: '#e2e8f0'}}>
                        {city}
                      </span>
                        ))}
                        {getInfo(selected.name).cities.length === 0 && (
                            <span className="!text-slate-500 italic text-sm" style={{color: '#64748b'}}>Δεν καταγράφονται</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full !text-slate-400 text-center gap-4" style={{color: '#94a3b8'}}>
                  <div className="!text-sky-500/50" style={{color: 'rgba(14, 165, 233, 0.5)'}}>
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