"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

export default function Profile() {
  const { user, isLoading, error } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive p-4">
        Error: {error.message}
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-card border">
      {user.picture && (
        <img
          src={user.picture}
          alt={user.name || "User profile"}
          className="w-12 h-12 rounded-full object-cover"
        />
      )}
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{user.name}</span>
        <span className="text-sm text-muted-foreground">{user.email}</span>
      </div>
    </div>
  );
}
