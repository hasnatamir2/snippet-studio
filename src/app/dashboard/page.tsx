import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-semibold">Please sign in</h2>
        <p className="mt-4">Sign in to manage your snippets and workspace.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">Welcome, {user.firstName ?? user.emailAddresses[0].emailAddress}</h2>
      <div className="mt-6">
        <Link href="/snippets" className="btn">My Snippets</Link>
      </div>
    </div>
  );
}