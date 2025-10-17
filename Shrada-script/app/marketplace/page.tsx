"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, ShoppingCart, Download, Star, Eye, FileText, Calendar, User, Tag, ChevronDown, Check, X, IndianRupee, Sparkles, TrendingUp, Clock, ChevronLeft, ChevronRight } from "lucide-react";

interface Script {
  id: string;
  title: string;
  description: string;
  author: string;
  state: string;
  genre: string;
  price: number;
  rating: number;
  reviews: number;
  downloads: number;
  duration: string;
  thumbnail: string;
  tags: string[];
  featured: boolean;
  publishedDate: string;
}

const MOCK_SCRIPTS: Script[] = [
  {
    id: "1",
    title: "Monuments of Rajasthan",
    description: "A captivating journey through the royal heritage and architectural marvels of Rajasthan's historic forts and palaces.",
    author: "Priya Sharma",
    state: "Rajasthan",
    genre: "Documentary",
    price: 499,
    rating: 4.8,
    reviews: 124,
    downloads: 1543,
    duration: "15 min",
    thumbnail: "https://picsum.photos/seed/raj1/300/400",
    tags: ["Heritage", "Architecture", "Tourism"],
    featured: true,
    publishedDate: "2024-10-10"
  },
  {
    id: "2",
    title: "Flavors of Kerala",
    description: "Explore the authentic culinary traditions and spice-rich recipes that make Kerala's cuisine world-renowned.",
    author: "Arun Kumar",
    state: "Kerala",
    genre: "Food & Culture",
    price: 399,
    rating: 4.9,
    reviews: 203,
    downloads: 2156,
    duration: "12 min",
    thumbnail: "https://picsum.photos/seed/kerala1/300/400",
    tags: ["Food", "Culture", "Traditional"],
    featured: true,
    publishedDate: "2024-10-05"
  },
  {
    id: "3",
    title: "Punjab's Festival Spirit",
    description: "Experience the vibrant celebrations, folk music, and dance forms that define Punjab's festive culture.",
    author: "Manpreet Singh",
    state: "Punjab",
    genre: "Cultural",
    price: 349,
    rating: 4.7,
    reviews: 89,
    downloads: 876,
    duration: "10 min",
    thumbnail: "https://picsum.photos/seed/punjab1/300/400",
    tags: ["Festival", "Music", "Dance"],
    featured: false,
    publishedDate: "2024-09-28"
  },
  {
    id: "4",
    title: "Tamil Nadu Temples Tour",
    description: "A spiritual journey through ancient Dravidian temples showcasing magnificent architecture and devotional traditions.",
    author: "Lakshmi Venkat",
    state: "Tamil Nadu",
    genre: "Documentary",
    price: 449,
    rating: 4.9,
    reviews: 167,
    downloads: 1923,
    duration: "18 min",
    thumbnail: "https://picsum.photos/seed/tn1/300/400",
    tags: ["Spiritual", "Architecture", "History"],
    featured: true,
    publishedDate: "2024-10-12"
  },
  {
    id: "5",
    title: "Maharashtra's Art Forms",
    description: "Discover traditional Maharashtrian art, craft, and performance traditions passed down through generations.",
    author: "Sneha Patil",
    state: "Maharashtra",
    genre: "Art & Craft",
    price: 299,
    rating: 4.6,
    reviews: 72,
    downloads: 654,
    duration: "8 min",
    thumbnail: "https://picsum.photos/seed/mh1/300/400",
    tags: ["Art", "Craft", "Traditional"],
    featured: false,
    publishedDate: "2024-09-15"
  },
  {
    id: "6",
    title: "West Bengal Cultural Heritage",
    description: "Immerse in the rich literary, artistic, and cultural legacy of Bengal, from Tagore to contemporary expressions.",
    author: "Riya Chatterjee",
    state: "West Bengal",
    genre: "Cultural",
    price: 379,
    rating: 4.8,
    reviews: 145,
    downloads: 1234,
    duration: "14 min",
    thumbnail: "https://picsum.photos/seed/wb1/300/400",
    tags: ["Literature", "Art", "Music"],
    featured: false,
    publishedDate: "2024-10-01"
  },
  {
    id: "7",
    title: "Gujarat's Business Legacy",
    description: "Explore Gujarat's entrepreneurial spirit and business heritage that has shaped India's economic landscape.",
    author: "Amit Patel",
    state: "Gujarat",
    genre: "Documentary",
    price: 429,
    rating: 4.7,
    reviews: 98,
    downloads: 1102,
    duration: "13 min",
    thumbnail: "https://picsum.photos/seed/guj1/300/400",
    tags: ["Business", "History", "Culture"],
    featured: false,
    publishedDate: "2024-09-20"
  },
  {
    id: "8",
    title: "Himachal's Mountain Magic",
    description: "Journey through the pristine valleys, ancient monasteries, and adventure spots of Himachal Pradesh.",
    author: "Rohan Thakur",
    state: "Himachal Pradesh",
    genre: "Travel",
    price: 359,
    rating: 4.8,
    reviews: 156,
    downloads: 1678,
    duration: "16 min",
    thumbnail: "https://picsum.photos/seed/hp1/300/400",
    tags: ["Adventure", "Nature", "Tourism"],
    featured: true,
    publishedDate: "2024-10-08"
  }
];

