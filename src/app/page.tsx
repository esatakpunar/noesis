"use client";

import { useUser } from "@clerk/nextjs";
import LandingPage from "@/components/LandingPage";
import AppFlow from "@/components/AppFlow";

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;
  return isSignedIn ? <AppFlow /> : <LandingPage />;
}
