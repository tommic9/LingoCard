/**
 * Header component - top navigation bar
 */

import { Link } from 'react-router-dom';
import { HeaderThemeToggle } from './HeaderThemeToggle';

export function Header() {
  return (
    <header className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-primary-600 font-bold text-xl">L</span>
            </div>
            <h1 className="text-xl font-bold">LingoCards</h1>
          </Link>

          <HeaderThemeToggle />
        </div>
      </div>
    </header>
  );
}
