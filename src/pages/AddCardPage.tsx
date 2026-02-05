/**
 * Add Card Page - Create and import cards
 */

import { useState } from 'react';
import { CardForm } from '../components/cards/CardForm';
import { CsvImport } from '../components/cards/CsvImport';

type TabType = 'manual' | 'csv';

export function AddCardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('manual');
  const [message, setMessage] = useState('');

  const handleCardCreated = () => {
    setMessage('Card added successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleImportComplete = (count: number) => {
    setMessage(`${count} cards imported successfully!`);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Add Cards
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create flashcards manually or import from CSV
        </p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-green-700 dark:text-green-200">
          ✅ {message}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('manual')}
            className={`pb-4 px-2 border-b-2 transition font-medium ${
              activeTab === 'manual'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            ✏️ Manual Entry
          </button>
          <button
            onClick={() => setActiveTab('csv')}
            className={`pb-4 px-2 border-b-2 transition font-medium ${
              activeTab === 'csv'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            📁 CSV Import
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {activeTab === 'manual' && (
          <CardForm onCardCreated={handleCardCreated} />
        )}
        {activeTab === 'csv' && (
          <CsvImport onImportComplete={handleImportComplete} />
        )}
      </div>
    </div>
  );
}
