import { useState } from 'preact/hooks';
import TEQ from './TEQ';
import IRI from './IRI';
import EQ from './EQ';
import RMET from './RMET';

type TabType = 'TEQ' | 'IRI' | 'EQ' | 'RMET';

export default function EmpathyTests() {
  const [activeTab, setActiveTab] = useState<TabType>('TEQ');

  const TABS: { id: TabType; name: string }[] = [
    { id: 'TEQ', name: 'Toronto Empathy Questionnaire (TEQ)' },
    { id: 'IRI', name: 'Interpersonal Reactivity Index (IRI)' },
    { id: 'EQ', name: 'Empathy Quotient (EQ)' },
    { id: 'RMET', name: 'Reading the Mind in the Eyes Test (RMET)' }
  ];

  return (
    <div className="flex flex-col space-y-8 w-full">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="-mb-px flex space-x-4 md:space-x-8 overflow-x-auto pb-1" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-zinc-900/40 p-1 rounded-xl w-full">
        {activeTab === 'TEQ' && <TEQ />}
        {activeTab === 'IRI' && <IRI />}
        {activeTab === 'EQ' && <EQ />}
        {activeTab === 'RMET' && <RMET />}
      </div>
    </div>
  );
}
