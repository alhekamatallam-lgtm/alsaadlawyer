
import React from 'react';
import { LoadingIcon } from './icons';
import Logo from './Logo';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      {/* Decorative Background Element */}
      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
      </div>

      <div className="text-center z-10 space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="relative inline-block">
          {/* Animated rings around the logo */}
          <div className="absolute -inset-4 border-2 border-primary/10 rounded-2xl animate-spin [animation-duration:10s]"></div>
          <div className="absolute -inset-8 border border-primary/5 rounded-2xl animate-spin [animation-duration:15s] [animation-direction:reverse]"></div>
          
          <div className="loader-pulse">
            <Logo className="h-40 w-40 md:h-52 md:w-52 shadow-2xl shadow-primary/30" />
          </div>
        </div>

        <div className="space-y-3 px-6 max-w-lg mx-auto">
          <h1 className="text-2xl md:text-3xl font-extrabold text-dark tracking-tight">
            مكتب المحامي عبدالله آل سعد
          </h1>
          <div className="h-1 w-12 bg-primary/30 mx-auto rounded-full my-4"></div>
          <p className="text-primary font-bold opacity-90 text-sm md:text-base leading-relaxed max-w-[280px] md:max-w-none mx-auto">
            منصة متابعة القضايا الإدارية لشركة محمد راشد بالحارث وشركاه للتجارة والمقاولات
          </p>
        </div>

        <div className="flex flex-col items-center justify-center pt-8">
          <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-6 py-2.5 rounded-full border border-border shadow-sm">
            <LoadingIcon className="w-6 h-6 text-primary" />
            <span className="text-text font-bold text-xs uppercase tracking-wider">جاري تهيئة البيانات...</span>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 text-[10px] text-text opacity-40 font-black uppercase tracking-widest">
        نظام إدارة الجلسات الذكي • ٢٠٢٤
      </div>
    </div>
  );
};

export default LoadingScreen;
