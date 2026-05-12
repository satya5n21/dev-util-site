import React from 'react';
import { Link } from 'react-router-dom';

const tools = [
  { path: '/jwt-decode-minify', label: 'JWT Decode / Minify JSON', description: 'Decode JWT tokens and minify JSON payloads.' },
  { path: '/payload-encr-decr', label: 'Encrypt Decrypt Payload', description: 'Encrypt an api payload or decrypt an encrypted response.' },
  { path: '/code-diff', label: 'Code Compare / Diff', description: 'Compare two blocks of code side-by-side or inline to find additions, deletions, and modifications.' },
  // Add 20+ more tools here
];

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 py-4 px-6 shadow-sm">
        <h1 className="text-3xl font-bold underline underline-offset-4 text-center">
          Welcome to Dev Utils
        </h1>
      </header>

      {/* Scrollable Grid Section */}
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tools.map((tool, idx) => (
            <Link
              key={idx}
              to={tool.path}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-none p-4 rounded-xl shadow hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200">{tool.label}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-200 mt-1">{tool.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
