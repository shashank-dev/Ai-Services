import React, { useState } from 'react';
import * as authService from '../services/authService';
import { User } from '../services/authService';

interface AuthModalProps {
    onClose: () => void;
    onLoginSuccess: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!username || !password) {
            setError('Username and password cannot be empty.');
            return;
        }

        try {
            let user: User;
            if (isRegistering) {
                user = authService.register(username, password);
                // Automatically log in after successful registration
                user = authService.login(username, password);
            } else {
                user = authService.login(username, password);
            }
            onLoginSuccess(user);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-slate-800 rounded-lg shadow-2xl p-8 w-full max-w-sm border border-slate-700"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">
                    {isRegistering ? 'Create Account' : 'Welcome Back'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-slate-400 mb-2" htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-700 text-white rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            autoComplete="username"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-slate-400 mb-2" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-700 text-white rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            autoComplete={isRegistering ? "new-password" : "current-password"}
                        />
                    </div>
                    {error && <p className="text-red-400 text-center mb-4 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-3 text-lg font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg shadow-lg hover:from-teal-600 hover:to-cyan-700 transition-all duration-300"
                    >
                        {isRegistering ? 'Register & Login' : 'Login'}
                    </button>
                </form>
                <p className="text-center mt-6 text-slate-400">
                    {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                    <button
                        onClick={() => {
                            setIsRegistering(!isRegistering)
                            setError(null);
                        }}
                        className="font-semibold text-teal-400 hover:text-teal-300 ml-2"
                    >
                        {isRegistering ? 'Login' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthModal;
