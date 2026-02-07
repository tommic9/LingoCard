/**
 * Main layout component wrapping all pages
 */

import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Main content with proper bottom spacing for fixed nav */}
      <main
        className="w-full max-w-4xl mx-auto px-4 py-6 md:pb-6"
        style={{
          minHeight: 'calc(100vh - 4rem)', // Full height minus header
          paddingBottom: 'max(6rem, 20vh)' // Responsive bottom padding
        }}
      >
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
