import type { NextPage } from 'next';
import Navbar from '@/app/ui/navbar';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Chatbot from './chatbot';

const ChatbotPage: NextPage = () => {
  const cookieStore = cookies()

  const cookieObject = cookieStore.get('username')
  const username = cookieObject ? cookieObject.value : 'undefined';

  if (username=='undefined'){
    redirect('/')
  }

  return (
    <div>
      <Navbar username={username}/>
      <Chatbot username={username}/>
    </div>
  );
}

export default ChatbotPage;