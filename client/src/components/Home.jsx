import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to Our Site</h1>
      <p className="text-lg mb-4">This is the main content area of your homepage.</p>
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-3">Featured Content</h2>
        <p>You can add your components, images, or other content here.</p>
      </div>
    </div>
  );
};

export default HomePage;