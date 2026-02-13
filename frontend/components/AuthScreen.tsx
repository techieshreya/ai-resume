"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = "https://ai-resume-production-564b.up.railway.app";

interface AuthScreenProps {
    defaultTab?: 'login' | 'signup';
}

export default function AuthScreen({ defaultTab = 'login' }: AuthScreenProps) {
    const router = useRouter();
    const [tab, setTab] = useState<'login' | 'signup'>(defaultTab);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Login State
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Signup State
    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [careerInterest, setCareerInterest] = useState("");

    // Toggle Tab
    const switchToLogin = () => {
        setTab('login');
        setError(null);
    };
    const switchToSignup = () => {
        setTab('signup');
        setError(null);
    };

    // Handlers
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await axios.post(`${API_URL}/auth/login`, {
                email: loginEmail,
                password: loginPassword
            });

            // Save token
            localStorage.setItem("token", res.data.access_token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            // Redirect
            router.push('/builder');

        } catch (err: any) {
            console.error("Login Error:", err);
            setError(err.response?.data?.detail || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (signupPassword.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/auth/register`, {
                name: signupName,
                email: signupEmail,
                password: signupPassword
            });

            // Save token (Auto-login)
            localStorage.setItem("token", res.data.access_token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            // Redirect
            router.push('/builder');

        } catch (err: any) {
            console.error("Signup Error:", err);
            setError(err.response?.data?.detail || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#F9FAFB] dark:bg-[#111827] text-gray-800 dark:text-gray-200 font-sans h-screen flex overflow-hidden">
            <div className="flex w-full h-full">

                {/* LEFT SIDE: Image & Testimonial */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
                    <img
                        alt="Modern Workspace"
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                        src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-[#6366F1]/30 to-transparent"></div>

                    <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full text-white">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight">Resume.ai</span>
                        </div>

                        <div className="mb-12">
                            <h2 className="text-4xl font-bold leading-tight mb-6">
                                "The only way to do great work is to love what you do."
                            </h2>
                            <p className="text-lg text-gray-300 font-light max-w-md">
                                Build your professional future with our AI-powered resume intelligence. Join thousands of professionals landing their dream jobs today.
                            </p>

                            <div className="mt-8 flex items-center gap-4">
                                <div className="flex -space-x-2">
                                    <img alt="User" className="w-10 h-10 rounded-full border-2 border-gray-900" src="https://i.pravatar.cc/150?u=1" />
                                    <img alt="User" className="w-10 h-10 rounded-full border-2 border-gray-900" src="https://i.pravatar.cc/150?u=2" />
                                    <img alt="User" className="w-10 h-10 rounded-full border-2 border-gray-900" src="https://i.pravatar.cc/150?u=3" />
                                </div>
                                <div className="text-sm">
                                    <span className="font-bold text-white">4.9/5</span>
                                    <span className="text-gray-400"> from 10k+ users</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Form Area */}
                <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-[#1F2937] overflow-y-auto">
                    <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-12 relative">

                        {/* Back to Home */}
                        <a href="/" className="absolute top-8 left-8 sm:left-12 lg:left-20 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            Back to Home
                        </a>

                        {/* Mobile Header */}
                        <div className="lg:hidden flex items-center gap-2 mb-8 text-[#6366F1]">
                            <span className="material-symbols-outlined text-3xl">auto_awesome</span>
                            <span className="text-2xl font-bold">Resume.ai</span>
                        </div>

                        <div className="w-full max-w-md mx-auto">

                            {/* Tabs */}
                            <div className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 mb-8">
                                <button
                                    onClick={switchToLogin}
                                    className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
                    ${tab === 'login'
                                            ? 'bg-white dark:bg-gray-700 text-[#6366F1] shadow ring-1 ring-black/5 dark:text-white'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`
                                    }
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={switchToSignup}
                                    className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
                    ${tab === 'signup'
                                            ? 'bg-white dark:bg-gray-700 text-[#6366F1] shadow ring-1 ring-black/5 dark:text-white'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`
                                    }
                                >
                                    Create Account
                                </button>
                            </div>

                            {/* Header Text */}
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {tab === 'login' ? 'Welcome back' : 'Create an account'}
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {tab === 'login' ? 'Enter your details to access your resume workspace.' : 'Start building your professional resume in minutes.'}
                                </p>
                            </div>

                            {/* ERROR MESSAGE */}
                            {error && (
                                <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">error</span>
                                    {error}
                                </div>
                            )}

                            {/* LOGIN FORM */}
                            {tab === 'login' && (
                                <form className="space-y-5" onSubmit={handleLogin}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email address</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <span className="material-symbols-outlined text-[20px]">mail</span>
                                            </span>
                                            <input
                                                type="email"
                                                required
                                                className="w-full rounded-lg border-gray-300 shadow-sm pl-10 focus:border-[#6366F1] focus:ring-[#6366F1] dark:bg-gray-800 dark:border-gray-600 dark:text-white p-2.5 transition-all"
                                                placeholder="name@company.com"
                                                value={loginEmail}
                                                onChange={(e) => setLoginEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                            <a href="#" className="text-sm font-medium text-[#6366F1] hover:text-indigo-500">Forgot password?</a>
                                        </div>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <span className="material-symbols-outlined text-[20px]">lock</span>
                                            </span>
                                            <input
                                                type="password"
                                                required
                                                className="w-full rounded-lg border-gray-300 shadow-sm pl-10 focus:border-[#6366F1] focus:ring-[#6366F1] dark:bg-gray-800 dark:border-gray-600 dark:text-white p-2.5 transition-all"
                                                placeholder="••••••••"
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#6366F1] focus:ring-[#6366F1] dark:bg-gray-700 dark:border-gray-600" />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">Remember me for 30 days</label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex w-full justify-center rounded-lg bg-[#6366F1] px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366F1] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                        ) : "Sign in to Workspace"}
                                    </button>
                                </form>
                            )}

                            {/* SIGNUP FORM */}
                            {tab === 'signup' && (
                                <form className="space-y-5" onSubmit={handleSignup}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#6366F1] focus:ring-[#6366F1] dark:bg-gray-800 dark:border-gray-600 dark:text-white p-2.5 transition-all"
                                            placeholder="Jane Doe"
                                            value={signupName}
                                            onChange={(e) => setSignupName(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email address</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#6366F1] focus:ring-[#6366F1] dark:bg-gray-800 dark:border-gray-600 dark:text-white p-2.5 transition-all"
                                            placeholder="name@company.com"
                                            value={signupEmail}
                                            onChange={(e) => setSignupEmail(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Career Interest</label>
                                        <div className="relative">
                                            <select
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#6366F1] focus:ring-[#6366F1] dark:bg-gray-800 dark:border-gray-600 dark:text-white p-2.5 transition-all appearance-none"
                                                value={careerInterest}
                                                onChange={(e) => setCareerInterest(e.target.value)}
                                            >
                                                <option value="" disabled>Select your field</option>
                                                <option value="se">Software Engineering</option>
                                                <option value="ds">Data Science</option>
                                                <option value="pm">Product Management</option>
                                                <option value="design">Design & Creative</option>
                                                <option value="marketing">Marketing</option>
                                                <option value="other">Other</option>
                                            </select>
                                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                                                <span className="material-symbols-outlined">expand_more</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                                        <input
                                            type="password"
                                            required
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#6366F1] focus:ring-[#6366F1] dark:bg-gray-800 dark:border-gray-600 dark:text-white p-2.5 transition-all"
                                            placeholder="Create a strong password"
                                            value={signupPassword}
                                            onChange={(e) => setSignupPassword(e.target.value)}
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex w-full justify-center rounded-lg bg-[#6366F1] px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366F1] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                        ) : "Create Account"}
                                    </button>
                                </form>
                            )}

                            {/* Social Login */}
                            <div className="relative mt-8">
                                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm font-medium leading-6">
                                    <span className="bg-white dark:bg-[#1F2937] px-4 text-gray-500 dark:text-gray-400">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <button className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors group">
                                    <img alt="Google" className="h-5 w-5 mr-2" src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" />
                                    <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Google</span>
                                </button>
                                <button className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors group">
                                    <svg aria-hidden="true" className="h-5 w-5 mr-2 text-gray-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path>
                                    </svg>
                                    <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">GitHub</span>
                                </button>
                            </div>

                            <div className="mt-auto pt-10 text-center text-xs text-gray-500">
                                <p>© 2024 Resume.ai Inc. All rights reserved.</p>
                                <div className="mt-2 space-x-4">
                                    <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300">Privacy Policy</a>
                                    <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300">Terms of Service</a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
