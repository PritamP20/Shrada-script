'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  BookOpen, 
  Shield, 
  Languages, 
  Menu, 
  X, 
  ArrowRight, 
  Github, 
  Twitter, 
  Mail,
  Moon,
  Sun,
  Sparkles,
  Cpu,
  Archive
} from 'lucide-react';

export default function ShadaAILanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { scrollYProgress } = useScroll();
  const yTransform = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const navItems = ['Home', 'About', 'Features', 'Significance', 'Get Involved', 'Contact'];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/10 dark:bg-black/20 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">श</span>
              </div>
              <span className="text-xl font-serif font-bold text-gray-900 dark:text-white">Sharda AI</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-300 font-medium"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {item}
                </motion.a>
              ))}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/30 transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700" />}
              </button>
              <motion.button
                className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white px-6 py-2 rounded-full hover:from-orange-600 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contribute
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg bg-white/10 dark:bg-black/20"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-white/95 dark:bg-black/95 backdrop-blur-lg border-t border-white/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="block text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-300 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 text-white px-6 py-3 rounded-full hover:from-orange-600 hover:to-yellow-700 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Contribute
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 via-amber-800/70 to-yellow-900/80 dark:from-black/60 dark:via-gray-900/80 dark:to-black/70"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjAzIj4KPGNpcmNsZSBjeD0iMjkuNSIgY3k9IjI5LjUiIHI9IjI5LjUiLz4KPC9nPgo8L2c+Cjwvc3ZnPg==')] opacity-30"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-orange-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Reviving{" "}
              <span className="bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                Sharda Script
              </span>{" "}
              with AI
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Preserving the heritage of Jammu & Kashmir through intelligent restoration and translation
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button
                className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-600 hover:to-yellow-700 transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Explore Project</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                className="border-2 border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Us
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Animated Sharda Characters */}
          <motion.div 
            className="mt-16 text-6xl md:text-8xl font-serif text-orange-300/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <motion.span
              animate={{ 
                color: ['rgba(251, 146, 60, 0.5)', 'rgba(245, 158, 11, 0.8)', 'rgba(251, 146, 60, 0.5)'],
                textShadow: ['0 0 10px rgba(251, 146, 60, 0.5)', '0 0 20px rgba(245, 158, 11, 0.8)', '0 0 10px rgba(251, 146, 60, 0.5)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              शारदा
            </motion.span>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-gray-900/50 dark:to-black/30"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgMCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-6">
              The Legacy of <span className="text-orange-600">Sharda Script</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              For over a millennium, the Sharda script has been the vessel of knowledge, 
              spirituality, and culture in the Kashmir valley. Today, we're using AI to 
              ensure this precious heritage lives on.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-white/80 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-orange-200/50 dark:border-orange-500/30">
                <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                  Ancient Wisdom
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  The Sharda script, also known as Sharada, was the primary writing system 
                  for Sanskrit and Kashmiri languages from the 8th century onwards. 
                  It preserved countless philosophical texts, poetry, and historical records.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Our AI initiative aims to digitize, restore, and translate these ancient 
                  manuscripts, making them accessible to scholars and enthusiasts worldwide.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 dark:from-orange-400/10 dark:to-yellow-400/10 rounded-2xl p-8 border border-orange-200/50 dark:border-orange-500/30 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-6xl md:text-8xl font-serif text-orange-600 dark:text-orange-400 mb-6">
                    श्री गणेशाय नमः
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    Traditional Sharda Script Blessing
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-orange-50/50 dark:from-black dark:to-gray-900"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-6">
              AI-Powered <span className="text-orange-600">Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Combining cutting-edge artificial intelligence with traditional scholarship
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Archive,
                title: "Intelligent Restoration",
                description: "Advanced image processing and machine learning algorithms restore damaged and faded manuscript pages to their original clarity.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Shield,
                title: "Digital Preservation",
                description: "Secure cloud archiving and blockchain verification ensure these precious texts are preserved for future generations.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: Languages,
                title: "Multi-lingual Translation",
                description: "Neural translation models convert ancient Sharda texts into modern languages while preserving cultural context and meaning.",
                gradient: "from-purple-500 to-pink-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-white/80 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-orange-200/50 dark:border-orange-500/30 h-full hover:shadow-2xl transition-all duration-300 group-hover:border-orange-300/70 dark:group-hover:border-orange-400/50">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural Significance Section */}
      <section id="significance" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-amber-900/30 dark:from-orange-900/40 dark:to-amber-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_70%)]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <blockquote className="text-3xl md:text-4xl font-serif italic text-gray-900 dark:text-white mb-8 max-w-4xl mx-auto leading-relaxed">
              "A script that carries centuries of wisdom, now reborn with AI."
            </blockquote>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 mx-auto"></div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-8 border border-orange-200/30 dark:border-orange-500/30">
                <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                  Cultural Heritage
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  The Sharda script is more than just a writing system—it's a bridge to Kashmir's 
                  rich intellectual and spiritual heritage. From philosophical treatises to 
                  devotional poetry, these texts contain the essence of Kashmiri Pandit culture.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  By leveraging AI for restoration and translation, we're not just preserving text, 
                  but keeping alive the thoughts, dreams, and wisdom of our ancestors.
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-white font-bold">
                      {i}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Join 1000+ researchers and enthusiasts preserving our heritage
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 dark:from-orange-400/5 dark:to-yellow-400/5 rounded-2xl p-8 border border-orange-200/30 dark:border-orange-500/30">
                <div className="text-center mb-8">
                  <h4 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                    Before & After AI Restoration
                  </h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="bg-amber-100 dark:bg-amber-900/20 rounded-lg p-6 mb-3 border-2 border-dashed border-amber-300 dark:border-amber-600">
                      <div className="text-2xl font-serif text-amber-700 dark:text-amber-300 opacity-60">
                        श्री... [faded]
                      </div>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">Original Manuscript</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg p-6 mb-3 border-2 border-orange-300 dark:border-orange-500">
                      <div className="text-2xl font-serif text-orange-800 dark:text-orange-300">
                        श्री गणेशाय नमः
                      </div>
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">AI Restored</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <motion.div
                    className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>95% Accuracy Achieved</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section id="get-involved" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJkb3RzIiB4PSIwIiB5PSIwIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSIyIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3BhdHRlcm4+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNkb3RzKSIvPgo8L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8">
              Help Us Preserve the Legacy
            </h2>
            
            <p className="text-xl md:text-2xl text-orange-100 mb-12 leading-relaxed max-w-3xl mx-auto">
              Join our mission to preserve Sharda script for generations to come. 
              Whether you're a researcher, developer, or cultural enthusiast, 
              your contribution can make a lasting impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <motion.button
                className="bg-white text-orange-600 px-10 py-4 rounded-full text-lg font-bold hover:bg-orange-50 transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center justify-center space-x-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-6 h-6" />
                <span>Contribute on GitHub</span>
              </motion.button>
              
              <motion.button
                className="border-2 border-white text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Become a Collaborator
              </motion.button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-left">
              {[
                {
                  icon: BookOpen,
                  title: "Researchers",
                  description: "Share your expertise in linguistics, Sanskrit, or Kashmiri studies"
                },
                {
                  icon: Cpu,
                  title: "Developers",
                  description: "Help build and improve our AI models and digital infrastructure"
                },
                {
                  icon: Archive,
                  title: "Contributors",
                  description: "Provide manuscripts, funding, or volunteer your time"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <item.icon className="w-8 h-8 text-orange-200 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-orange-100 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 dark:bg-black text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJmb290ZXIiIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+CjwvcGF0dGVybj4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2Zvb3RlcikiLz4KPHN2Zz4=')] opacity-50"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <motion.div
                className="flex items-center space-x-3 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">श</span>
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold">Sharda AI Initiative</h3>
                  <p className="text-gray-400">Reviving Heritage with Technology</p>
                </div>
              </motion.div>
              
              <motion.p
                className="text-gray-300 leading-relaxed mb-6 max-w-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Bridging the gap between ancient wisdom and modern technology to 
                preserve the invaluable heritage of Kashmir's Sharda script for future generations.
              </motion.p>

              <motion.div
                className="flex space-x-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <a href="#" className="w-10 h-10 bg-orange-600 hover:bg-orange-700 rounded-full flex items-center justify-center transition-colors duration-300">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-orange-600 hover:bg-orange-700 rounded-full flex items-center justify-center transition-colors duration-300">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-orange-600 hover:bg-orange-700 rounded-full flex items-center justify-center transition-colors duration-300">
                  <Mail className="w-5 h-5" />
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {['About Project', 'Research Papers', 'Documentation', 'API Access', 'Community'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center space-x-2">
                      <ArrowRight className="w-4 h-4" />
                      <span>{link}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-bold mb-6">Collaborators</h4>
              <ul className="space-y-3">
                {['Kashmir University', 'Digital Heritage Labs', 'AI Research Centers', 'Cultural Organizations', 'International Partners'].map((org) => (
                  <li key={org}>
                    <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors duration-300">
                      {org}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            className="border-t border-gray-700 mt-12 pt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400">
              © 2025 Sharda AI Initiative. Built with passion for preserving cultural heritage.
            </p>
            <p className="text-gray-500 mt-2 text-sm">
              Made with ❤️ for the preservation of Kashmiri heritage
            </p>
          </motion.div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <motion.button
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: scrollYProgress.get() > 0.2 ? 1 : 0, scale: scrollYProgress.get() > 0.2 ? 1 : 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowRight className="w-5 h-5 transform -rotate-90" />
      </motion.button>
    </div>
  );
}