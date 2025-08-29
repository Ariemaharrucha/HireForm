import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="relative">
      <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-red-600/30 to-purple-600/30 blur-3xl -z-10"></div>
      <div className="absolute left-0 bottom-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-violet-600/30 to-purple-600/30 blur-3xl -z-10"></div>
      <main className=" border-t-[10px] border-violet-600 overflow-hidden">

        <header className="pt-4 max-w-6xl mx-auto flex justify-between items-center relative z-10">
          <h1 className="text-3xl font-semibold mb-4">Hire<span className="text-violet-600">From</span></h1>
          <div className="flex justify-end items-center gap-4">
            <SignedOut>
              <SignInButton forceRedirectUrl="/dashboard">
                <button className="bg-blue-600 text-white rounded px-4 py-2 cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton forceRedirectUrl="/dashboard">
                <button className="bg-green-600 text-white rounded px-4 py-2 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="bg-purple-600 text-white rounded px-4 py-2 cursor-pointer hover:bg-purple-700">
                Dashboard
              </Link>
              <UserButton />
            </SignedIn>
          </div>
        </header>

        <section className="py-32">
          <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-2 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="mt-4 font-bold text-4xl tracking-tight sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                  Screen CV Smarter
                  <span className="text-violet-600"> Not Harder.</span>
                </h1>
                <p className="text-xl text-muted-foreground text-pretty max-w-lg">
                  Let AI handle the heavy lifting of CV analysis so you can
                  focus on hiring the right people.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button className="text-lg px-8 py-6 bg-violet-600">
                  Get Started
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-violet-600" />
                  No setup required
                </div>
              </div>
            </div>
            <div className="flex justify-end overflow-hidden">
              <div className="w-full max-w-md"></div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
