import React from 'react';
import { CategoryType } from '../types';
import { ALL_CATEGORIES } from '../data/categories';
import { Service3DIcon } from './All3DServiceIcons';

export const CategoryGrid: React.FC<{ onSelectCategory: (cat: CategoryType) => void; disabled?: CategoryType[] }> = ({ onSelectCategory, disabled = [] }) => {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-3.5 px-1">
        <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
          <span>নাগরিক সেবা সমূহ</span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">৫০+ সেবা</span>
        </h3>
      </div>
      
      {/* Grid of categories with vibrant 3D vector icons */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2.5 sm:gap-3">
        {ALL_CATEGORIES.filter(cat => !disabled.includes(cat.id)).map((item) => {
          return (
            <button
              key={item.id}
              onClick={() => onSelectCategory(item.id)}
              className="flex flex-col items-center justify-center p-2.5 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 shadow-2xs hover:shadow-md transition-all duration-200 hover:border-emerald-200 group active:scale-95 text-center"
            >
              <div className="transform transition-transform group-hover:scale-110 mb-1.5">
                <Service3DIcon id={item.id} className="w-9 h-9 sm:w-10 sm:h-10 drop-shadow-xs" />
              </div>
              <span className="text-[11px] font-bold text-center leading-tight text-slate-700 group-hover:text-emerald-700 line-clamp-1">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
