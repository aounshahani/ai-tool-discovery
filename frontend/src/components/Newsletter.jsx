import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import axios from '../api/axios';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            await axios.post('/newsletter/subscribe', { email });
            setStatus('success');
            setMessage('Thanks for subscribing! Stay tuned for updates.');
            setEmail('');
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="bg-indigo-900 text-white rounded-2xl p-8 md:p-12 my-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-800 opacity-50 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-purple-800 opacity-50 blur-3xl"></div>

            <div className="relative z-10 max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-800 mb-6">
                    <Mail className="w-6 h-6 text-indigo-300" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Stay Ahead of the AI Curve</h2>
                <p className="text-indigo-200 mb-8 text-lg">
                    Get the latest AI tools, trends, and insights delivered directly to your inbox. No spam, just value.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="flex-1 px-5 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        required
                        disabled={status === 'loading' || status === 'success'}
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-50 transition-colors disabled:opacity-70"
                    >
                        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                    </button>
                </form>

                {status === 'success' && (
                    <div className="mt-4 flex items-center justify-center text-green-300 animate-fade-in">
                        <CheckCircle size={20} className="mr-2" />
                        {message}
                    </div>
                )}

                {status === 'error' && (
                    <div className="mt-4 flex items-center justify-center text-red-300 animate-fade-in">
                        <AlertCircle size={20} className="mr-2" />
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Newsletter;
