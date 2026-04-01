import { useState } from 'preact/hooks';
import { RMET_ITEMS } from './data';

export default function RMET() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionId: number, optionIdx: number) => {
    setAnswers({ ...answers, [questionId]: optionIdx });
  };

  const calculateScore = () => {
    let score = 0;
    RMET_ITEMS.forEach((q) => {
      // Don't score practice item (id: 0)
      if (q.id === 0) return;
      if (answers[q.id] === q.answer) {
        score++;
      }
    });

    return score;
  };

  if (submitted) {
    const score = calculateScore();
    return (
      <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-md space-y-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Αποτέλεσμα RMET (Reading the Mind in the Eyes)</h3>
        
        <p className="text-xl">Το σκορ σας είναι: <span className="font-bold text-emerald-600">{score} </span>/ {RMET_ITEMS.length - 1}</p>
        
        <div className="text-gray-600 dark:text-gray-400 mt-4 space-y-2">
          <p>Ένα τυπικό σκορ χωρίς κλινικά ευρήματα κυμαίνεται συνήθως μεταξύ του 22-30 στο πλήρες τεστ των 36 ερωτήσεων.</p>
        </div>

        <button
          onClick={() => { setSubmitted(false); setAnswers({}); }}
          className="mt-6 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
        >
           Επανάληψη Τεστ
        </button>
      </div>
    );
  }

  const allAnswered = RMET_ITEMS.length === Object.keys(answers).length;

  return (
    <div className="space-y-8">
      <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Reading the Mind in the Eyes Test (RMET)</h2>
        <p className="text-sm mb-2">Για κάθε ζευγάρι ματιών, επιλέξτε τη λέξη που περιγράφει καλύτερα το τι σκέφτεται ή τι νιώθει το άτομο στην εικόνα. Η πρώτη ερώτηση (0) είναι δοκιμαστική (Practice).</p>
      </div>

      <div className="space-y-8">
        {RMET_ITEMS.map((q, idx) => (
          <div key={q.id} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col items-center">
            <p className="font-medium mb-4 w-full text-left">{q.id === 0 ? 'Δοκιμαστικό (Practice)' : `Εικόνα ${idx}`}</p>
            
            <img src={q.image} alt={`Μάτια ${idx}`} className="max-w-full h-auto mb-6 rounded-md shadow-sm xl:max-w-md pointer-events-none" />

            <div className="grid grid-cols-2 gap-4 w-full">
              {q.options.map((opt, optIdx) => (
                <button
                  key={optIdx}
                  onClick={() => handleSelect(q.id, optIdx)}
                  className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    answers[q.id] === optIdx 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                  }`}
                >
                  {opt}
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
            allAnswered ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
           {allAnswered ? 'Υποβολή και Εμφάνιση Αποτελέσματος' : 'Απαντήστε σε όλες τις ερωτήσεις'}
        </button>
      </div>
    </div>
  );
}
