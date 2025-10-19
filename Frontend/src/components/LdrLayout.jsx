import React from 'react';

export default function LdrLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}