"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
      // Logout
  };

  let isLoggedIn = false;  // This will check if the user is logged in or not

  return (
    <nav className="bg-light shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <button
          className="md:hidden flex items-center px-1 py-1 border rounded text-primary border-secondary"
          onClick={() => setIsOpen(!isOpen)}
        >
           <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
        </button>
        {!isOpen && (
            <Link href="/" className="px-4 font-bold text-xl text-primary">
            Platform Starter Kit
            </Link>
        )}

        <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-primary hover:text-accent py-2">
            Home
          </Link>
          <Link href="/services" className="text-primary hover:text-accent py-2">
            Services
          </Link>
          <Link href="/about" className="text-primary hover:text-accent py-2">
            About
          </Link>
        </div>

        {!isLoggedIn && (
          <div className="hidden md:flex space-x-8 shadow-inner shadow-secondary rounded items-center">
            <Link href="/login" className="text-primary hover:text-accent py-2 pl-8">
              Login
            </Link>
            <Link href="/signup" className="py-2 pl-4 pr-4 font-medium text-white bg-primary rounded hover:bg-accent">
              Sign Up
            </Link>
          </div>
        )}

        {isLoggedIn && (
          <div className="hidden md:flex space-x-8 shadow-inner shadow-secondary rounded items-center">
            <button className="py-2 pl-4 pr-4 font-medium text-white bg-primary rounded hover:bg-accent" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
        

        {isOpen && (
            <div className='md:hidden flex space-x-2'>
                <div className='md:hidden flex space-x-2'>
                    <Link href="/" className="block py-2 text-sm text-primary hover:text-accent">
                    Home
                    </Link>
                    <Link href="/services" className="block py-2 text-sm text-primary hover:text-accent">
                    Services
                    </Link>
                    <Link href="/about" className="block py-2 text-sm text-primary hover:text-accent">
                    About
                    </Link>
                </div>
                {!isLoggedIn && (
                  <div className="md:hidden flex space-x-1 shadow-inner shadow-secondary rounded">
                      <Link href="/login" className="block py-2 pl-2 text-sm text-primary hover:text-accent">
                      Login
                      </Link>
                      <Link href="/signup"className="block py-2 pl-2 pr-2 text-sm text-white bg-primary rounded hover:bg-accent">
                      SignUp
                      </Link>
                  </div>
                )}
                {isLoggedIn && (
                  <div className="md:hidden flex space-x-1 shadow-inner shadow-secondary rounded">
                      <button className="block py-2 pl-2 pr-2 text-sm text-white bg-primary rounded hover:bg-accent" onClick={handleLogout}>
                      Logout
                      </button>
                  </div>
                )}
            </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;