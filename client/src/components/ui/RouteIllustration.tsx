import React from 'react';

export const RouteCurvedLine: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 800 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full overflow-visible pointer-events-none select-none opacity-40 ${className}`}
    aria-hidden="true"
  >
    <path
      d="M10 60 C 200 10, 300 110, 500 50 C 650 0, 720 90, 790 60"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeDasharray="6 8"
      strokeLinecap="round"
    />
    <circle cx="10" cy="60" r="4.5" fill="currentColor" />
    <circle cx="790" cy="60" r="4.5" fill="currentColor" />
  </svg>
);

export const PassportStamp: React.FC<{
  text?: string;
  subtext?: string;
  className?: string;
}> = ({ text = 'BUDGET CERTIFIED', subtext = '₹ VALUE APPROVED', className = '' }) => (
  <div
    className={`inline-flex flex-col items-center justify-center p-2 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 text-primary rotate-[-4deg] select-none ${className}`}
    aria-hidden="true"
  >
    <span className="text-[9px] font-extrabold tracking-widest uppercase leading-tight">
      {text}
    </span>
    <span className="text-[8px] font-bold opacity-75 tracking-wider">
      {subtext}
    </span>
  </div>
);
