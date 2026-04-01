import { useState } from 'preact/hooks';
import { EQ_QUESTIONS } from './data';

export default function EQ() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionId: number, value: number) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const calculateScore = () => {
    let score = 0;
    EQ_QUESTIONS.forEach((q) => {
      let val = answers[q.id];
      if (val !== undefined) {
        if (!q.scored) return;
        // Scoring: 
        // Forward (0=Strongly Agree, 1=Slightly Agree, 2=Slightly Disagree, 3=Strongly Disagree)
        // Max points for agreeing. "Strongly Agree" = 2 points, "Slightly Agree" = 1 point. Rest = 0.
        // If reverse, "Strongly Disagree" = 2 points, "Slightly Disagree" = 1 point.
        
        let p = 0;
        if (!q.reverse) {
          if (val === 0) p = 2; // Strongly Agree
          if (val === 1) p = 1; // Slightly Agree
        } else {
          if (val === 3) p = 2; // Strongly Disagree
          if (val === 2) p = 1; // Slightly Disagree
        }
        score += p;
      }
    });

    return score;
  };

  if (submitted) {
    const score = calculateScore();
    return (
      <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-md space-y-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Αποτέλεσμα EQ (Πηλίκο Ενσυναίσθησης)</h3>
        
        <p className="text-xl">Το σκορ σας είναι: <span className="font-bold text-orange-600">{score} </span>/ {EQ_QUESTIONS.filter(q => q.scored).length * 2}</p>
        
        <div className="text-gray-600 dark:text-gray-400 mt-4 space-y-2">
          <p>Σημείωση: Αν και το πλήρες τεστ έχει 40 σκοραρισμένες ερωτήσεις (για 80 πόντους) και 20 χωρίς σκορ, αυτό το δείγμα υπολογίζει τη βαθμολογία στις επιλεγμένες.</p> 
          <p>Άτομα με σύνδρομο Asperger ή αυτισμό υψηλής λειτουργικότητας συνήθως σκοράρουν κάτω από 30 στο πλήρες τεστ (από 80).</p>
        </div>

        <button
          onClick={() => { setSubmitted(false); setAnswers({}); }}
          className="mt-6 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
        >
           Επανάληψη Τεστ
        </button>
      </div>
    );
  }

  const allAnswered = EQ_QUESTIONS.length === Object.keys(answers).length;

  return (
    <div className="space-y-8">
      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Empathy Quotient (EQ)</h2>
        <p className="text-sm mb-2">Για κάθε μία από τις παρακάτω προτάσεις, παρακαλώ επιλέξτε την απάντηση που σας ταιριάζει περισσότερο.</p>
      </div>

      <div className="space-y-6">
        {EQ_QUESTIONS.map((q, idx) => (
          <div key={q.id} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
            <p className="font-medium mb-3">{idx + 1}. {q.text}</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Συμφωνώ απόλυτα', val: 0 },
                { label: 'Συμφωνώ λίγο', val: 1 },
                { label: 'Διαφωνώ λίγο', val: 2 },
                { label: 'Διαφωνώ απόλυτα', val: 3 },
              ].map(({ label, val }) => (
                <button
                  key={val}
                  onClick={() => handleSelect(q.id, val)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    answers[q.id] === val 
                      ? 'bg-orange-600 text-white' 
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
            allAnswered ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
           {allAnswered ? 'Υποβολή και Εμφάνιση Αποτελέσματος' : 'Απαντήστε σε όλες τις ερωτήσεις'}
        </button>
      </div>
    </div>
  );
}
