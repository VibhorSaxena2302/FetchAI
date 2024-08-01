// pages/signup.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignupPage: React.FC = () => {
    const router = useRouter();

    const [isFailed, setisFailed] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Post data to the API
        console.log(formData);
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            console.log('User created successfully');
            router.push(`/user/${encodeURIComponent(formData.username)}/chatbots`);
            router.refresh()
        } else {
            setisFailed(true)
            console.error('Failed to create user');
        }
    };

    return (
        <div>
            <div className="min-h-screen flex flex-col justify-center items-center">
                <div className="p-8 border rounded-md shadow-lg bg-light md:w-96"> {/* Adjusted width here */}
                    <h2 className="text-lg font-semibold text-tc mb-4">Signup</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="text-sm font-medium text-tc">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-a78bfa rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="text-sm font-medium text-tc">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-a78bfa rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="text-sm font-medium text-tc">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-a78bfa rounded-md"
                                required
                            />
                        </div>
                        {isFailed && (
                            <div className="text-sm font-medium text-error">Username or email already exists.</div>
                        )}
                        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-light bg-primary hover:bg-gray-700">
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;