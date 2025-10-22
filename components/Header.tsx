import React from 'react';
import { User } from '../services/authService';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onLogoutClick, theme, onThemeToggle }) => {
  return (
    <header className="py-6 text-center relative">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#864ffe] to-[#e60080]">
        AI Photo Blender
      </h1>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
        Seamlessly add anyone to your group photos.
      </p>
      <div className="absolute top-4 right-4 flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-700 dark:text-gray-300 hidden sm:block">Welcome, <span className="font-bold text-[#864ffe]">{user.username}</span>!</span>
            <button
              onClick={onLogoutClick}
              className="px-4 py-2 bg-gray-200 text-[#1a1a1c] dark:bg-zinc-800 dark:text-[#fcfcfc] font-semibold rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors duration-300 text-sm"
            >
              Logout
            </button>
          </>
        ) : null}
         <button
          onClick={onThemeToggle}
          className="p-2 rounded-full bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors duration-300"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <MoonIcon className="h-5 w-5 text-gray-800" /> : <SunIcon className="h-5 w-5 text-yellow-400" />}
        </button>
      </div>
    </header>
  );
};

export default Header;
