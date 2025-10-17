'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Moon, Sun, User, LogOut, Settings, ShoppingCart } from 'lucide-react';
import { useTheme } from 'next-themes';
import { UserButton, SignInButton, SignUpButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface NavbarProps {
  navItems?: string[];
}

export default function Navbar({
  navItems = ['Home', 'About', 'India', 'Video', 'Marketplace', 'Contact'],
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isSignedIn, user, isLoaded } = useUser();

  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const getHref = (item: string) => {
    const slug = item.toLowerCase().replace(/\s+/g, '-');
    if (slug === 'marketplace' || slug === 'india' || slug === 'video') return `/${slug}`;
    return `#${slug}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">

          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">श</span>
            </div>
            <span className="text-xl font-serif font-bold text-gray-900 dark:text-white">
              Sharda AI
            </span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={getHref(item)}
                  className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-300 font-medium"
                >
                  {item}
                </Link>
              </motion.div>
            ))}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200/50 dark:bg-gray-800/50 hover:bg-gray-300/50 dark:hover:bg-gray-700/50 transition-colors duration-300 border border-gray-300/50 dark:border-gray-600/50"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {/* Cart Icon (for signed-in users) */}
            {isSignedIn && (
              <Link
                href="/cart"
                className="relative p-2 rounded-lg bg-gray-200/50 dark:bg-gray-800/50 hover:bg-gray-300/50 dark:hover:bg-gray-700/50 transition-colors duration-300 border border-gray-300/50 dark:border-gray-600/50"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  0
                </span>
              </Link>
            )}

            {/* Auth Section */}
            {isLoaded && (
              <>
                {isSignedIn ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      Hi, {user?.firstName || 'User'}
                    </span>
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: 'w-9 h-9 rounded-full ring-2 ring-orange-500/20',
                          userButtonPopoverCard: 'shadow-xl',
                        },
                      }}
                      afterSignOutUrl="/"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <SignInButton mode="modal">
                      <button className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-300 font-medium px-4 py-2">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <motion.button
                        className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white px-6 py-2 rounded-full hover:from-orange-600 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Get Started
                      </motion.button>
                    </SignUpButton>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200/50 dark:bg-gray-800/50 hover:bg-gray-300/50 dark:hover:bg-gray-700/50 transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Mobile Cart Icon (for signed-in users) */}
            {isSignedIn && (
              <Link
                href="/cart"
                className="relative p-2 rounded-lg bg-gray-200/50 dark:bg-gray-800/50 hover:bg-gray-300/50 dark:hover:bg-gray-700/50 transition-colors duration-300"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  0
                </span>
              </Link>
            )}

            <button
              className="p-2 rounded-lg bg-gray-200/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="px-4 py-6 space-y-4">
            {/* User Info for Mobile */}
            {isLoaded && isSignedIn && (
              <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user?.firstName?.[0] || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {navItems.map((item) => (
              <Link
                key={item}
                href={getHref(item)}
                className="block text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-300 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}

            {/* Mobile Auth Buttons */}
            {isLoaded && (
              <>
                {isSignedIn ? (
                  <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-300 font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-5 h-5" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        // Clerk will handle sign out
                      }}
                      className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-300 font-medium py-2 w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <SignInButton mode="modal">
                      <button
                        className="w-full text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-300 font-medium py-2 border border-gray-300 dark:border-gray-600 rounded-full"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button
                        className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 text-white px-6 py-3 rounded-full hover:from-orange-600 hover:to-yellow-700 transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Get Started
                      </button>
                    </SignUpButton>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}