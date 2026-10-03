import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onRetry, onDismiss }) => {
  return (
    <div
      role="alert"
      className="alert bg-rose-50 border-2 border-rose-200 text-rose-950 shadow-md my-4 p-4 rounded-2xl flex items-center justify-between text-left text-sm animate-fade-in-up"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <span className="font-black text-rose-950 block text-xs uppercase tracking-wider">
            Travel Planner Notice
          </span>
          <span className="text-xs sm:text-sm text-rose-800 font-medium">{message}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="btn btn-xs rounded-lg bg-rose-200 hover:bg-rose-300 text-rose-900 border-0 font-bold gap-1 min-h-[32px] px-2.5"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="btn btn-xs btn-ghost btn-circle text-rose-700 hover:bg-rose-200/50"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
