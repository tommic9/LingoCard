/**
 * Main layout component wrapping all pages
 */

import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 pb-20 md:pb-6">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
