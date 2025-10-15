import React from 'react';
import { User } from '../services/authService';

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onLogoutClick }) => {
  return (
    <header className="py-6 text-center relative">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
        AI Photo Blender
      </h1>
      <p className="mt-2 text-lg text-slate-400">
        Seamlessly add anyone to your group photos.
      </p>
      <div className="absolute top-4 right-4 flex items-center gap-4">
        {user ? (
          <>
            <span className="text-slate-300 hidden sm:block">Welcome, <span className="font-bold text-teal-400">{user.username}</span>!</span>
            <button
              onClick={onLogoutClick}
              className="px-4 py-2 bg-slate-700 text-white/90 font-semibold rounded-lg shadow-md hover:bg-slate-600 transition-colors duration-300 text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={onLoginClick}
            className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition-colors duration-300"
          >
            Login / Sign Up
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
