/**
 * Card Browser Page - Browse, search, sort, and manage all user cards
 */

import { useState, useMemo } from 'react';
import { CardItem } from '../components/cards/CardItem';
import { EditCardModal } from '../components/cards/EditCardModal';
import { useAllCards } from '../hooks/useAllCards';
import type { Card } from '../types';

type SortOption = 'alphabetical-az' | 'alphabetical-za' | 'newest' | 'oldest' | 'due-date';

export function CardBrowserPage() {
  const { cards, loading, error, updateCard, deleteCard } = useAllCards();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical-az');
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Filter and sort cards
  const processedCards = useMemo(() => {
    let filtered = cards.filter(
      (card) =>
        card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.back.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case 'alphabetical-az':
        sorted.sort((a, b) => a.front.localeCompare(b.front));
        break;
      case 'alphabetical-za':
        sorted.sort((a, b) => b.front.localeCompare(a.front));
        break;
      case 'newest':
        sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'oldest':
        sorted.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'due-date':
        sorted.sort((a, b) => a.nextReviewDate.getTime() - b.nextReviewDate.getTime());
        break;
    }

    return sorted;
  }, [cards, searchQuery, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();
    const dueCount = cards.filter((card) => card.nextReviewDate <= now).length;
    return { total: cards.length, due: dueCount };
  }, [cards]);

  const handleEdit = async (cardId: string, updates: Partial<Omit<Card, 'id' | 'deckId' | 'createdAt'>>) => {
    try {
      setIsSaving(true);
      await updateCard(cardId, updates);
      setEditingCard(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (cardId: string) => {
    try {
      await deleteCard(cardId);
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete card:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading cards...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">Error</h2>
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Browse Cards</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {stats.total} card{stats.total !== 1 ? 's' : ''} from all decks •{' '}
          <span className={stats.due > 0 ? 'text-orange-600 dark:text-orange-400 font-semibold' : ''}>
            {stats.due} due today
          </span>
        </p>
      </div>

      {/* Search and Sort Toolbar */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <input
          type="search"
          placeholder="Search cards by English or Polish..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 min-w-40"
        >
          <option value="alphabetical-az">Sort: A → Z</option>
          <option value="alphabetical-za">Sort: Z → A</option>
          <option value="newest">Sort: Newest First</option>
          <option value="oldest">Sort: Oldest First</option>
          <option value="due-date">Sort: Due Date</option>
        </select>
      </div>

      {/* Empty state */}
      {processedCards.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {searchQuery ? 'No cards found' : 'No cards yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery
              ? "Try adjusting your search terms"
              : 'Add your first card to get started!'}
          </p>
          {!searchQuery && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/add"
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
              >
                + Add Cards
              </a>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Create cards manually or import from CSV
              </p>
            </div>
          )}
        </div>
      )}

      {/* Cards Grid */}
      {processedCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {processedCards.map((card) => (
            <div key={card.id} className="relative">
              {/* Delete confirmation overlay */}
              {deleteConfirm === card.id && (
                <div className="absolute inset-0 bg-black/70 rounded-lg flex flex-col items-center justify-center z-40 gap-3 p-4">
                  <p className="text-white font-semibold text-center">Delete this card?</p>
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <CardItem
                card={card}
                onEdit={(c) => setEditingCard(c)}
                onDelete={(id) => setDeleteConfirm(id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingCard && (
        <EditCardModal
          card={editingCard}
          onSave={handleEdit}
          onClose={() => setEditingCard(null)}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
