import React from 'react';
import { LucideIcon, ArrowRight, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryText?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  secondaryText,
  onSecondaryAction,
}) => {
  return (
    <div className="p-8 sm:p-12 rounded-2xl bg-[#0c101d] border border-slate-800 text-center flex flex-col items-center justify-center max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 shadow-inner">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
        {secondaryText && onSecondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            {secondaryText}
          </button>
        )}
      </div>
    </div>
  );
};
