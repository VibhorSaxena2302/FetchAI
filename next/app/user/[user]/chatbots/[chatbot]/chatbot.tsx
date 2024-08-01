"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChatbotLoadingSkeleton } from '@/app/ui/skeletons';

type ChatbotProps = {
  username?: string;
};

interface Chatbot {
  name: string;
  description: string | null;
}

const Chatbot: React.FC<ChatbotProps> = ({username = 'undefined'}) => {
    const [chatbot, setChatbot] = useState<Chatbot | null>(null);
    const [isLoading, setLoading] = useState(true)

    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<{ sender: string; text: string }[]>([]);

    const pathname = usePathname();
    const parts = pathname.split('/');
    const chatbotId = parseInt(parts[4], 10);

    useEffect(() => {
        if (chatbotId) {
            const fetchData = async () => {
            try {
                console.log(chatbotId)
                const response = await fetch('/api/chatbot_data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 'chatbotid': chatbotId }),
                });
                const result = await response.json();
                setChatbot(result.chatbot);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
            };
        
            fetchData();
        }
    }, [chatbotId]);

    const addMessageToChat = (sender:string, text:string, append = false) => {
      setChatHistory((prevHistory) => {
        if (append && prevHistory.length > 0) {
          const lastMessage = prevHistory[prevHistory.length - 1];
          if (lastMessage.sender === sender) {
            // Append text to the last message of the same sender
            return [
              ...prevHistory.slice(0, prevHistory.length - 1),
              { ...lastMessage, text: lastMessage.text + text }
            ];
          }
        }
        return [...prevHistory, { sender, text }];
      });
    };

      const addLoadingIndicator = () => {
        const loadingIndicator = { sender: 'bot', text: '...' };
        setChatHistory((prevHistory) => [...prevHistory, loadingIndicator]);
        return {
          remove: () => setChatHistory((prevHistory) => prevHistory.filter((msg) => msg !== loadingIndicator)),
        };
      };

      const handleMessageSend = async () => {
        if (!message.trim()) return;
      
        addMessageToChat('user', message);
        setMessage('');
        const loadingIndicator = addLoadingIndicator();
      
        try {
          console.log('JIII');
          const response = await fetch('http://127.0.0.1:5000/llm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: message }),
          });
      
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
      
          if (reader) {
            const readChunk = async () => {
              const { done, value } = await reader.read();
              if (done) {
                if (buffer) {
                  for (const char of buffer) {
                    if (loadingIndicator){
                      loadingIndicator.remove();
                    }
                    addMessageToChat('bot', char, true);
                    await new Promise((resolve) => setTimeout(resolve, 5)); // 5 milliseconds delay
                  }
                }
                return;
              }
      
              buffer += decoder.decode(value, { stream: true });
              const messages = buffer.split('\n');
              buffer = messages.pop() || '';
      
              for (const msg of messages) {
                if (msg) {
                  for (const char of msg) {
                    if (loadingIndicator){
                      loadingIndicator.remove();
                    }
                    addMessageToChat('bot', char, true);
                    await new Promise((resolve) => setTimeout(resolve, 5)); // 5 milliseconds delay
                  }
                }
              }
      
              readChunk();
            };
      
            readChunk();
          }
        } catch (error) {
          console.error('Error:', error);
          loadingIndicator.remove();
          addMessageToChat('bot', "Sorry, there was an error processing your request.");
        }
      };
      

      if (isLoading) return <ChatbotLoadingSkeleton/>
      if (!chatbot) return <p>No profile data</p>

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl md:text-3xl font-bold text-primary py-8">
            {chatbot.name}
        </h1>
      <div className="text-xs md:text-base chat-container w-2/3 max-w-4xl bg-white shadow-md rounded-lg mt-5 p-5 flex flex-col overflow-y-auto h-[30rem]">
        {chatHistory.length > 0 && chatHistory.map((msg, index) => (
          <div key={index} className={`chat-bubble max-w-[55%] ${msg.sender === 'user' ? 'self-end bg-primary text-white' : 'self-start bg-primary text-white'} p-3 m-1 rounded-xl`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="text-sm md:text-base input-container w-2/3 max-w-4xl flex mt-5">
        <input
          type="text"
          className="flex-1 p-3 border border-primary rounded-l-xl"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleMessageSend()}
        />
        <button className="p-3 bg-primary text-white rounded-r-xl" onClick={handleMessageSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;