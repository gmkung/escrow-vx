import React from 'react';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-white text-gray-800 p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center space-x-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 2L3 9L3 15L12 22L21 15L21 9L12 2Z" />
                    <path d="M12 2L12 22" />
                    <path d="M3 9L21 9" />
                    <path d="M3 15L21 15" />
                    <path d="M12 2L7.5 6L16.5 6L12 2Z" />
                    <path d="M12 22L7.5 18L16.5 18L12 22Z" />
                    <path d="M3 9L7.5 6" />
                    <path d="M21 9L16.5 6" />
                    <path d="M3 15L7.5 18" />
                    <path d="M21 15L16.5 18" />
                </svg>

                <div className="flex items-center space-x-16">
                    <a href="/setup" className="hover:text-blue-500">Setup</a>
                    <a href="/community-checker" className="hover:text-blue-500">Community Checker</a>
                    <a href="/my-transactions" className="hover:text-blue-500">My Transactions</a>
                </div>
            </div>
            <div className="flex space-x-4">
                <button className="bg-gray-200 px-4 py-2 rounded-full hover:bg-gray-300">Get the app</button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">Connect</button>
            </div>
        </nav>
    );
};

export default Navbar; 