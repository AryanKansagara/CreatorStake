import { CreatorCard } from "@/components/CreatorCard";

// Mock data for creators
const mockCreators = [
  {
    id: "1",
    name: "Alex Rivera",
    handle: "@alexcreates",
    discoveryIndex: 8.7,
    category: "Tech & Gaming",
    followers: "2.4K",
    growth: "+145%",
    investmentAmount: 50,
    totalBackers: 234,
    content: "Building the future of indie games. Join me on this journey! 🎮",
    avatar: "https://unsplash.com/photos/man-sitting-on-gray-concrete-wall-_M6gy9oHgII",
    creatorImage: "/user5.jpg",
  },
  {
    id: "2",
    name: "Sarah Chen",
    handle: "@sarahstyle",
    discoveryIndex: 9.2,
    category: "Fashion & Lifestyle",
    followers: "5.1K",
    growth: "+203%",
    investmentAmount: 100,
    totalBackers: 567,
    content: "Sustainable fashion for the modern world. Let's change the industry together! 🌱",
    creatorImage: "/user3.jpg",
  },
  {
    id: "3",
    name: "Marcus Johnson",
    handle: "@marcusmusic",
    discoveryIndex: 7.9,
    category: "Music Production",
    followers: "3.8K",
    growth: "+178%",
    investmentAmount: 75,
    totalBackers: 412,
    content: "Creating beats that move souls. Your support means everything! 🎵",
    creatorImage: "/user2.jpg",
  },
  {
    id: "4",
    name: "Emma Thompson",
    handle: "@emmaeducates",
    discoveryIndex: 8.5,
    category: "Education & Science",
    followers: "4.2K",
    growth: "+189%",
    investmentAmount: 60,
    totalBackers: 389,
    content: "Making science fun and accessible for everyone. Let's learn together! 🔬",
    creatorImage: "/user1.jpg",
  },
];

export const DiscoveryFeed = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Rising Stars</h2>
            <p className="text-muted-foreground">
              High-potential creators ranked by our discovery algorithm
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
              All
            </button>
            <button className="px-4 py-2 rounded-lg bg-card text-foreground text-sm font-medium hover:bg-card/80 transition-colors">
              Tech
            </button>
            <button className="px-4 py-2 rounded-lg bg-card text-foreground text-sm font-medium hover:bg-card/80 transition-colors">
              Music
            </button>
            <button className="px-4 py-2 rounded-lg bg-card text-foreground text-sm font-medium hover:bg-card/80 transition-colors">
              Fashion
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockCreators.map((creator) => (
            <CreatorCard key={creator.id} {...creator} />
          ))}
        </div>
      </div>
    </section>
  );
};
