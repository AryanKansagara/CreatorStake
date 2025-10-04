import React from "react";

export default function CreatorProfile() {
  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center p-6">
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between border-b border-white/20 pb-4 mb-6">
        <h1 className="text-2xl font-bold">Creator Profile</h1>
        <button className="glass-button px-4 py-2 bg-white text-black hover:bg-white/90 rounded-lg font-semibold">
          Follow
        </button>
      </div>

      {/* Profile Section */}
      <div className="w-full max-w-4xl glass-card p-6 mb-8 rounded-xl">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-white/20">
            <img 
              src="/user2.jpg" 
              alt="Creator" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold">Sarah Chen</h2>
            <p className="text-muted-foreground">@sarahstyle</p>
            <p className="mt-4 text-foreground/80">
              Fashion designer with a focus on sustainable, ethical clothing. My work has been featured in Vogue and displayed at Paris Fashion Week. Looking to expand my brand and create a positive impact on the fashion industry.
            </p>
            
            {/* Stats Section */}
            <div className="flex justify-center md:justify-start space-x-8 mt-6">
              <div className="glass p-3 rounded-lg text-center">
                <p className="text-xl font-bold">12.5k</p>
                <p className="text-muted-foreground text-sm">Followers</p>
              </div>
              <div className="glass p-3 rounded-lg text-center">
                <p className="text-xl font-bold">320</p>
                <p className="text-muted-foreground text-sm">Investors</p>
              </div>
              <div className="glass p-3 rounded-lg text-center">
                <p className="text-xl font-bold">$4.2k</p>
                <p className="text-muted-foreground text-sm">Raised</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Stats */}
      <div className="w-full max-w-4xl glass-card p-6 mb-8 rounded-xl">
        <h3 className="text-xl font-bold mb-4">Investment Opportunities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Current Valuation</p>
            <p className="text-2xl font-bold">$85,000</p>
          </div>
          <div className="glass p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Minimum Investment</p>
            <p className="text-2xl font-bold">50 tokens</p>
          </div>
          <div className="glass p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Price per Token</p>
            <p className="text-2xl font-bold">$10</p>
          </div>
          <div className="glass p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Projected ROI (1yr)</p>
            <p className="text-2xl font-bold text-accent">+65%</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex mt-6 space-x-4">
          <button className="glass-button px-6 py-3 bg-white text-black hover:bg-white/90 rounded-lg font-semibold flex-1">
            Invest Now
          </button>
          <button className="glass-button px-6 py-3 rounded-lg flex-1">
            Message Creator
          </button>
        </div>
      </div>

      {/* Content Portfolio */}
      <div className="w-full max-w-4xl mb-8">
        <h3 className="text-xl font-bold mb-4">Portfolio Highlights</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['/user1.jpg', '/user2.jpg', '/user3.jpg', '/user5.jpg', '/user1.jpg', '/user2.jpg'].map((img, id) => (
            <div
              key={id}
              className="glass h-48 rounded-lg overflow-hidden"
            >
              <img 
                src={img} 
                alt={`Portfolio item ${id+1}`} 
                className="w-full h-full object-cover hover:scale-105 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
