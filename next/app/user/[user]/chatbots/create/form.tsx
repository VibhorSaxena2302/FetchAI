// pages/signup.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type CreateProps = {
    username?: string;
  };
  
const CreateComponent: React.FC<CreateProps> = ({username = 'undefined'}) => {
    const router = useRouter();

    const [isFailed, setisFailed] = useState(false);
    const [isWaiting, setisWaiting] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        role: ''
    });

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Post data to the API
        setisWaiting(true)
        const response = await fetch('/api/create_chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Chatbot created successfully');
            if (data && data.chatbot && data.chatbot.id) {
                router.push(`/user/${username}/chatbots/${data.chatbot.id}`); // Use the retrieved chatbot ID
            } else {
                console.error('Chatbot ID not found in response');
            }
        } else {
            setisWaiting(false)
            setisFailed(true)
            console.error('Failed to create chatbot');
        }
    };

    return (
        <div>
            <div className="min-h-screen flex flex-col justify-center items-center">
                <div className="p-8 border rounded-md shadow-lg bg-light md:w-96"> {/* Adjusted width here */}
                    <h2 className="text-lg font-semibold text-tc mb-4">Create a new Chatbot!</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="text-sm font-medium text-tc">Name  <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-a78bfa rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="text-sm font-medium text-tc">Description  <span style={{ color: 'red' }}>*</span></label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                placeholder='Chatbot description'
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-a78bfa rounded-md"
                                rows={4} // Set the initial number of rows
                                style={{ resize: "vertical" }} // Allows resizing only vertically
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="text-sm font-medium text-tc">Role</label>
                            <textarea
                                id="role"
                                name="role"
                                value={formData.role}
                                placeholder='Chatbot traits'
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 border border-a78bfa rounded-md"
                                rows={4} // Set the initial number of rows
                                style={{ resize: "vertical" }} // Allows resizing only vertically
                            />
                        </div>
                        {isWaiting && (
                            <div className="text-sm font-medium text-error">Please wait</div>
                        )}
                        {isFailed && (
                            <div className="text-sm font-medium text-error">Name already exists.</div>
                        )}
                        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-light bg-primary hover:bg-gray-700">
                            Create
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateComponent;