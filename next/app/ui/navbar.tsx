"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { delete_cookie } from '../lib/logout';
import { useRouter, usePathname } from 'next/navigation'

type NavbarProps = {
  username?: string;
};

const Navbar: React.FC<NavbarProps> = ({username = 'undefined'}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter()

  const handleLogout = async () => {
      const res = await delete_cookie('username')
      if (res){
        router.push('/')
      }
  };

  let isLoggedIn = false;  // This will check if the user is logged in or not
  let dashboardpath = '';

  const pathname = usePathname()
  const parts = pathname.split('/'); // This splits the URL into an array by "/"

  if (username!='undefined'){
    isLoggedIn = true
    dashboardpath = '/user/'+username+'/dashboard'
  }

  useEffect(() => {
    if (isLoggedIn && parts[1]=='user' && username!=parts[2]) {
        router.push('/');
    }
  });

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
            <Link href={dashboardpath} className="text-primary hover:text-accent py-2 pl-8">
              Dashboard
            </Link>
            <button className="py-2 pl-4 pr-4 font-medium text-white bg-primary rounded hover:bg-accent" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
        

        {isOpen && (
            <div className='md:hidden flex space-x-2'>
                <div className='md:hidden flex space-x-2'>
                    <Link href="/" className="block py-2 text-xs text-primary hover:text-accent">
                    Home
                    </Link>
                    <Link href="/services" className="block py-2 text-xs text-primary hover:text-accent">
                    Services
                    </Link>
                    <Link href="/about" className="block py-2 text-xs text-primary hover:text-accent">
                    About
                    </Link>
                </div>
                {!isLoggedIn && (
                  <div className="md:hidden flex space-x-1 shadow-inner shadow-secondary rounded">
                      <Link href="/login" className="block py-2 pl-2 text-xs text-primary hover:text-accent">
                      Login
                      </Link>
                      <Link href="/signup"className="block py-2 pl-2 pr-2 text-xs text-white bg-primary rounded hover:bg-accent">
                      SignUp
                      </Link>
                  </div>
                )}
                {isLoggedIn && (
                  <div className="md:hidden flex space-x-1 shadow-inner shadow-secondary rounded">
                      <Link href={dashboardpath} className="block py-2 pl-2 text-xs text-primary hover:text-accent">
                      Dashboard
                      </Link>
                      <button className="block py-2 pl-2 pr-2 text-xs text-white bg-primary rounded hover:bg-accent" onClick={handleLogout}>
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