/**
 * HuggingFaceSettings component - API key management for AI example generator
 */

import { useState, useEffect } from 'react';
import {
  isUsingCustomKey,
  saveCustomApiKey,
  clearCustomApiKey,
  clearExampleCache,
} from '../../utils/ai-generator';

export function HuggingFaceSettings() {
  const [apiKey, setApiKey] = useState('');
  const [hasCustomKey, setHasCustomKey] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setHasCustomKey(isUsingCustomKey());
  }, []);

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      setMessage('Please enter an API key');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    saveCustomApiKey(apiKey.trim());
    setHasCustomKey(true);
    setApiKey('');
    setMessage('✅ API key saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleClearKey = () => {
    clearCustomApiKey();
    setHasCustomKey(false);
    setApiKey('');
    setMessage('API key removed. Using shared key.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleClearCache = () => {
    clearExampleCache();
    setMessage('✅ Cache cleared successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Status Message */}
      {message && (
        <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 text-sm">
          {message}
        </div>
      )}

      {/* API Key Management */}
      {hasCustomKey ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <span>✓</span>
            <span>Using your custom API key</span>
          </div>
          <button
            onClick={handleClearKey}
            className="text-sm px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            Remove Custom Key
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Using shared API key (rate limited). Add your own for unlimited access.
          </p>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSaveKey();
                  }
                }}
                placeholder="hf_..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                title={showKey ? 'Hide API key' : 'Show API key'}
              >
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
            <button
              onClick={handleSaveKey}
              className="text-sm px-3 py-1.5 bg-primary-600 text-white rounded hover:bg-primary-700 transition"
            >
              Save API Key
            </button>
          </div>
          <a
            href="https://huggingface.co/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-600 dark:text-primary-400 hover:underline inline-block"
          >
            Get free API key from Hugging Face →
          </a>
        </div>
      )}

      {/* Cache Management */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleClearCache}
          className="text-sm px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Clear Example Cache
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Generated examples are cached to save API requests
        </p>
      </div>
    </div>
  );
}
