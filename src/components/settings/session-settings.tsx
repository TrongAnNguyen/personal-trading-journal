"use client";

import { useState } from "react";
import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";

export function SessionSettings() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onLogout = async () => {
    setIsLoggingOut(true);
    setError(null);
    const result = await signOut();
    if (result?.error) {
      setError(result.error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-3 rounded-md border p-4">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
      <Button
        variant="destructive"
        onClick={onLogout}
        disabled={isLoggingOut}
        className="font-bold"
      >
        {isLoggingOut ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging out...
          </>
        ) : (
          "TERMINATE_SESSION"
        )}
      </Button>
    </div>
  );
}
