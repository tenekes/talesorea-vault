import { useState } from 'preact/hooks';
import { IRI_QUESTIONS } from './data';

export default function IRI() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionId: number, value: number) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const calculateScore = () => {
    const scores = { F: 0, EC: 0, PT: 0, PD: 0 };
    IRI_QUESTIONS.forEach((q) => {
      let val = answers[q.id];
      if (val !== undefined) {
        // Scoring: A (0), B (1), C (2), D (3), E (4)
        // Reversed: A (4), B (3), C (2), D (1), E (0)
        val = q.reverse ? 4 - val : val;
        scores[q.scale as keyof typeof scores] += val;
      }
    });

    return scores;
  };

    if (submitted) {
        const scores = calculateScore();
        return (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-md space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Αποτέλεσμα IRI</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

                    {/* Φαντασία (FS) */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-bold text-blue-600 mb-1">Φαντασία (FS)</h4>
                        <div className="flex items-baseline gap-1">
                            <p className="text-2xl font-black text-gray-900 dark:text-white">{scores.F}</p>
                            <span className="text-lg font-medium text-gray-500">/ 28</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                            <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(scores.F / 28) * 100}%` }}></div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Η τάση ταύτισης με χαρακτήρες ταινιών, μυθιστορημάτων ή θεατρικών έργων.</p>
                    </div>

                    {/* Λήψη Οπτικής (PT) */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-bold text-green-600 mb-1">Λήψη Οπτικής (PT)</h4>
                        <div className="flex items-baseline gap-1">
                            <p className="text-2xl font-black text-gray-900 dark:text-white">{scores.PT}</p>
                            <span className="text-lg font-medium text-gray-500">/ 28</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                            <div className="bg-green-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(scores.PT / 28) * 100}%` }}></div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Η τάση να υιοθετεί κανείς αυθόρμητα την ψυχολογική οπτική γωνία των άλλων.</p>
                    </div>

                    {/* Ενσυναισθητικό Ενδιαφέρον (EC) */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-bold text-purple-600 mb-1">Ενσυναισθητικό Ενδιαφέρον (EC)</h4>
                        <div className="flex items-baseline gap-1">
                            <p className="text-2xl font-black text-gray-900 dark:text-white">{scores.EC}</p>
                            <span className="text-lg font-medium text-gray-500">/ 28</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                            <div className="bg-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(scores.EC / 28) * 100}%` }}></div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Κλίμακα που αξιολογεί συναισθήματα συμπόνιας προς τους άλλους.</p>
                    </div>

                    {/* Προσωπική Δυσφορία (PD) */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-bold text-red-600 mb-1">Προσωπική Δυσφορία (PD)</h4>
                        <div className="flex items-baseline gap-1">
                            <p className="text-2xl font-black text-gray-900 dark:text-white">{scores.PD}</p>
                            <span className="text-lg font-medium text-gray-500">/ 28</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                            <div className="bg-red-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(scores.PD / 28) * 100}%` }}></div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Συναισθήματα άγχους σε τεταμένες διαπροσωπικές καταστάσεις.</p>
                    </div>
                </div>

                <button
                    onClick={() => { setSubmitted(false); setAnswers({}); }}
                    className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                    Επανάληψη Τεστ
                </button>
            </div>
        );
    }

  const allAnswered = IRI_QUESTIONS.length === Object.keys(answers).length;

  return (
    <div className="space-y-8">
      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Interpersonal Reactivity Index (IRI)</h2>
        <p className="text-sm mb-2">Παρακαλούμε διαβάστε τις παρακάτω προτάσεις και επιλέξτε την απάντηση που σας περιγράφει καλύτερα, από το 0 (Δεν με περιγράφει καθόλου) έως το 4 (Με περιγράφει απόλυτα).</p>
      </div>

      <div className="space-y-6">
        {IRI_QUESTIONS.map((q, idx) => (
          <div key={q.id} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
            <p className="font-medium mb-3">{idx + 1}. {q.text}</p>
            <div className="flex flex-wrap gap-2">
              {['0 - Καθόλου', '1', '2', '3', '4 - Απόλυτα'].map((label, val) => (
                <button
                  key={val}
                  onClick={() => handleSelect(q.id, val)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    answers[q.id] === val 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setSubmitted(true)}
          disabled={!allAnswered}
          className={`px-6 py-3 rounded-lg font-bold text-white transition-colors ${
            allAnswered ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
           {allAnswered ? 'Υποβολή και Εμφάνιση Αποτελέσματος' : 'Απαντήστε σε όλες τις ερωτήσεις'}
        </button>
      </div>
    </div>
  );
}
