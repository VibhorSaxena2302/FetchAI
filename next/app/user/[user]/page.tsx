import type { NextPage } from 'next';
import Navbar from '../../ui/navbar';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const UserHomePage: NextPage = () => {
  const cookieStore = cookies()
  const cookieObject = cookieStore.get('username')
  const username = cookieObject ? cookieObject.value : 'undefined';

  if (username=='undefined'){
    redirect('/')
  }

  return (
    <div>
      <Navbar username={username}/>
      <main className="max-w-6xl mx-auto mt-12 mb-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-3xl font-bold text-primary">
          Welcome to your home page, User {username}!
        </h1>
        <p className="text-center text-xl text-secondary">
          This is a template home page using Tailwind CSS.
        </p>
      </main>
    </div>
  );
}

export default UserHomePage;