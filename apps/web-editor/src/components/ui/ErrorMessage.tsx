// apps/web-editor/src/components/ui/ErrorMessage.tsx
import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({
  title = "SYSTEM_FAILURE",
  message,
  onRetry,
}: ErrorMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 border border-red-900/50 bg-red-950/10 rounded-lg backdrop-blur-sm">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4 animate-pulse" />

      <h3 className="text-red-500 font-mono text-xl font-bold tracking-widest uppercase mb-2">
        {title}
      </h3>

      <p className="text-zinc-400 font-mono text-sm text-center max-w-md mb-6">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all font-mono text-xs font-bold uppercase"
        >
          <RefreshCw className="w-4 h-4" />
          Attempt_Reconnect
        </button>
      )}
    </div>
  );
};
