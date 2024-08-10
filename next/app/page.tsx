import type { NextPage } from 'next';
import Navbar from './ui/navbar';
import { cookies } from 'next/headers'
import Link from 'next/link';
import Image from 'next/image';

const Home: NextPage = () => {
  const cookieStore = cookies()
  const cookieObject = cookieStore.get('username')
  const username = cookieObject ? cookieObject.value : 'undefined';

  return (
    <div>
      <Navbar username={username}/>
      <main className="max-w-6xl mx-auto mt-12 mb-6 px-4 sm:px-6 lg:px-8">
      <div className="relative bg-white overflow-hidden rounded py-4 shadow">
        <div className="max-w-7xl mx-auto h-[23rem]">
          <div className="relative z-10 bg-white lg:max-w-2xl lg:w-full mt-10">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="#7c3aed"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>
            <main className="mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-bold text-primary sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Welcome to uChat</span>
                </h1>
                <p className="mt-3 text-base text-primary sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Empower your communication with custom chatbots that understand your documents.
                </p>
                <div className="mt-8 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link href="/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-accent md:py-4 md:text-lg md:px-10">
                      Get started
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}

export default Home;