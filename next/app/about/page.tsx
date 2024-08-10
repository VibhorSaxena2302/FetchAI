import type { NextPage } from 'next';
import Navbar from '../ui/navbar';
import { cookies } from 'next/headers'
import Link from 'next/link';

const Home: NextPage = () => {
  const cookieStore = cookies()
  const cookieObject = cookieStore.get('username')
  const username = cookieObject ? cookieObject.value : 'undefined';

  return (
    <div>
      <Navbar username={username}/>
      <main className="max-w-6xl mx-auto mt-12 mb-6 px-4 sm:px-6 lg:px-8">
      <div className="relative bg-white overflow-hidden rounded py-4 shadow">
        <div className='px-10 py-10'>
        <h1 className="text-center text-4xl font-bold text-primary">
          About uChat
        </h1>
        <p className="text-center mt-4 text-lg text-tc">
          uChat is a revolutionary platform where you can create and customize chatbots using the latest language model technologies.
        </p>
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-primary">Features:</h2>
          <ul className="list-disc pl-5 mt-2 text-tc">
            <li>
              <strong className='text-primary'>Personality Traits:</strong> Customize your chatbot’s personality to fit the specific needs of your audience or personal preference.
            </li>
            <li>
              <strong className='text-primary'>LLM Model:</strong> Utilize state-of-the-art language learning models to process and understand natural language more effectively.
            </li>
            <li>
              <strong className='text-primary'>Document Inference:</strong> Upload PDF documents and enable your chatbot to extract and learn information, making it smarter and more helpful.
            </li>
            <li>
              <strong className='text-primary'>Customizable Bots:</strong> Each user can create and tailor chatbots according to their specific requirements, enhancing interaction and engagement.
            </li>
          </ul>
        </div>
        <div className="mt-8">
          <Link href="/signup" className="bg-primary hover:bg-accent text-white font-bold py-2 px-4 rounded">
              Start Creating Your Chatbot
          </Link>
        </div>
        </div>
        </div>
      </main>
    </div>
  );
}

export default Home;