import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-20 right-4 sm:right-8 z-40">
      <button
        onClick={onClick}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-800 to-emerald-600 hover:from-emerald-700 hover:to-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-900/30 border-2 border-white active:scale-95 transition-all duration-200 group"
        title="নতুন পোস্ট তৈরি করুন"
      >
        <Plus className="w-7 h-7 stroke-[2.5] group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
};
