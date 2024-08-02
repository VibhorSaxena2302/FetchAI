"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChatbotLoadingSkeleton } from '@/app/ui/skeletons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ChatbotProps = {
  username?: string;
};

interface Chatbot {
  name: string;
  description: string | null;
  role: string | null;
  document_name: string | null;
}

const Form: React.FC<ChatbotProps> = ({username = 'undefined'}) => {
    const router = useRouter();

    const [isFailed, setisFailed] = useState(false);

    const [chatbot, setChatbot] = useState<Chatbot | null>(null);
    const [isLoading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        description: '',
        role: '',
        file: null
    });

    const pathname = usePathname();
    const parts = pathname.split('/');
    const chatbotId = parseInt(parts[4], 10);

    useEffect(() => {
        if (chatbotId) {
            const fetchData = async () => {
            try {
                const response = await fetch('/api/chatbot_data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 'chatbotid': chatbotId }),
                });
                if (response.ok){
                    const result = await response.json();
                    setChatbot(result.chatbot);
                    setFormData({
                        description: result.chatbot.description || '',
                        role: result.chatbot.role || '',
                        file: null // Presuming you handle file separately or reset it
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
            };
        
            fetchData();
        }
    }, [chatbotId]);

    console.log(formData)

    console.log(formData)
    const handleChange = (event: { target: { name: any; value: any;}; }) => {
      const { name, value } = event.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: { target: { files: any; }; }) => {
    const { files } = event.target;
    setFormData(prev => ({ ...prev, file: files[0] }));
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Post data to the API
    let document_name = null
    let document_url = null

    if (formData.file) {
        const fileform = new FormData();
        fileform.append('username', username);
        fileform.append('chatbotid', chatbotId.toString());
    
        await fetch('http://127.0.0.1:5003/api/deletepdf', {
            method: 'POST',
            body: fileform,
        });

        fileform.append('file', formData.file);
        console.log(formData.file)
        
        const response = await fetch('http://127.0.0.1:5003/api/uploadpdf', {
            method: 'POST',
            body: fileform,
          });
          if (response.ok) {
            const result = await response.json();
            console.log(result)
            console.log('File URL:', result.file_url); 
            console.log('File Name:', result.file_name); 
            document_url = result.file_url
            document_name = result.file_name
          } else {
            throw new Error('Failed to upload file');
          }
    }

    const response = await fetch('/api/update_chatbot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'id':chatbotId, 'description':formData.description, 'role':formData.role, 'document_name':document_name, 'document_url':document_url}),
    });

    if (response.ok) {
        console.log('Chatbot updated successfully');
            router.push(`/user/${username}/chatbots/${chatbotId}`); // Use the retrieved chatbot ID
            router.refresh()
    } else {
        setisFailed(true)
        console.error('Failed to update chatbot');
    }
  };

  const deleteChatbot = async (id: number) => {
    try {
        const fileform = new FormData();
        fileform.append('username', username);
        fileform.append('chatbotid', chatbotId.toString());

        await fetch('http://127.0.0.1:5003/api/deletepdf', {
            method: 'POST',
            body: fileform,
        });

        const response = await fetch(`/api/chatbot_data`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'chatbotid' : id}),
        });
        if (!response.ok) {
            throw new Error('Failed to delete the chatbot');
        }
        router.push(`/user/${username}/chatbots`);
        router.refresh()
    } catch (error) {
        console.error('Error:', error);
    }
  };
      if (isLoading) return <ChatbotLoadingSkeleton/>
      if (!chatbot) return <p>No profile data</p>

  return (
    <div className="flex flex-col items-center py-8">
      <div className="flex space-x-8 bg-white justify-between items-center shadow-inner shadow-secondary rounded"> 
      <h1 className="text-xl md:text-3xl font-bold text-primary pl-8">
            {chatbot.name}
        </h1>
        <button onClick={() => deleteChatbot(chatbotId)} className="bg-primary hover:bg-accent text-white font-bold py-2 px-4 rounded">
            Delete
        </button>
        </div>
        <div className="flex flex-col justify-center items-center pt-8">
                <div className="p-8 border rounded-md shadow-lg bg-light md:w-[35rem]"> {/* Adjusted width here */}
                    <h2 className="text-lg font-semibold text-tc mb-4">Configure {chatbot.name}</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                        <label htmlFor="description" className="text-sm font-medium text-tc">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-a78bfa rounded-md"
                            rows={4} // Set the initial number of rows
                            style={{ resize: "vertical" }} // Allows resizing only vertically
                        />
                        </div>
                        <div>
                            <label htmlFor="description" className="text-sm font-medium text-tc">Role</label>
                            <textarea
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 border border-a78bfa rounded-md"
                                rows={4} // Set the initial number of rows
                                style={{ resize: "vertical" }} // Allows resizing only vertically
                            />
                        </div>
                        <div>
                            {chatbot && chatbot.document_name && (
                                <label htmlFor="file" className="text-sm font-medium text-tc">PDF ({chatbot.document_name})</label>
                            )}
                          {!chatbot.document_name && (
                            <label htmlFor="file" className="text-sm font-medium text-tc">PDF</label>
                          )}
                          <input
                              type="file"
                              id="file"
                              name="file"
                              onChange={handleFileChange}
                              className="mt-1 block w-full px-3 py-2 border border-a78bfa rounded-md"
                              accept="application/pdf"
                          />
                      </div>
                        {isFailed && (
                            <div className="text-sm font-medium text-error">Internal error occured. Try again</div>
                        )}
                        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-light bg-primary hover:bg-gray-700">
                            Save
                        </button>
                    </form>
                </div>
            </div>
    </div>
  );
}

export default Form;