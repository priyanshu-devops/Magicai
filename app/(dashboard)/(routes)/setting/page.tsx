"use client";

import { UserProfile } from "@clerk/nextjs";

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>

      {/* Clerk Profile Component with Left Alignment */}
      <div className="flex justify-start">
        <UserProfile routing="hash" />
      </div>
    </div>
  );
}
