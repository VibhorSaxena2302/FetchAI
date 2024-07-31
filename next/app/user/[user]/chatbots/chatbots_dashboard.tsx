import Link from 'next/link';
import { getChatbotsByUsername } from '@/app/lib/database';
import { cookies } from 'next/headers'

export default async function Dashboard() {
    const cookieStore = cookies()
    const cookieObject = cookieStore.get('username')
    const username = cookieObject ? cookieObject.value : 'undefined';

    const chatbots = await getChatbotsByUsername(username)

    return (
        <div>
        <main className="max-w-6xl mx-auto mt-12 mb-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
                <h1 className="text-xl md:text-3xl font-bold text-primary">
                    Here are your uChatbots, {username}!
                </h1>
                <Link href={`/user/${username}/chatbots/create`} className="bg-primary hover:bg-accent text-white font-bold py-2 px-4 rounded">
                    Add
                </Link>
            </div>
            <div className="mt-4 p-6 bg-white shadow-md rounded-lg md:w-auto">
                {chatbots && chatbots.length > 0 ? (
                    <ul>
                        {chatbots.map(chatbot => (
                            <li key={chatbot.id} className="border-b border-primary text-tc py-4">
                                <Link href={`/user/${username}/chatbots/${chatbot.id}`} className="hover:text-primary">
                                    {chatbot.name} - {chatbot.description}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>This is looking empty.</p>
                )}
            </div>
        </main>
    </div>
    );
};