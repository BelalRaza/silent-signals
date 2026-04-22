'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="border-b border-border/50 backdrop-blur-sm bg-card/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">SS</span>
          </div>
          <span className="text-lg font-semibold text-foreground">Silent Signal</span>
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm text-foreground hidden sm:inline">
                Welcome, <span className="font-medium text-foreground">{user?.username || user?.email}</span>
              </span>
              <Button 
                onClick={() => signOut()} 
                variant="outline"
                className="w-full md:w-auto"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button variant="default" className="w-full md:w-auto">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

 