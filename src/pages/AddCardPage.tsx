/**
 * Add Card Page - Add new cards and decks (placeholder)
 */

export function AddCardPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Add Cards
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Card creation and deck management will be implemented in Phase 3
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Coming Soon:
        </h2>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          <li>- Create custom decks</li>
          <li>- Add individual cards</li>
          <li>- Edit existing cards</li>
          <li>- Import cards from CSV</li>
          <li>- Bulk card operations</li>
        </ul>
      </div>
    </div>
  );
}
