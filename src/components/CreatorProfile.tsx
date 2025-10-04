import React from "react";

export default function CreatorProfile() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      {/* Header */}
      <div className="w-full flex items-center justify-between border-b border-gray-700 pb-4 mb-6">
        <h1 className="text-2xl font-bold">Creator Profile</h1>
        <button className="px-4 py-2 bg-white text-black rounded-lg font-semibold">
          Follow
        </button>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-28 h-28 rounded-full bg-gray-800 flex items-center justify-center text-3xl font-bold">
          C
        </div>
        <h2 className="text-xl font-semibold mt-4">Creator Name</h2>
        <p className="text-gray-400">@creatorhandle</p>
        <p className="mt-2 max-w-md text-gray-300">
          Short bio about the creator goes here. Passionate about music, tech, or art.
          Fans can invest early and support their growth!
        </p>
      </div>

      {/* Stats Section */}
      <div className="flex space-x-8 mb-8">
        <div className="text-center">
          <p className="text-xl font-bold">12.5k</p>
          <p className="text-gray-400 text-sm">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold">320</p>
          <p className="text-gray-400 text-sm">Investors</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold">$4.2k</p>
          <p className="text-gray-400 text-sm">Raised</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 mb-8">
        <button className="px-6 py-2 bg-white text-black rounded-lg font-semibold">
          Invest
        </button>
        <button className="px-6 py-2 border border-gray-600 rounded-lg">
          Message
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
        {[1, 2, 3, 4, 5, 6].map((id) => (
          <div
            key={id}
            className="bg-gray-800 h-40 flex items-center justify-center rounded-lg text-gray-400"
          >
            Post {id}
          </div>
        ))}
      </div>
    </div>
  );
}
