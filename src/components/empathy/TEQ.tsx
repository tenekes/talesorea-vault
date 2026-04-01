import { useState } from 'preact/hooks';
import { TEQ_QUESTIONS } from './data';

export default function TEQ() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionId: number, value: number) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const calculateScore = () => {
    let score = 0;
    TEQ_QUESTIONS.forEach((q) => {
      const val = answers[q.id];
      if (val !== undefined) {
        // Scoring: Never (0), Rarely (1), Sometimes (2), Often (3), Always (4)
        // Reversed: Never (4), Rarely (3), Sometimes (2), Often (1), Always (0)
        score += q.reverse ? 4 - val : val;
      }
    });
    return score;
  };

  if (submitted) {
    const score = calculateScore();
    return (
      <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-md space-y-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Αποτέλεσμα TEQ</h3>
        <p className="text-lg">Το σκορ σας είναι: <span className="font-bold text-blue-600">{score} </span>/ 64</p>
        <div className="text-gray-600 dark:text-gray-400 mt-4">
          <p>Ο μέσος όρος κυμαίνεται συνήθως μεταξύ 43-47. Μεγαλύτερη βαθμολογία υποδεικνύει υψηλότερα επίπεδα ενσυναίσθησης (περιγραφικά).</p>
        </div>
        <button
          onClick={() => { setSubmitted(false); setAnswers({}); }}
          className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
           Επανάληψη Τεστ
        </button>
      </div>
    );
  }

  const allAnswered = TEQ_QUESTIONS.length === Object.keys(answers).length;

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Toronto Empathy Questionnaire (TEQ)</h2>
        <p className="text-sm">Διαβάστε προσεκτικά την κάθε πρόταση και επιλέξτε πόσο συχνά νιώθετε ή αντιδράτε με τον τρόπο που περιγράφεται.</p>
      </div>
      
      <div className="space-y-6">
        {TEQ_QUESTIONS.map((q, idx) => (
          <div key={q.id} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
            <p className="font-medium mb-3">{idx + 1}. {q.text}</p>
            <div className="flex flex-wrap gap-2">
              {['Ποτέ', 'Σπάνια', 'Μερικές φορές', 'Συχνά', 'Πάντα'].map((label, val) => (
                <button
                  key={val}
                  onClick={() => handleSelect(q.id, val)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    answers[q.id] === val 
                      ? 'bg-blue-600 text-white' 
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
            allAnswered ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
           {allAnswered ? 'Υποβολή και Εμφάνιση Αποτελέσματος' : 'Απαντήστε σε όλες τις ερωτήσεις'}
        </button>
      </div>
    </div>
  );
}
