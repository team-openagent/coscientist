'use client';

import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-#1d1d1f backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-2">
                             <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                 <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                 </svg>
               </div>
              <h1 className="text-xl font-bold text-blue-600">
                AI Coscientist
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
                             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
