/**
 * CsvImport component - CSV file upload and import
 */

import { useState, useRef } from 'react';
import type { CSVCard } from '../../utils/csv-parser';
import { parseCSV, generateSampleCSV } from '../../utils/csv-parser';
import { useCardManagement } from '../../hooks/useCardManagement';
import { checkDuplicates } from '../../utils/duplicate-detector';
import { CsvPreview } from './CsvPreview';

interface CsvImportProps {
  onImportComplete?: (count: number) => void;
}

type ImportStep = 'upload' | 'preview' | 'importing' | 'complete';

export function CsvImport({ onImportComplete }: CsvImportProps) {
  const { createCards, userDeck } = useCardManagement();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<ImportStep>('upload');
  const [csvData, setCsvData] = useState<CSVCard[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [duplicateMap, setDuplicateMap] = useState<Map<string, any>>(new Map());
  const [skipDuplicates, setSkipDuplicates] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const [importError, setImportError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setImportError('Please select a CSV file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImportError('File is too large (max 5MB)');
      return;
    }

    setImportError(null);

    try {
      const text = await file.text();
      const result = parseCSV(text);

      if (result.cards.length === 0) {
        setImportError('No valid cards found in the CSV file');
        return;
      }

      // Check for duplicates
      const fronts = result.cards.map((c) => c.front);
      const dupMap = await checkDuplicates(fronts, userDeck?.id || '');

      const dupCards = new Map<string, any>();
      for (const [front, dupCheck] of dupMap) {
        if (dupCheck.isDuplicate) {
          dupCards.set(front, dupCheck.existingCard);
        }
      }

      setCsvData(result.cards);
      setErrors(result.errors);
      setDuplicateMap(dupCards);
      setSkipDuplicates(false);
      setStep('preview');
    } catch (err) {
      setImportError(
        err instanceof Error ? err.message : 'Failed to read CSV file'
      );
    }
  };

  const handleImport = async () => {
    if (csvData.length === 0) return;

    setStep('importing');
    setProgress(0);
    setImportError(null);

    try {
      // Filter cards based on skip duplicates setting
      let cardsToImport = csvData;
      if (skipDuplicates) {
        cardsToImport = csvData.filter((card) => !duplicateMap.has(card.front));
      }

      // Prepare card data for creation
      const cardDataArray = cardsToImport.map((card) => ({
        front: card.front.trim(),
        back: card.back.trim(),
        example: card.example ? card.example.trim() : undefined,
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        nextReviewDate: new Date(),
      }));

      // Batch import (50 at a time)
      const batchSize = 50;
      let imported = 0;

      for (let i = 0; i < cardDataArray.length; i += batchSize) {
        const batch = cardDataArray.slice(i, i + batchSize);
        await createCards(batch);
        imported += batch.length;
        setProgress(Math.round((imported / cardDataArray.length) * 100));
      }

      setImportedCount(imported);
      setStep('complete');
      onImportComplete?.(imported);
    } catch (err) {
      setImportError(
        err instanceof Error ? err.message : 'Failed to import cards'
      );
      setStep('preview');
    }
  };

  const handleDownloadSample = () => {
    const csv = generateSampleCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lingocards-sample.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-primary-50', 'dark:bg-primary-900/20');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-primary-50', 'dark:bg-primary-900/20');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-primary-50', 'dark:bg-primary-900/20');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Upload step
  if (step === 'upload') {
    return (
      <div className="space-y-6">
        {importError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-200">
            {importError}
          </div>
        )}

        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition"
        >
          <div className="text-4xl mb-2">📁</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            Upload CSV File
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Drag and drop your CSV file here, or click to select
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Max 5MB, format: front,back,example
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
          className="hidden"
        />

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            📝 CSV Format
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
            Your CSV should have 3 columns:
          </p>
          <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200 mb-3">
            <li>• <strong>front</strong>: English text (required)</li>
            <li>• <strong>back</strong>: Polish translation (required)</li>
            <li>• <strong>example</strong>: Example sentence (optional)</li>
          </ul>
          <button
            onClick={handleDownloadSample}
            className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Download Sample CSV
          </button>
        </div>
      </div>
    );
  }

  // Preview step
  if (step === 'preview') {
    const duplicateCount = Array.from(duplicateMap.values()).length;
    const canImport = skipDuplicates || csvData.length - duplicateCount > 0;

    return (
      <div className="space-y-6">
        <CsvPreview
          cards={csvData}
          errors={errors}
          duplicates={duplicateMap}
          onSkipDuplicates={(skip) => setSkipDuplicates(skip)}
        />

        <div className="flex gap-2">
          <button
            onClick={() => {
              setStep('upload');
              setCsvData([]);
              setErrors([]);
              setDuplicateMap(new Map());
            }}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Back
          </button>
          <button
            onClick={handleImport}
            disabled={!canImport}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 font-semibold"
          >
            Import {skipDuplicates ? csvData.length - duplicateCount : csvData.length} Cards
          </button>
        </div>
      </div>
    );
  }

  // Importing step
  if (step === 'importing') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Importing Cards...
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please wait while we import your cards
          </p>
        </div>

        {/* Progress bar */}
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-primary-600 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          {progress}%
        </p>
      </div>
    );
  }

  // Complete step
  if (step === 'complete') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
            Import Complete!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Successfully imported <strong>{importedCount} cards</strong>
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-sm text-green-800 dark:text-green-200">
            Your cards have been added to "My Cards" deck and are ready to study!
          </p>
        </div>

        <button
          onClick={() => {
            setStep('upload');
            setCsvData([]);
            setErrors([]);
            setDuplicateMap(new Map());
            setImportedCount(0);
          }}
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
        >
          Import More Cards
        </button>
      </div>
    );
  }

  return null;
}