const GENRES = ["All", "Documentary", "Cultural", "Food & Culture", "Art & Craft", "Travel"];
const STATES = ["All States", "Rajasthan", "Kerala", "Punjab", "Tamil Nadu", "Maharashtra", "West Bengal", "Gujarat", "Himachal Pradesh"];

export default function MarketplacePage() {
  const [scripts] = useState<Script[]>(MOCK_SCRIPTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedState, setSelectedState] = useState("All States");
  const [showFilters, setShowFilters] = useState(false);
  const [cart, setCart] = useState<string[]>([]);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);

  function filterScripts(genre: string, state: string) {
    let filtered = [...scripts];

    if (searchQuery) {
      filtered = filtered.filter(script =>
        script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (genre !== "All") {
      filtered = filtered.filter(script => script.genre === genre);
    }

    if (state !== "All States") {
      filtered = filtered.filter(script => script.state === state);
    }

    return filtered;
  }

  function addToCart(scriptId: string) {
    if (!cart.includes(scriptId)) {
      setCart([...cart, scriptId]);
    }
  }

  function removeFromCart(scriptId: string) {
    setCart(cart.filter(id => id !== scriptId));
  }

  const featuredScripts = scripts.filter(s => s.featured);
  const documentaryScripts = filterScripts("Documentary", "All States");
  const culturalScripts = filterScripts("Cultural", "All States");
  const foodScripts = filterScripts("Food & Culture", "All States");
  const travelScripts = filterScripts("Travel", "All States");

  const totalCartValue = cart.reduce((sum, id) => {
    const script = scripts.find(s => s.id === id);
    return sum + (script?.price || 0);
  }, 0);

  function ScrollableRow({ title, scripts, icon }: { title: string; scripts: Script[]; icon?: React.ReactNode }) {
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
      if (scrollRef.current) {
        const scrollAmount = 400;
        scrollRef.current.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
      }
    };

    if (scripts.length === 0) return null;

    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {icon}
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{title}</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {scripts.map(script => (
            <div 
              key={script.id} 
              className="flex-shrink-0 w-48 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-xl transition-all group cursor-pointer"
              onClick={() => setSelectedScript(script)}
            >
              <div className="relative">
                <img 
                  src={script.thumbnail} 
                  alt={script.title} 
                  className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {script.featured && (
                  <div className="absolute top-2 left-2 bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded">
                    Featured
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-3 left-3 right-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        cart.includes(script.id) ? removeFromCart(script.id) : addToCart(script.id);
                      }}
                      className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                        cart.includes(script.id)
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-neutral-900 hover:bg-neutral-100'
                      }`}
                    >
                      {cart.includes(script.id) ? "✓ In Cart" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1 line-clamp-2 text-sm leading-tight">
                  {script.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">{script.rating}</span>
                  </div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-500">({script.reviews})</span>
                </div>

                <div className="flex items-center gap-1 text-neutral-900 dark:text-neutral-100 font-bold">
                  <IndianRupee className="w-4 h-4" />
                  <span>{script.price}</span>
                </div>

                <div className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                  {script.author}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-28 bg-neutral-50 dark:bg-neutral-950">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-500 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Script Marketplace
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 tracking-tight">
            Discover Premium Scripts
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Professional video scripts crafted by experienced writers, ready to bring your vision to life
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-sm">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search scripts, authors, tags..."
                  className="w-full pl-12 pr-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>

            {showFilters && (
              <div className="flex gap-4 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 text-sm"
                >
                  {GENRES.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>

                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 text-sm"
                >
                  {STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Horizontal Scrollable Sections */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <ScrollableRow 
          title="Featured Scripts" 
          scripts={featuredScripts}
          icon={<TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-500" />}
        />

        <ScrollableRow 
          title="Documentary Scripts" 
          scripts={documentaryScripts}
          icon={<FileText className="w-6 h-6 text-blue-600 dark:text-blue-500" />}
        />

        <ScrollableRow 
          title="Cultural Heritage" 
          scripts={culturalScripts}
          icon={<Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-500" />}
        />

        <ScrollableRow 
          title="Food & Festivals" 
          scripts={foodScripts}
          icon={<Star className="w-6 h-6 text-red-600 dark:text-red-500" />}
        />

        <ScrollableRow 
          title="Travel Adventures" 
          scripts={travelScripts}
          icon={<Clock className="w-6 h-6 text-green-600 dark:text-green-500" />}
        />
      </section>

      {/* Floating Cart */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 w-80 z-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-950/30 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-orange-600 dark:text-orange-500" />
              </div>
              <h3 className="font-bold text-neutral-900 dark:text-neutral-100">Cart ({cart.length})</h3>
            </div>
            <button
              onClick={() => setCart([])}
              className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {cart.map(scriptId => {
              const script = scripts.find(s => s.id === scriptId);
              if (!script) return null;
              return (
                <div key={scriptId} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-700 dark:text-neutral-300 flex-1 line-clamp-1">{script.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">₹{script.price}</span>
                    <button
                      onClick={() => removeFromCart(scriptId)}
                      className="text-neutral-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-600 dark:text-neutral-400">Total</span>
              <div className="flex items-center gap-1 text-xl font-bold text-neutral-900 dark:text-neutral-100">
                <IndianRupee className="w-5 h-5" />
                {totalCartValue}
              </div>
            </div>
          </div>

          <button className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Checkout
          </button>
        </div>
      )}

      {/* Script Preview Modal */}
      {selectedScript && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setSelectedScript(null)}>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Script Preview</h2>
              <button
                onClick={() => setSelectedScript(null)}
                className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <img src={selectedScript.thumbnail} alt={selectedScript.title} className="w-full aspect-[3/4] object-cover rounded-xl shadow-lg mb-4" />
                  
                  <div className="bg-neutral-50 dark:bg-neutral-950 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-neutral-600 dark:text-neutral-400">Price</span>
                      <div className="flex items-center gap-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                        <IndianRupee className="w-7 h-7" />
                        {selectedScript.price}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (cart.includes(selectedScript.id)) {
                          removeFromCart(selectedScript.id);
                        } else {
                          addToCart(selectedScript.id);
                        }
                      }}
                      className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                        cart.includes(selectedScript.id)
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90'
                      }`}
                    >
                      {cart.includes(selectedScript.id) ? (
                        <>
                          <Check className="w-5 h-5" />
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">{selectedScript.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {selectedScript.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {selectedScript.duration}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">{selectedScript.rating}</span>
                        <span className="text-neutral-500 dark:text-neutral-500">({selectedScript.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                        <Download className="w-4 h-4" />
                        {selectedScript.downloads.toLocaleString()} downloads
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Description</h4>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{selectedScript.description}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-600 dark:text-neutral-400">Genre</span>
                        <span className="text-neutral-900 dark:text-neutral-100 font-medium">{selectedScript.genre}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600 dark:text-neutral-400">State</span>
                        <span className="text-neutral-900 dark:text-neutral-100 font-medium">{selectedScript.state}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600 dark:text-neutral-400">Published</span>
                        <span className="text-neutral-900 dark:text-neutral-100 font-medium">{new Date(selectedScript.publishedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedScript.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}