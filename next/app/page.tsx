import type { NextPage } from 'next';
import Navbar from './components/navbar';

const Home: NextPage = () => {
  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto mt-12 mb-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-3xl font-bold text-primary">
          Welcome to Platform Starter Kit
        </h1>
        <p className="text-center text-xl text-secondary">
          This is a template home page using Tailwind CSS.
        </p>
      </main>
    </div>
  );
}

export default Home;