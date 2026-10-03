import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No saved trips yet',
  description = 'You have not generated any travel itineraries yet. Start planning your first budget-smart adventure now!',
  buttonText = 'Plan Your First Trip',
  buttonLink = '/',
}) => {
  return (
    <div className="card bg-base-100 border border-base-200/90 shadow-sm p-8 sm:p-14 text-center max-w-lg mx-auto my-12 rounded-3xl relative overflow-hidden animate-fade-in-up">
      {/* Friendly Travel Luggage & Route Inline SVG Illustration */}
      <div className="mx-auto w-32 h-32 mb-6 flex items-center justify-center">
        <svg
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          {/* Background soft circle */}
          <circle cx="80" cy="80" r="70" fill="rgba(234, 88, 12, 0.08)" />
          <circle cx="80" cy="80" r="50" fill="rgba(15, 118, 110, 0.08)" />

          {/* Dotted path curve */}
          <path
            d="M30 110 C 45 60, 115 50, 130 95"
            stroke="#ea580c"
            strokeWidth="3"
            strokeDasharray="4 6"
            strokeLinecap="round"
          />

          {/* Travel suitcase */}
          <rect x="52" y="65" width="56" height="48" rx="8" fill="#ffffff" stroke="#ea580c" strokeWidth="3" />
          <rect x="52" y="77" width="56" height="4" fill="rgba(234, 88, 12, 0.15)" />
          {/* Suitcase handle */}
          <path d="M68 65 V55 C 68 51, 92 51, 92 55 V65" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />
          {/* Corner protectors */}
          <path d="M52 75 H58 V65" stroke="#ea580c" strokeWidth="2.5" />
          <path d="M108 75 H102 V65" stroke="#ea580c" strokeWidth="2.5" />
          {/* Wheels */}
          <circle cx="62" cy="116" r="3.5" fill="#1e293b" />
          <circle cx="98" cy="116" r="3.5" fill="#1e293b" />

          {/* Little destination pin */}
          <g transform="translate(118, 48)">
            <path
              d="M12 2 C 6.5 2, 2 6.5, 2 12 C 2 19, 12 28, 12 28 C 12 28, 22 19, 22 12 C 22 6.5, 17.5 2, 12 2 Z"
              fill="#0f766e"
            />
            <circle cx="12" cy="12" r="4" fill="#ffffff" />
          </g>
        </svg>
      </div>

      <h3 className="text-2xl font-black text-base-content mb-2 tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-base-content/70 max-w-sm mx-auto mb-8 leading-relaxed font-normal">
        {description}
      </p>

      <div>
        <Link
          to={buttonLink}
          className="btn btn-primary btn-md rounded-2xl gap-2 font-bold shadow-md shadow-orange-600/25 text-white hover:scale-102 transition-all min-h-[48px] px-6"
        >
          <Sparkles className="w-4 h-4" />
          <span>{buttonText}</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};
