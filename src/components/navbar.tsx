"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16 border-b">
      <SignedOut>
        <SignInButton forceRedirectUrl="/dashboard">
          <button className="bg-blue-600 text-white rounded px-4 py-2 cursor-pointer">Sign In</button>
        </SignInButton>
        <SignUpButton forceRedirectUrl="/dashboard">
          <button className="bg-green-600 text-white rounded px-4 py-2 cursor-pointer">Sign Up</button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      </header>
  );
}
