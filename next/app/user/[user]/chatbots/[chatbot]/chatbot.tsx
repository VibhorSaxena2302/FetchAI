"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

type ChatbotProps = {
  username?: string;
};

const Chatbot: React.FC<ChatbotProps> = ({username = 'undefined'}) => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<{ sender: string; text: string }[]>([]);

    const pathname = usePathname();
    const parts = pathname.split('/');
    const chatbotId = parseInt(parts[4], 10);

    console.log(chatbotId)

    const handleMessageSend = async () => {
        if (!message.trim()) return;
    
        addMessageToChat('user', message);
        addMessageToChat('bot', message);
        setMessage('');
        // const loadingBubble = addLoadingIndicator();
    
        // try {
        //   const response = await fetch('http://127.0.0.1:5000/chat', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ query: message }),
        //   });
    
        //   loadingBubble.remove();
        //   const reader = response.body?.getReader();
        //   const decoder = new TextDecoder();
        //   let buffer = '';
    
        //   if (reader) {
        //     const readChunk = async () => {
        //       const { done, value } = await reader.read();
        //       if (done) {
        //         if (buffer) addMessageToChat('bot', buffer);
        //         return;
        //       }
    
        //       buffer += decoder.decode(value, { stream: true });
        //       const messages = buffer.split('\n');
        //       buffer = messages.pop() || '';
        //       messages.forEach((msg) => {
        //         if (msg) addMessageToChat('bot', msg);
        //       });
    
        //       readChunk();
        //     };
    
        //     readChunk();
        //   }
        // } catch (error) {
        //   console.error('Error:', error);
        //   loadingBubble.remove();
        //   addMessageToChat('bot', "Sorry, there was an error processing your request.");
        // }
      };
    
      const addMessageToChat = (sender: string, text: string) => {
        setChatHistory((prevHistory) => [...prevHistory, { sender, text }]);
      };
    
      const addLoadingIndicator = () => {
        const loadingIndicator = { sender: 'bot', text: '...' };
        setChatHistory((prevHistory) => [...prevHistory, loadingIndicator]);
        return {
          remove: () => setChatHistory((prevHistory) => prevHistory.filter((msg) => msg !== loadingIndicator)),
        };
      };
    
      useEffect(() => {
        console.log(chatHistory.length)
        if (chatHistory.length == 0){
            addMessageToChat('bot', "Hi! How can i help you today?");
        }
      }, [chatHistory]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl md:text-3xl font-bold text-primary py-8">
            Chatbot
        </h1>
      <div className="text-xs md:text-base chat-container w-2/3 max-w-4xl bg-white shadow-md rounded-lg mt-5 p-5 flex flex-col overflow-y-auto h-[30rem]">
        {chatHistory.length > 0 && chatHistory.map((msg, index) => (
          <div key={index} className={`chat-bubble ${msg.sender === 'user' ? 'self-end bg-primary text-white' : 'self-start bg-primary text-white'} p-3 m-1 rounded-xl`}>
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